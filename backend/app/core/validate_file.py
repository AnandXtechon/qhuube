from io import BytesIO
from typing import List
import pandas as pd
import numpy as np
from fastapi import UploadFile, HTTPException, APIRouter, File
from app.models.header_model import get_all_headers
from app.models.product_model import get_all_products

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
        print(f"Extracted headers: {headers}")
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
        print(f"DataFrame columns: {df.columns.tolist()}")
        
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
                
                # Check for empty/null values safely
                try:
                    null_mask = df[original_col_name].isnull()
                    
                    # Only check for empty strings if it's an object column
                    if df[original_col_name].dtype == 'object':
                        empty_mask = (df[original_col_name] == '')
                    else:
                        empty_mask = pd.Series([False] * len(df))
                    
                    combined_mask = null_mask | empty_mask
                    
                    null_count = int(null_mask.sum())
                    empty_count = int(empty_mask.sum())
                    total_empty = int(combined_mask.sum())
                    
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
                            'null_count': null_count,
                            'empty_count': empty_count,
                            'total_missing': total_empty,
                            'total_rows': len(df),
                            'percentage': round((total_empty / len(df)) * 100, 2),
                            'missing_rows': missing_rows_display,
                            'has_more_rows': len(missing_rows) > 10
                        })
                        
                except Exception as col_error:
                    print(f"Error processing column {original_col_name}: {str(col_error)}")
                    continue
        
        return {
            'matched_headers': list(matched),
            'missing_headers': [field for field in required_headers if field not in matched],
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

async def enrich_dataframe_with_vat(df: pd.DataFrame) -> pd.DataFrame:
    try:
        print("Starting VAT enrichment...")
        print(f"DataFrame shape: {df.shape}")
        print(f"DataFrame columns: {df.columns.tolist()}")
        
        # Get VAT products from database
        vat_products = await get_all_products()
        print(f"Retrieved {len(vat_products)} VAT products from database")
        
        # Debug: Print first few VAT products
        if vat_products:
            print("Sample VAT products:")
            for i, prod in enumerate(vat_products):
                print(f"  Product {i+1}: {prod}")
        
        # Build lookup dictionary with better key handling
        vat_lookup = {}
        for prod in vat_products:
            try:
                product_type = str(prod.get('product_type', '')).strip().lower()
                country = str(prod.get('country', '')).strip().lower()
                
                if product_type and country:  # Only add if both values exist
                    key = (product_type, country)
                    vat_lookup[key] = prod
                    print(f"Added VAT lookup: {key} -> VAT: {prod.get('vat_rate', 0)}%, Shipping VAT: {prod.get('shipping_vat_rate', 0)}%")
            except Exception as prod_error:
                print(f"Error processing VAT product: {prod_error}")
                continue
        
        print(f"Built VAT lookup with {len(vat_lookup)} entries")
        print(f"VAT lookup keys: {list(vat_lookup.keys())}")
        
        # Check what columns we have in the DataFrame
        available_columns = [col.lower() for col in df.columns]
        print(f"Available columns (lowercase): {available_columns}")
        
        # Try to find the right column names for product_type, country, and price
        product_type_col = None
        country_col = None
        price_col = None
        
        # Look for product type column
        for col in df.columns:
            col_lower = col.lower()
            if any(keyword in col_lower for keyword in ['product', 'type', 'item', 'service']):
                product_type_col = col
                break
        
        # Look for country column
        for col in df.columns:
            col_lower = col.lower()
            if any(keyword in col_lower for keyword in ['country', 'nation', 'location', 'region']):
                country_col = col
                break
        
        # Look for price column
        for col in df.columns:
            col_lower = col.lower()
            if any(keyword in col_lower for keyword in ['price', 'amount', 'cost', 'value', 'total']):
                price_col = col
                break
        
        print(f"Detected columns - Product Type: {product_type_col}, Country: {country_col}, Price: {price_col}")
        
        # Initialize lists for new columns
        vat_rates = []
        vat_amounts = []
        shipping_vat_rates = []
        shipping_vat_amounts = []
        net_amounts = []
        vat_lookup_status = []
        debug_info = []
        
        # Process each row
        for idx, row in df.iterrows():
            try:
                # Get values with better column detection
                if product_type_col:
                    product_type = str(row[product_type_col]).strip().lower()
                else:
                    product_type = str(row.get("product_type", "")).strip().lower()
                
                if country_col:
                    country = str(row[country_col]).strip().lower()
                else:
                    country = str(row.get("country", "")).strip().lower()
                
                if price_col:
                    price = safe_float(row[price_col])
                else:
                    price = safe_float(row.get("price", 0))
                
                print(f"Row {idx}: product_type='{product_type}', country='{country}', price={price}")
                
                # Look up VAT data
                lookup_key = (product_type, country)
                vat_data = vat_lookup.get(lookup_key)
                
                if vat_data:
                    # Extract VAT rates safely
                    vat_rate = safe_float(vat_data.get("vat_rate", 0))
                    shipping_vat_rate = safe_float(vat_data.get("shipping_vat_rate", 0))
                    
                    # Calculate amounts
                    vat_amount = safe_round((vat_rate / 100) * price, 2)
                    shipping_vat_amount = safe_round((shipping_vat_rate / 100) * price, 2)
                    net_amount = safe_round(vat_amount + shipping_vat_amount, 2)
                    
                    lookup_status = "Found"
                    debug_msg = f"VAT found: {vat_rate}% VAT, {shipping_vat_rate}% shipping VAT"
                    print(f"Row {idx}: {debug_msg}")
                else:
                    # No VAT data found - use defaults
                    vat_rate = 0.0
                    shipping_vat_rate = 0.0
                    vat_amount = 0.0
                    shipping_vat_amount = 0.0
                    net_amount = safe_round(price, 2)
                    lookup_status = "Not Found"
                    debug_msg = f"No VAT data found for key: {lookup_key}"
                    print(f"Row {idx}: {debug_msg}")
                    
                    # Try partial matches for debugging
                    partial_matches = []
                    for key in vat_lookup.keys():
                        if key[0] == product_type or key[1] == country:
                            partial_matches.append(key)
                    if partial_matches:
                        print(f"  Partial matches found: {partial_matches}")
                
                # Append to lists
                vat_rates.append(vat_rate)
                vat_amounts.append(vat_amount)
                shipping_vat_rates.append(shipping_vat_rate)
                shipping_vat_amounts.append(shipping_vat_amount)
                net_amounts.append(net_amount)
                vat_lookup_status.append(lookup_status)
                debug_info.append(debug_msg)
                
            except Exception as row_error:
                print(f"Error processing row {idx}: {str(row_error)}")
                # Use safe defaults for this row
                vat_rates.append(0.0)
                vat_amounts.append(0.0)
                shipping_vat_rates.append(0.0)
                shipping_vat_amounts.append(0.0)
                net_amounts.append(0.0)
                vat_lookup_status.append("Error")
                debug_info.append(f"Error: {str(row_error)}")
        
        # Add new columns to dataframe
        df["vat_rate"] = vat_rates
        df["vat_amount"] = vat_amounts
        df["shipping_vat_rate"] = shipping_vat_rates
        df["shipping_vat_amount"] = shipping_vat_amounts
        df["net_amount"] = net_amounts
        df["vat_lookup_status"] = vat_lookup_status
        df["vat_debug_info"] = debug_info
        
        # Summary statistics
        found_count = sum(1 for status in vat_lookup_status if status == "Found")
        not_found_count = sum(1 for status in vat_lookup_status if status == "Not Found")
        error_count = sum(1 for status in vat_lookup_status if status == "Error")
        
        print(f"VAT enrichment completed:")
        print(f"  - Found VAT data: {found_count} rows")
        print(f"  - No VAT data: {not_found_count} rows")
        print(f"  - Errors: {error_count} rows")
        print(f"  - Total VAT amount calculated: {sum(vat_amounts)}")
        print(f"DataFrame shape after enrichment: {df.shape}")
        
        return df
        
    except Exception as e:
        print(f"Error in VAT enrichment: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to enrich data with VAT: {str(e)}")

@router.post("/validate-file")
async def validate_file(files: List[UploadFile] = File(...)):
    results = []
    for file in files:
        try:
            print(f"Processing file: {file.filename}")
            
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
            print(f"Extracted {len(headers)} headers and {len(df)} rows")
            print(f"DataFrame dtypes: {df.dtypes.to_dict()}")
            print(f"First few rows of data:")
            print(df.head().to_string())
            
            if not headers:
                results.append({
                    "file_name": file.filename,
                    "success": False,
                    "message": "No headers found in the file"
                })
                continue
            
            # Validate file data
            validation_result = await validate_file_data(headers, df)
            print("File validation completed")
            
            # Enrich with VAT data
            try:
                enriched_df = await enrich_dataframe_with_vat(df)
                print("VAT enrichment completed successfully")
                
                # Show sample of enriched data
                print("Sample enriched data:")
                vat_columns = ['vat_rate', 'vat_amount', 'shipping_vat_rate', 'shipping_vat_amount', 'net_amount', 'vat_lookup_status']
                available_vat_cols = [col for col in vat_columns if col in enriched_df.columns]
                if available_vat_cols:
                    print(enriched_df[available_vat_cols].head().to_string())
                
                # Convert to JSON-safe format
                # Convert full enriched DataFrame to JSON-safe format
                enriched_df = enriched_df.where(pd.notnull(enriched_df), None)
                validation_result["enriched_data"] = enriched_df.to_dict(orient="records")

                validation_result["enrichment_success"] = True
                validation_result["enrichment_message"] = f"Successfully enriched {len(validation_result['enriched_data'])} rows with VAT data"

            except Exception as enrich_error:
                print(f"VAT enrichment failed: {str(enrich_error)}")
                import traceback
                traceback.print_exc()
                
                # If enrichment fails, still return original data
                try:
                    original_data = dataframe_to_json_safe(df)
                    validation_result["enriched_data"] = original_data
                except Exception as json_error:
                    print(f"JSON conversion also failed: {str(json_error)}")
                    validation_result["enriched_data"] = []
                
                validation_result["enrichment_success"] = False
                validation_result["enrichment_message"] = f"VAT enrichment failed: {str(enrich_error)}"
            
            has_issues = len(validation_result['missing_headers']) > 0 or len(validation_result['data_issues']) > 0
            
            results.append({
                "file_name": file.filename,
                "success": not has_issues,
                "has_issues": has_issues,
                "validation_result": validation_result,
                "message": "File has validation issues" if has_issues else "File validation completed successfully"
            })
            
        except Exception as e:
            print(f"Error processing file {file.filename}: {str(e)}")
            import traceback
            traceback.print_exc()
            results.append({
                "file_name": file.filename,
                "success": False,
                "message": f"Error validating file: {str(e)}"
            })
    
    return {"files": results}
