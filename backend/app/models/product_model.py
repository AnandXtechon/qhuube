from app.core.database import db
from bson import ObjectId

async def get_all_products():
    product_cursor = db.products.find({})
    products = await product_cursor.to_list(length=None)
    # Convert ObjectId to string for each product
    for product in products:
        if "_id" in product:
            product["_id"] = str(product["_id"])
    return products


async def create_product(product_type: str, country: str, vat_rate: float, vat_category: str, shipping_vat_rate: float):
    product = {
        "product_type": product_type,
        "country": country,
        "vat_rate": vat_rate,
        "vat_category": vat_category,
        "shipping_vat_rate": shipping_vat_rate
    }

    result = await db.products.insert_one(product)
    product["_id"] = result.inserted_id
    return product


async def update_product(product_id: str, product_type: str, country: str, vat_rate: float, vat_category: str, shipping_vat_rate: float):
    updated_data = {
        "product_type": product_type,
        "country": country,
        "vat_rate": vat_rate,
        "vat_category": vat_category,
        "shipping_vat_rate": shipping_vat_rate
    }

    result = await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": updated_data}
    )

    if result.modified_count == 0:
        raise Exception("Product not found or no changes made")

    updated_product = await db.products.find_one({ "_id": ObjectId(product_id)})
    return updated_product


async def delete_product(product_id: str):
    result = await db.products.delete_one({ "_id": ObjectId(product_id) })

    if result.deleted_count == 0:
        raise Exception("Product not found or already deleted")
    
    return {
        "success": True,
        "message": "Product deleted"
    }