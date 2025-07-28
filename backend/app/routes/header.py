from fastapi import APIRouter, HTTPException, Depends
from app.core.security import verify_access_token
from app.schemas.header_schemas import HeaderSchema, HeaderCreateSchema, HeaderListResponse
from app.models.header_model import get_all_headers, create_header, update_header, get_header_by_label, delete_header

router = APIRouter()

@router.post("/create/header", response_model=HeaderSchema)
async def create_new_header(header: HeaderCreateSchema, admin=Depends(verify_access_token)):
    try:
        existing = await get_header_by_label(header.label)
        if existing:
            raise HTTPException(status_code=400, detail="Header with this label already exists")
        
        created_header = await create_header(
            header.label,
            header.value,
            header.aliases or [],
            header.type
        )
        return created_header
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create header: {str(e)}")

@router.get("/headers", response_model=HeaderListResponse)
async def get_headers(admin=Depends(verify_access_token)):
    try:
        headers = await get_all_headers()
        return {
            "success": True,
            "headers": headers
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch headers: {str(e)}")

@router.put("/update/header/{header_id}", response_model=dict)
async def update_header_in_db(header_id: str, updated: HeaderCreateSchema, admin=Depends(verify_access_token)):
    try:
        updated_header = await update_header(
            header_id,
            updated.label,
            updated.value,
            updated.aliases or [],
            updated.type

        )
        return {
            "success": True,
            "header": updated_header
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Failed to update header: {str(e)}")

@router.delete("/delete/header/{header_id}")
async def delete_existing_header(header_id: str, admin=Depends(verify_access_token)):
    try:
        result = await delete_header(header_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
