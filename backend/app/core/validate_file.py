from io import BytesIO
from typing import List
import pandas as pd
from fastapi import UploadFile, HTTPException, APIRouter, File
from app.models.header_model import get_all_headers

router = APIRouter()

# Read uploaded file and return headers + DataFrame
async def extract_file_headers(file: UploadFile) -> tuple[list[str], pd.DataFrame]:
    try:
        content = await file.read()
        file_data = BytesIO(content)
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_data)
        elif file.filename.endswith('.txt'):
            df = pd.read_csv(file_data, delimiter='\t')
        else:
            df = pd.read_excel(file_data)
        headers = [str(col).strip().lower() for col in df.columns]
        return headers, df
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading file: {str(e)}"
        )

# Get data type in a user-friendly format
def get_user_friendly_dtype(dtype):
    dtype_str = str(dtype)
    if 'int' in dtype_str:
        return 'Number (Integer)'
    elif 'float' in dtype_str:
        return 'Number (Decimal)'
    elif 'object' in dtype_str:
        return 'Text'
    elif 'datetime' in dtype_str:
        return 'Date/Time'
    elif 'bool' in dtype_str:
        return 'True/False'
    else:
        return 'Unknown'

# Validate headers and check data quality
async def validate_file_data(file_headers: list[str], df: pd.DataFrame) -> dict:
    try:
        # Get all headers from database
        all_headers = await get_all_headers()
        
        # Build alias map and get required headers
        alias_map = {}
        required_headers = []
        header_labels = {}
        
        for header in all_headers:
            value = header['value'].lower()
            required_headers.append(value)
            header_labels[value] = header['label']
            
            # Map the header value itself
            alias_map[value] = value
            # Map label to value
            alias_map[header['label'].lower()] = value
            # Map each alias to value
            for alias in header.get('aliases', []):
                alias_map[alias.lower()] = value
        
        # Find matched and missing headers
        matched = set()
        matched_columns = {}
        
        for file_col in file_headers:
            normalized = file_col.strip().lower()
            mapped_value = alias_map.get(normalized)
            if mapped_value in required_headers:
                matched.add(mapped_value)
                matched_columns[mapped_value] = file_col
        
        # Create detailed missing headers info
        missing_headers_detailed = []
        for field in required_headers:
            if field not in matched:
                missing_headers_detailed.append({
                    'header_value': field,
                    'header_label': header_labels.get(field, field),
                    'expected_name': header_labels.get(field, field),
                    'description': f"Required column '{header_labels.get(field, field)}' is missing from the file"
                })
        
        # Check data quality issues with detailed information
        data_issues = []
        
        for header_value, original_col in matched_columns.items():
            # Find the original column name in the dataframe
            original_col_name = None
            for col in df.columns:
                if str(col).strip().lower() == original_col.lower():
                    original_col_name = col
                    break
            
            if original_col_name is not None:
                # Get column data type
                col_dtype = get_user_friendly_dtype(df[original_col_name].dtype)
                
                # Check for empty/null values
                null_mask = df[original_col_name].isnull()
                empty_mask = (df[original_col_name] == '') if df[original_col_name].dtype == 'object' else pd.Series([False] * len(df))
                combined_mask = null_mask | empty_mask
                
                null_count = null_mask.sum()
                empty_count = empty_mask.sum()
                total_empty = combined_mask.sum()
                
                if total_empty > 0:
                    # Get specific row numbers with missing data (1-indexed for user display)
                    missing_rows = df.index[combined_mask].tolist()
                    missing_rows_display = [str(row + 2) for row in missing_rows[:10]]  # +2 because index starts at 0 and we have header row
                    
                    # Create detailed issue description
                    issue_description = f"Column '{header_labels.get(header_value, header_value)}' has {total_empty} missing values"
                    if len(missing_rows) > 10:
                        issue_description += f" (showing first 10 rows: {', '.join(missing_rows_display)}...)"
                    else:
                        issue_description += f" in rows: {', '.join(missing_rows_display)}"
                    
                    data_issues.append({
                        'header_value': header_value,
                        'header_label': header_labels.get(header_value, header_value),
                        'original_column': original_col_name,
                        'issue_type': 'MISSING_DATA',
                        'issue_description': issue_description,
                        'column_name': header_labels.get(header_value, header_value),
                        'data_type': col_dtype,
                        'null_count': int(null_count),
                        'empty_count': int(empty_count),
                        'total_missing': int(total_empty),
                        'total_rows': len(df),
                        'percentage': round((total_empty / len(df)) * 100, 2),
                        'missing_rows': missing_rows_display,
                        'has_more_rows': len(missing_rows) > 10
                    })
        
        return {
            'matched_headers': list(matched),
            'missing_headers': [field for field in required_headers if field not in matched],  # Keep simple list for backward compatibility
            'missing_headers_detailed': missing_headers_detailed,
            'matched_columns': matched_columns,
            'header_labels': header_labels,
            'data_issues': data_issues,
            'total_rows': len(df)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Validation error: {str(e)}"
        )

@router.post("/validate-file")
async def validate_file(files: List[UploadFile] = File(...)):
    results = []
    for file in files:
        try:
            # Check file type
            allowed_extensions = ['.csv', '.txt', '.xls', '.xlsx']
            file_extension = '.' + file.filename.split('.')[-1].lower()
            if file_extension not in allowed_extensions:
                results.append({
                    "file_name": file.filename,
                    "success": False,
                    "message": f"Unsupported file type: {file_extension}"
                })
                continue
            
            # Extract headers and data from file
            headers, df = await extract_file_headers(file)
            if not headers:
                results.append({
                    "file_name": file.filename,
                    "success": False,
                    "message": "No headers found in the file"
                })
                continue
            
            # Validate file data
            validation_result = await validate_file_data(headers, df)
            has_issues = len(validation_result['missing_headers']) > 0 or len(validation_result['data_issues']) > 0
            
            results.append({
                "file_name": file.filename,
                "success": not has_issues,
                "has_issues": has_issues,
                "validation_result": validation_result,
                "message": "File has validation issues" if has_issues else "File validation completed successfully"
            })
            
        except Exception as e:
            results.append({
                "file_name": file.filename,
                "success": False,
                "message": f"Error validating file: {str(e)}"
            })
    
    return {"files": results}
