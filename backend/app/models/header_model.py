from app.core.database import db
from bson import ObjectId

async def get_header_by_label(label: str):
    return await db["headers"].find_one({ "label": label})


async def get_all_headers():
    headers_cursor = db.headers.find({})
    headers = await headers_cursor.to_list(length=None)
    return headers


async def create_header(label: str, value: str, aliases: list[str]):
    header = {
        "label": label,
        "value": value,
        "aliases": aliases
    }

    result = await db.headers.insert_one(header)
    header["_id"] = result.inserted_id
    return header


async def update_header(header_id: str, label: str, value: str, aliases: list[str]):
    updated_data = {
        "label": label,
        "value": value,
        "aliases": aliases,
    }

    result = await db.headers.update_one(
        {"_id": ObjectId(header_id)},
        {"$set": updated_data}
    )

    if result.modified_count == 0:
        raise Exception("Header not found or no changes made")
    
    updated_header = await db.headers.findOne({ "_id": ObjectId(header_id) })
    return updated_header



async def delete_header(header_id:str):
    result = await db.headers.delete_one({ "_id": ObjectId(header_id) })

    if result.deleted_count == 0:
        raise Exception("Header not found or  already deleted")
    
    return {
        "success": True,
        "message": "Header deleted"
    }