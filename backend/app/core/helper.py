from typing import Dict, List
import pandas as pd
import numpy as np
from app.models.header_model import get_all_headers

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


def generate_manual_review_summary(manual_rows: List[Dict]) -> str:
    summary_lines = ["The following rows need manual review:\n"]

    for i, row in enumerate(manual_rows):
        # Check if any value contains "Not Found" (case-insensitive)
        if any(str(value).strip().lower() == "not found" for value in row.values()):
            line = f"Row {i + 2}: "
            cell_values = [f"{k} = {v}" for k, v in row.items()]
            summary_lines.append(line + "; ".join(cell_values))

    if len(summary_lines) == 1:
        return "No rows require manual review."

    return "\n".join(summary_lines)


async def rename_columns_with_labels(df: pd.DataFrame) -> pd.DataFrame:
    all_headers = await get_all_headers()
    
    header_labels = {header['value']: header['label'] for header in all_headers}

    rename_map = {}
    for col in df.columns:
        if col in header_labels:
            rename_map[col] = header_labels[col]
            print(f"Will rename column '{col}' to '{header_labels[col]}'")

    if rename_map:
        df = df.rename(columns=rename_map)
    else:
        print("No columns found that match header values for renaming")

    return df
