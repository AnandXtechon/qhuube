from app.core.database import db
from bson import ObjectId

async def get_header_by_label(label: str):
    return await db["headers"].find_one({"label": label})

async def get_all_headers():
    headers_cursor = db.headers.find({}).sort("created_at", -1)
    headers = await headers_cursor.to_list(length=None)
    # Convert ObjectId to string for each header
    for header in headers:
        if "_id" in header:
            header["_id"] = str(header["_id"])
    return headers


async def create_header(label: str, value: str, aliases: list[str], type: str):
    header = {
        "label": label,
        "value": value,
        "aliases": aliases,
        "type": type
    }
    result = await db.headers.insert_one(header)
    header["_id"] = str(result.inserted_id)  # Convert to string immediately
    return header


async def update_header(header_id: str, label: str, value: str, aliases: list[str], type: str):
    updated_data = {
        "label": label,
        "value": value,
        "aliases": aliases,
        "type": type
    }
    result = await db.headers.update_one(
        {"_id": ObjectId(header_id)},
        {"$set": updated_data}
    )
    if result.modified_count == 0:
        raise Exception("Header not found or no changes made")
    
    # Fixed typo: find_one instead of findOne
    updated_header = await db.headers.find_one({"_id": ObjectId(header_id)})
    if updated_header:
        updated_header["_id"] = str(updated_header["_id"])
    return updated_header


async def delete_header(header_id: str):
    result = await db.headers.delete_one({"_id": ObjectId(header_id)})
    if result.deleted_count == 0:
        raise Exception("Header not found or already deleted")
    
    return {
        "success": True,
        "message": "Header deleted"
    }
