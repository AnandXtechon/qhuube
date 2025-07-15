from fastapi import APIRouter,HTTPException, Depends
from app.core.security import verify_access_token
from app.schemas.header_schemas import HeaderSchema, HeaderCreateSchema, HeaderListResponse
from app.models.header_model import get_all_headers, create_header, get_header_by_label, delete_header



router = APIRouter()

@router.post("/create/header", response_model=HeaderSchema)
async def create_new_header(header: HeaderCreateSchema, admin = Depends(verify_access_token)):
    
    existing = await get_header_by_label(header.label)
    if existing: 
        raise HTTPException(status_code=400, detail="Header already exists")
    
    return await create_header(
        header.label,
        header.value,
        header.aliases
    )

@router.get("/headers", response_model=HeaderListResponse)
async def get_headers(admin=Depends(verify_access_token)):
    headers = await get_all_headers()
    return {
        "success": True,
        "headers": headers
    }

@router.put("/update/header", response_model=HeaderSchema)
async def update_header(header_id: str, updated: HeaderCreateSchema, admin = Depends(verify_access_token)):
    return await update_header(
        header_id,
        updated.label,
        updated.value,
        updated.aliases
    )

@router.delete("/delete/header/{header_id}")
async def delete_existing_header(header_id: str, admin = Depends(verify_access_token)):
    try:
        return await delete_header(header_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
