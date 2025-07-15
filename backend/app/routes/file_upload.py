from fastapi import APIRouter, File, UploadFile, HTTPException
from app.core.mapping import resolve_headers, HEADERS_ALIASES
import pandas as pd
import io

# Create a new API router instance
router = APIRouter()

# Define a POST route to handle file uploads
@router.post("/upload-tax-file")
async def upload_tax_file(file: UploadFile = File(...)):
    # Check if the uploaded file has a supported extension
    if not file.filename.endswith((".xlsx", ".xls", ".csv")):
        # Raise an HTTP 400 error if the file format is invalid
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only Excel or CSV allowed."
        )

    try:
        # Read the entire file content asynchronously into memory
        contents = await file.read()

        # If it's a CSV file, decode the byte content to a string and parse using pandas
        if file.filename.endswith(".csv"):
            decoded = contents.decode("utf-8")           # Decode bytes to UTF-8 string
            df = pd.read_csv(io.StringIO(decoded))       # Read CSV from string buffer

        # For Excel files (.xlsx or .xls), read it from a byte stream
        else:
            df = pd.read_excel(io.BytesIO(contents))     # Read Excel file from bytes

        # Extract the original column headers from the uploaded file
        original_headers = df.columns.tolist()

        # Use custom logic to resolve and map headers to standardized field names
        header_mapping = resolve_headers(original_headers, HEADERS_ALIASES)

        # Rename the dataframe columns based on the resolved header mapping
        df.rename(columns=header_mapping, inplace=True)

        # Optional: Prepare the final structured output (disabled here)
        # normalized_data = df[[*header_mapping.values()]].to_dict(orient="records")

        # Return the header mapping to the client (e.g., for review or frontend mapping)
        return {"mapped_fields": header_mapping}

    except Exception as e:
        # Catch and report any processing errors as HTTP 500
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process file: {str(e)}"
        )