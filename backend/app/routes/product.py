from fastapi import APIRouter, HTTPException, Depends
from app.core.security import verify_access_token
from app.schemas.product_schemas import ProductSchema, ProductCreateSchema, ProductListResponse
from app.models.product_model import get_all_products, create_product, update_product, delete_product
from fastapi import UploadFile, File
from openpyxl import load_workbook
from io import BytesIO
from datetime import datetime

router = APIRouter()

@router.post("/create/product", response_model=ProductSchema)
async def create_new_product(product: ProductCreateSchema, admin=Depends(verify_access_token)):
    product_data = await create_product(
        product_type=product.product_type,
        country=product.country,
        vat_rate=product.vat_rate,
        vat_category=product.vat_category,
        shipping_vat_rate=product.shipping_vat_rate,
    )
    return ProductSchema(**product_data)


@router.get("/products", response_model=ProductListResponse)
async def get_products(admin=Depends(verify_access_token)):
    products = await get_all_products()
    return {
        "success": True,
        "products": products
    }

@router.put("/update/product/{product_id}", response_model=ProductSchema)
async def update_existing_product(product_id: str, updated: ProductCreateSchema, admin=Depends(verify_access_token)):
    try:
        updated_product = await update_product(
            product_id=product_id,
            product_type=updated.product_type,
            country=updated.country,
            vat_rate=updated.vat_rate,
            vat_category=updated.vat_category,
            shipping_vat_rate=updated.shipping_vat_rate
        )
        return ProductSchema(**updated_product)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/delete/product/{product_id}")
async def delete_existing_product(product_id: str, admin=Depends(verify_access_token)):
    try:
        return await delete_product(product_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


# Import products from JSON
@router.post("/imports/products/json")
async def import_products_json(data: dict, admin=Depends(verify_access_token)):
    products = data.get("products", [])
    success_count = 0
    errors = []
    
    for idx, row in enumerate(products, start=1):
        try:
            product = ProductCreateSchema(**row)
            await create_product(
                product_type=product.product_type,
                country=product.country,
                vat_rate=product.vat_rate,
                vat_category=product.vat_category,
                shipping_vat_rate=product.shipping_vat_rate,
            )
            success_count += 1
        except Exception as e:
            errors.append(f"Row {idx}: {str(e)}")
    
    return {
        "imported": success_count,
        "errors": errors
    }
