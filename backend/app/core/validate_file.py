from io import BytesIO
import io
from typing import List
import pandas as pd
import numpy as np
from fastapi import UploadFile, HTTPException, APIRouter, File
from fastapi.responses import StreamingResponse
from app.models.header_model import get_all_headers
from app.models.product_model import get_all_products
from app.core.helper import safe_float, safe_round, dataframe_to_json_safe, get_user_friendly_dtype, TYPE_MAP
from openpyxl.styles import PatternFill
from openpyxl.utils.dataframe import dataframe_to_rows
from openpyxl import Workbook
import re

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
        
        # print(f"Extracted headers: {headers}")
        return headers, df
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading file: {str(e)}"
        )

async def validate_file_data(file_headers: list[str], df: pd.DataFrame) -> dict:
    try:
        # Get all headers from database
        all_headers = await get_all_headers()
        
        # Build alias map and get required headers
        alias_map = {}
        required_headers = []
        header_labels = {}
        expected_types = {}
        validation_rules = {}  # New: store additional validation rules
        
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
            
            # Store additional validation rules if any
            validation_rules[value] = header.get('validation_rules', {})
            
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
            print(f"\nProcessing column: {header_value} -> {original_col}")
            
            # Find the original column name in the dataframe
            original_col_name = None
            for col in df.columns:
                if str(col).strip().lower() == original_col.lower():
                    original_col_name = col
                    break
            
            if original_col_name is None:
                print(f"Could not find column {original_col} in dataframe")
                continue
                
            print(f"Found original column name: {original_col_name}")
            
            # Get column data type
            col_dtype = get_user_friendly_dtype(df[original_col_name].dtype)
            
            # Check for empty/null values safely
            try:
                null_mask = df[original_col_name].isnull()
                
                # Only check for empty strings if it's an object column
                if df[original_col_name].dtype == 'object':
                    empty_mask = (df[original_col_name] == '') | (df[original_col_name] == ' ')
                else:
                    empty_mask = pd.Series([False] * len(df))
                
                combined_mask = null_mask | empty_mask
                
                null_count = int(null_mask.sum())
                empty_count = int(empty_mask.sum())
                total_empty = int(combined_mask.sum())
                
                if total_empty > 0:
                    # Get specific row numbers with missing data (1-indexed for user display)
                    missing_rows = df.index[combined_mask].tolist()
                    missing_rows_display = [str(row + 2) for row in missing_rows[:10]]
                    
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
                print(f"Error processing missing data for column {original_col_name}: {str(col_error)}")
            
            # ------------------ Enhanced Data Type Validation ------------------
            try:
                invalid_type_rows = []
                expected_type = expected_types.get(header_value, "string")
                
                print(f"Validating column '{original_col_name}' (header_value: '{header_value}') against expected type: {expected_type}")
                
                # Get sample of data for debugging
                sample_data = df[original_col_name].dropna().head(5).tolist()
                print(f"Sample data: {sample_data}")
                
                for idx, val in df[original_col_name].items():
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
                                    
                        elif expected_type == 'boolean':
                            str_val = str(val).lower().strip()
                            valid_bools = ['true', 'false', '1', '0', 'yes', 'no', 't', 'f', 'y', 'n']
                            if str_val not in valid_bools:
                                is_valid = False
                                error_msg = f"Invalid boolean value: '{val}'"
                                
                        
                        elif expected_type == 'text_only':
                            # New validation: text that shouldn't contain only numbers
                            str_val = str(val).strip()
                            # Check if the value is purely numeric (including decimals)
                            if re.match(r'^-?\d+\.?\d*$', str_val):
                                is_valid = False
                                error_msg = f"Numeric value found where text expected: '{val}'"
                        
                        elif expected_type == 'categorical':
                            # New validation: check against predefined categories
                            allowed_categories = validation_rules.get(header_value, {}).get('allowed_values', [])
                            if allowed_categories and str(val).strip() not in allowed_categories:
                                is_valid = False
                                error_msg = f"Invalid category '{val}'. Allowed values: {', '.join(allowed_categories)}"
                                
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
                        'original_column': original_col_name,
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
                print(f"Error during type validation for column {original_col_name}: {str(type_error)}")
        
        return {
            'matched_headers': list(matched),
            'missing_headers': [field for field in required_headers if field not in matched],
            'missing_headers_detailed': missing_headers_detailed,
            'matched_columns': matched_columns,
            'header_labels': header_labels,
            'data_issues': data_issues,
            'total_rows': len(df),
            'expected_types': expected_types
        }
        
    except Exception as e:
        print(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Validation error: {str(e)}"
        )

async def enrich_dataframe_with_vat(df: pd.DataFrame) -> pd.DataFrame:
    try:
        # Get VAT products from database
        vat_products = await get_all_products()
        print(f"Retrieved {len(vat_products)} VAT products from database")
        
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
                    # print("Vat Lookup", vat_lookup)
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
        df["VAT Rate"] = vat_rates
        df["VAT Amount"] = vat_amounts
        df["Shipping VAT Rate"] = shipping_vat_rates
        df["Shipping VAT Amount"] = shipping_vat_amounts
        df["Net Amount"] = net_amounts
        # df["vat_lookup_status"] = vat_lookup_status
        # df["vat_debug_info"] = debug_info
        


        pd.set_option('display.max_columns', None)
        pd.set_option('display.width', None)
        pd.set_option('display.max_colwidth', None)

        print("DataFrame table (full view):")
       
        print(df)
        
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


@router.post("/download-vat-report")
async def download_vat_report(file: UploadFile = File(...)):
    try:
        # Read headers and the DataFrame
        headers, df = await extract_file_headers(file)

        # Enrich DataFrame with VAT
        enriched_df = await enrich_dataframe_with_vat(df)

        # Format date columns before writing to Excel
        for col in enriched_df.columns:
            if "date" in col.lower():
                enriched_df[col] = pd.to_datetime(enriched_df[col], errors="coerce").dt.strftime("%d-%m-%Y")

        # Write to Excel
        excel_stream = io.BytesIO()
        enriched_df.to_excel(excel_stream, index=False)
        excel_stream.seek(0)

        # Set proper download name
        download_name = file.filename.rsplit('.', 1)[0] + "_vat_report.xlsx"

        return StreamingResponse(
            excel_stream,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={
                "Content-Disposition": f"attachment; filename={download_name}"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not generate download: {str(e)}")

@router.post("/download-vat-issues")
async def download_vat_issues(file: UploadFile = File(...)):
    try:
        headers, df = await extract_file_headers(file)
        validation_result = await validate_file_data(headers, df)

        for col in df.columns:
            if "date" in col.lower():
                df[col] = pd.to_datetime(df[col], errors="coerce").dt.strftime("%d-%m-%Y")

        issues = validation_result.get("data_issues", [])
        missing_headers = validation_result.get("missing_headers_detailed", [])
        header_labels = validation_result.get("header_labels", {})

        # Insert placeholder columns for missing headers
        missing_labels = [mh["header_label"] for mh in missing_headers]
        for label in missing_labels:
            if label not in df.columns:
                df[label] = ""

        # Build issues sheet
        issues_rows = []
        for mh in missing_headers:
            issues_rows.append({
                "Issue Type": "Missing Header",
                "Column": mh["header_label"],
                "Description": mh["description"]
            })
        for issue in issues:
            issues_rows.append({
                "Issue Type": issue["issue_type"],
                "Column": issue["column_name"],
                "Description": issue["issue_description"],
                "Missing Count": issue.get("total_missing", ""),
                "Missing %": issue.get("percentage", "")
            })
        issues_df = pd.DataFrame(issues_rows or [{
            "Issue Type": "None",
            "Column": "All",
            "Description": "No missing headers or data issues found."
        }])

        # --- Create Excel workbook ---
        wb = Workbook()
        ws_data = wb.active
        ws_data.title = "User Data"

        from openpyxl.styles import PatternFill, Font, Border, Side, Alignment
        from openpyxl.utils import get_column_letter
        from openpyxl.utils.dataframe import dataframe_to_rows

        # Fills
        red_fill = PatternFill(start_color="FF9999", end_color="FF9999", fill_type="solid")    # Header or invalid type
        orange_fill = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid")  # Missing values
        header_fill = PatternFill(start_color="D9D9D9", end_color="D9D9D9", fill_type="solid")  # Normal header
        bold_font = Font(bold=True)
        thin_border = Border(
            left=Side(style="thin"), right=Side(style="thin"),
            top=Side(style="thin"), bottom=Side(style="thin")
        )

        # --- Write data ---
        for r in dataframe_to_rows(df, index=False, header=True):
            ws_data.append(r)

        col_name_to_index = {col: idx for idx, col in enumerate(df.columns)}

        # --- Highlight headers ---
        for col_idx, col in enumerate(df.columns, start=1):
            cell = ws_data.cell(row=1, column=col_idx)
            cell.font = bold_font
            cell.border = thin_border
            cell.alignment = Alignment(horizontal="center")
            cell.fill = red_fill if col in missing_labels else header_fill

        # --- Highlight issues ---
        for issue in issues:
            col_name = issue.get("original_column")
            if not col_name or col_name not in col_name_to_index:
                continue

            col_idx = col_name_to_index[col_name] + 1

            # Highlight missing values
            if issue["issue_type"] == "MISSING_DATA":
                for row_str in issue["missing_rows"]:
                    try:
                        row_num = int(row_str)
                        ws_data.cell(row=row_num, column=col_idx).fill = orange_fill
                    except Exception:
                        continue

            # Highlight invalid types
            if issue["issue_type"] == "INVALID_TYPE":
                for row_num in issue["invalid_rows"]:
                    try:
                        ws_data.cell(row=row_num, column=col_idx).fill = red_fill
                    except Exception:
                        continue

        # --- Style data cells + autosize ---
        for row in ws_data.iter_rows(min_row=2):
            for cell in row:
                cell.border = thin_border
                cell.alignment = Alignment(vertical="center")

        for col in ws_data.columns:
            max_len = max((len(str(cell.value)) for cell in col if cell.value), default=10)
            col_letter = get_column_letter(col[0].column)
            ws_data.column_dimensions[col_letter].width = max_len + 2

        # --- Add issues sheet ---
        ws_issues = wb.create_sheet("Validation Issues")
        for r in dataframe_to_rows(issues_df, index=False, header=True):
            ws_issues.append(r)

        for col in ws_issues.iter_cols(min_row=1, max_row=1):
            for cell in col:
                cell.fill = header_fill
                cell.font = bold_font
                cell.border = thin_border

        for row in ws_issues.iter_rows(min_row=2):
            for cell in row:
                cell.border = thin_border
                cell.alignment = Alignment(wrap_text=True, vertical="top")

        for col in ws_issues.columns:
            max_len = max((len(str(cell.value)) for cell in col if cell.value), default=10)
            col_letter = get_column_letter(col[0].column)
            ws_issues.column_dimensions[col_letter].width = max_len + 2

        # --- Output stream ---
        output = io.BytesIO()
        wb.save(output)
        output.seek(0)

        download_name = file.filename.rsplit('.', 1)[0] + "_validation_annotated.xlsx"
        return StreamingResponse(
            output,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={"Content-Disposition": f"attachment; filename={download_name}"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not generate issue report: {str(e)}")
