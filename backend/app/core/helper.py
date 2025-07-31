import pandas as pd
import numpy as np

# Map frontend types to internal Python-friendly types
TYPE_MAP = {
    "str": "string",
    "string": "string",  # Added this mapping
    "int": "integer", 
    "integer": "integer",  # Added this mapping
    "number": "float",  # Added this mapping for your "number" type
    "float": "float",
    "date": "date",
    "boolean": "boolean",
    "bool": "boolean",  # Added this mapping
    "email": "email",
    "phone": "integer",
    "url": "url", 
    "text": "string",
    "json": "json"
}
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

# Safe conversion to float
def safe_float(value, default=0.0):
    try:
        if pd.isna(value) or value == '' or value is None:
            return default
        return float(value)
    except (ValueError, TypeError):
        return default

# Safe round function that handles NaN and infinity
def safe_round(value, decimals=2):
    try:
        if pd.isna(value):
            return 0.0
        float_val = float(value)
        if np.isinf(float_val):
            return 0.0
        return round(float_val, decimals)
    except (ValueError, TypeError):
        return 0.0

# Check if a value is numeric and potentially problematic for JSON
def is_problematic_numeric(value):
    try:
        if pd.isna(value):
            return True
        if isinstance(value, (int, float, np.integer, np.floating)):
            float_val = float(value)
            return np.isnan(float_val) or np.isinf(float_val)
        return False
    except (ValueError, TypeError):
        return False


# Convert DataFrame to JSON-safe format
def dataframe_to_json_safe(df):
    try:
        # Create a copy to avoid modifying original
        df_clean = df.copy()
        
        # Process each column based on its data type
        for col in df_clean.columns:
            col_dtype = df_clean[col].dtype
            
            if pd.api.types.is_numeric_dtype(col_dtype):
                # Handle numeric columns
                # Replace inf and -inf with 0
                df_clean[col] = df_clean[col].replace([np.inf, -np.inf], 0)
                # Fill NaN with 0
                df_clean[col] = df_clean[col].fillna(0)
            else:
                # Handle non-numeric columns (text, dates, etc.)
                # Fill NaN with empty string for object types
                if col_dtype == 'object':
                    df_clean[col] = df_clean[col].fillna('')
                else:
                    df_clean[col] = df_clean[col].fillna(0)
        
        # Convert to records
        records = df_clean.to_dict(orient="records")
        
        # Final safety check - clean each record
        clean_records = []
        for record in records:
            clean_record = {}
            for key, value in record.items():
                try:
                    # Handle different value types
                    if pd.isna(value):
                        clean_record[key] = 0 if isinstance(value, (int, float, np.integer, np.floating)) else ""
                    elif isinstance(value, (np.integer, np.floating)):
                        # Convert numpy types to Python types
                        float_val = float(value)
                        if np.isnan(float_val) or np.isinf(float_val):
                            clean_record[key] = 0
                        else:
                            clean_record[key] = float_val if isinstance(value, np.floating) else int(value)
                    elif isinstance(value, (int, float)):
                        # Handle Python numeric types
                        if np.isnan(value) or np.isinf(value):
                            clean_record[key] = 0
                        else:
                            clean_record[key] = value
                    else:
                        # Handle strings and other types
                        clean_record[key] = str(value) if value is not None else ""
                except (ValueError, TypeError, OverflowError):
                    # If any conversion fails, use safe default
                    clean_record[key] = ""
            
            clean_records.append(clean_record)
        
        return clean_records
        
    except Exception as e:
        print(f"Error in dataframe_to_json_safe: {str(e)}")
        # Fallback: return empty list if conversion fails completely
        return []



async def validate_file_data(file_headers: list[str], df: pd.DataFrame) -> dict:
    try:
        # Get all headers from database
        all_headers = await get_all_headers()
        
        # Build alias map and get required headers
        alias_map = {}
        required_headers = []
        header_labels = {}
        expected_types = {}
        
        for header in all_headers:
            value = header['value'].lower()
            required_headers.append(value)
            header_labels[value] = header['label']
            
            # Get the raw type from database
            raw_type = header.get('type', 'string')
            print(f"Header: {value}, Raw type from DB: {raw_type}")
            
            # Map the type using TYPE_MAP
            mapped_type = TYPE_MAP.get(raw_type.lower(), 'string')
            expected_types[value] = mapped_type
            
            print(f"Header: {value}, Mapped type: {mapped_type}")
            
            # Map the header value itself
            alias_map[value] = value
            # Map label to value
            alias_map[header['label'].lower()] = value
            # Map each alias to value
            for alias in header.get('aliases', []):
                alias_map[alias.lower()] = value
        
        print("Header Labels", header_labels)
        print("Expected Types", expected_types)
        
        # Find matched and missing headers
        matched = set()
        matched_columns = {}
        for file_col in file_headers:
            normalized = file_col.strip().lower()
            mapped_value = alias_map.get(normalized)
            if mapped_value in required_headers:
                matched.add(mapped_value)
                matched_columns[mapped_value] = file_col
        
        print("Matched columns:", matched_columns)
        
        column_rename_map = {}
        for header_value, original_col in matched_columns.items():
            # Find the exact column name in the DataFrame (case-sensitive)
            for df_col in df.columns:
                if str(df_col).strip().lower() == original_col.lower():
                    column_rename_map[df_col] = header_value
                    break
        
        print(f"Column rename map: {column_rename_map}")
        
        # Rename the DataFrame columns
        df.rename(columns=column_rename_map, inplace=True)
        
        print(f"DataFrame columns after renaming: {df.columns.tolist()}")
        
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
        print(f"DataFrame columns: {df.columns.tolist()}")
        
        # 🔧 UPDATED: Now use the standardized column names directly
        for header_value in matched:
            print(f"\nProcessing column: {header_value}")
            
            # The column should now exist with the standardized name
            if header_value not in df.columns:
                print(f"Could not find standardized column {header_value} in dataframe")
                continue
            
            print(f"Found standardized column name: {header_value}")
            
            # Get column data type
            col_dtype = get_user_friendly_dtype(df[header_value].dtype)
            
            # Check for empty/null values safely
            try:
                null_mask = df[header_value].isnull()
                
                # Only check for empty strings if it's an object column
                empty_mask = df[header_value].astype(str).str.strip().isin(['', 'nan', 'None'])
                
                combined_mask = null_mask | empty_mask
                
                null_count = int(null_mask.sum())
                empty_count = int(empty_mask.sum())
                total_empty = int(combined_mask.sum())
                
                if total_empty > 0:
                    # Get specific row numbers with missing data (1-indexed for user display)
                    missing_rows = df.index[combined_mask].tolist()
                    missing_rows_display = [str(row + 2) for row in missing_rows]
                    
                    # Create detailed issue description
                    issue_description = f"Column '{header_labels.get(header_value, header_value)}' has {total_empty} missing values"
                    if len(missing_rows) > 10:
                        issue_description += f" (showing first 10 rows: {', '.join(missing_rows_display[:10])}...)"
                    else:
                        issue_description += f" in rows: {', '.join(missing_rows_display)}"
                    
                    data_issues.append({
                        'header_value': header_value,
                        'header_label': header_labels.get(header_value, header_value),
                        'original_column': header_value,  # Now using standardized name
                        'issue_type': 'MISSING_DATA',
                        'issue_description': issue_description,
                        'column_name': header_labels.get(header_value, header_value),
                        'data_type': col_dtype,
                        'null_count': null_count,
                        'empty_count': empty_count,
                        'total_missing': total_empty,
                        'total_rows': len(df),
                        'percentage': round((total_empty / len(df)) * 100, 2),
                        'missing_rows': missing_rows_display,
                        'has_more_rows': len(missing_rows) > 10
                    })
                    
            except Exception as col_error:
                print(f"Error processing missing data for column {header_value}: {str(col_error)}")
            
            # ------------------ Enhanced Data Type Validation ------------------
            try:
                invalid_type_rows = []
                expected_type = expected_types.get(header_value, "string")
                
                print(f"Validating column '{header_value}' against expected type: {expected_type}")
                
                # Get sample of data for debugging
                sample_data = df[header_value].dropna().head(5).tolist()
                print(f"Sample data: {sample_data}")
                
                for idx, val in df[header_value].items():
                    # Skip null/empty values as they're handled separately
                    if pd.isnull(val) or (isinstance(val, str) and val.strip() == ''):
                        continue
                    
                    is_valid = True
                    error_msg = ""
                    
                    try:
                        if expected_type == 'integer':
                            # Check if it's a boolean first
                            if isinstance(val, bool):
                                is_valid = False
                                error_msg = "Boolean value found where integer expected"
                            else:
                                # Try to convert to int
                                if isinstance(val, str):
                                    # Remove whitespace and check if it's a valid integer string
                                    clean_val = val.strip()
                                    if not clean_val.replace('-', '').replace('+', '').isdigit():
                                        is_valid = False
                                        error_msg = f"Non-integer string: '{val}'"
                                    else:
                                        int(clean_val)
                                else:
                                    # For numeric types, check if it's a whole number
                                    float_val = float(val)
                                    if float_val != int(float_val):
                                        is_valid = False
                                        error_msg = f"Decimal value where integer expected: {val}"
                                    else:
                                        int(float_val)
                        
                        elif expected_type == 'float':
                            try:
                                float(val)
                            except (ValueError, TypeError):
                                is_valid = False
                                error_msg = f"Cannot convert to float: '{val}'"
                        
                        elif expected_type == 'date':
                            # Try multiple date formats
                            date_formats = ["%d-%m-%Y", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%Y/%m/%d"]
                            date_parsed = False
                            
                            for fmt in date_formats:
                                try:
                                    pd.to_datetime(str(val), format=fmt, errors='raise')
                                    date_parsed = True
                                    break
                                except:
                                    continue
                            
                            if not date_parsed:
                                try:
                                    pd.to_datetime(str(val), errors='raise')
                                    date_parsed = True
                                except:
                                    is_valid = False
                                    error_msg = f"Invalid date format: '{val}'"
                                    
                        
                        elif expected_type == 'text_only':
                            # New validation: text that shouldn't contain only numbers
                            str_val = str(val).strip()
                            # Check if the value is purely numeric (including decimals)
                            if re.match(r'^-?\d+\.?\d*$', str_val):
                                is_valid = False
                                error_msg = f"Numeric value found where text expected: '{val}'"
                        
                        elif expected_type == 'string':
                            # Enhanced string validation
                            str_val = str(val).strip()
                            
                            # Check for business logic rules based on column name
                            if header_value == 'product_type':
                                # Special validation for product_type - shouldn't be purely numeric
                                if re.match(r'^-?\d+\.?\d*$', str_val):
                                    is_valid = False
                                    error_msg = f"Product type should not be a number: '{val}'"
                                # Could also check against known product types
                                elif len(str_val) < 2:
                                    is_valid = False
                                    error_msg = f"Product type too short: '{val}'"
                            
                            elif header_value == 'country':
                                # Country names shouldn't be numbers
                                if re.match(r'^-?\d+\.?\d*$', str_val):
                                    is_valid = False
                                    error_msg = f"Country should not be a number: '{val}'"
                            
                            elif header_value == 'currency':
                                # Currency codes should be 3 letters
                                if not re.match(r'^[A-Z]{3}$', str_val.upper()):
                                    is_valid = False
                                    error_msg = f"Invalid currency code format: '{val}' (should be 3 letters like EUR, USD)"
                            
                            # General string validation - just ensure it can be converted to string
                            try:
                                str(val)
                            except:
                                is_valid = False
                                error_msg = f"Cannot convert to string: '{val}'"
                    
                    except Exception as validation_error:
                        is_valid = False
                        error_msg = f"Validation error: {str(validation_error)}"
                    
                    if not is_valid:
                        print(f"Type validation failed for value '{val}' at row {idx + 2}: {error_msg}")
                        invalid_type_rows.append(idx + 2)  # +2 for 1-indexed + header row
                
                if invalid_type_rows:
                    invalid_rows_display = invalid_type_rows[:10]
                    issue_description = f"Column '{header_labels.get(header_value, header_value)}' has invalid {expected_type} values in rows: {', '.join(map(str, invalid_rows_display))}"
                    if len(invalid_type_rows) > 10:
                        issue_description += "..."
                    
                    data_issues.append({
                        'header_value': header_value,
                        'header_label': header_labels.get(header_value, header_value),
                        'original_column': header_value,  # Now using standardized name
                        'issue_type': 'INVALID_TYPE',
                        'issue_description': issue_description,
                        'column_name': header_labels.get(header_value, header_value),
                        'expected_type': expected_type,
                        'invalid_rows': invalid_rows_display,
                        'invalid_count': len(invalid_type_rows),
                        'total_rows': len(df),
                        'percentage': round((len(invalid_type_rows) / len(df)) * 100, 2),
                        'has_more_rows': len(invalid_type_rows) > 10
                    })
            
            except Exception as type_error:
                print(f"Error during type validation for column {header_value}: {str(type_error)}")
        
        print("Final dataframe columns:", df.columns.tolist())
        
        return {
            'matched_headers': list(matched),
            'missing_headers': [field for field in required_headers if field not in matched],
            'missing_headers_detailed': missing_headers_detailed,
            'matched_columns': {v: v for v in matched},  # Now both key and value are standardized
            'header_labels': header_labels,
            'data_issues': data_issues,
            'total_rows': len(df),
            'expected_types': expected_types,
            # 'column_rename_map': column_rename_map  # Optional: return the mapping used
        }
    
    except Exception as e:
        print(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Validation error: {str(e)}"
        )
