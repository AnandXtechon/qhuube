from app.core.database import db 

async def get_user_by_email(email: str):
    return await db["users"].find_one({ "email": email})

async def create_user(email: str, password: str):
    user = {
        "email": email,
        "password": password
    }

    result = await db["users"].insert_one(user)
    user["_id"] = result.inserted_id
    return user

