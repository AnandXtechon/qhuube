from app.core.database import db
from bson import ObjectId
from datetime import datetime

async def get_all_products():
    product_cursor = db.products.find({}).sort("created_at", -1)
    products = await product_cursor.to_list(length=None)
    # Convert ObjectId to string for each product
    for product in products:
        if "_id" in product:
            product["_id"] = str(product["_id"])
        # Convert datetime to ISO string if present
        if "created_at" in product:
            product["created_at"] = product["created_at"].isoformat()
        if "updated_at" in product:
            product["updated_at"] = product["updated_at"].isoformat()
    return products

async def create_product(product_type: str, country: str, vat_rate: float, vat_category: str, shipping_vat_rate: float):
    current_time = datetime.utcnow()
    product = {
        "product_type": product_type,
        "country": country,
        "vat_rate": vat_rate,
        "vat_category": vat_category,
        "shipping_vat_rate": shipping_vat_rate,
        "created_at": current_time,
        "updated_at": current_time
    }
    result = await db.products.insert_one(product)
    product["_id"] = str(result.inserted_id)
    # Convert datetime to ISO string for response
    product["created_at"] = product["created_at"].isoformat()
    product["updated_at"] = product["updated_at"].isoformat()
    return product

async def update_product(product_id: str, product_type: str, country: str, vat_rate: float, vat_category: str, shipping_vat_rate: float):
    updated_data = {
        "product_type": product_type,
        "country": country,
        "vat_rate": vat_rate,
        "vat_category": vat_category,
        "shipping_vat_rate": shipping_vat_rate,
        "updated_at": datetime.utcnow()
    }
    result = await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": updated_data}
    )
    if result.modified_count == 0:
        raise Exception("Product not found or no changes made")
    
    updated_product = await db.products.find_one({"_id": ObjectId(product_id)})
    if updated_product:
        updated_product["_id"] = str(updated_product["_id"])
        # Convert datetime to ISO string
        if "created_at" in updated_product:
            updated_product["created_at"] = updated_product["created_at"].isoformat()
        if "updated_at" in updated_product:
            updated_product["updated_at"] = updated_product["updated_at"].isoformat()
    return updated_product

async def delete_product(product_id: str):
    result = await db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise Exception("Product not found or already deleted")
    
    return {
        "success": True,
        "message": "Product deleted"
    }
