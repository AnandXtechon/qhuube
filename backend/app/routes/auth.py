from fastapi import APIRouter, HTTPException
from app.schemas.auth_schemas import SignupSchema, LoginSchema, UserResponse, LoginResponse
from app.models.user_model import get_user_by_email, create_user
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter()

# signup controller
@router.post("/signup", response_model = UserResponse)
async def signup(payload: SignupSchema):
    existing = await get_user_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = await hash_password(payload.password)
    user = await create_user(payload.email, hashed_pw)
    token = create_access_token({ "id": str(user["_id"]), "email": user["email"]})

    return {
        "success": True,
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
        }
    }

# login controller
@router.post("/login", response_model = LoginResponse)
async def login(payload: LoginSchema):
    user = await get_user_by_email(payload.email)
    if not user or not await verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({
        "id": str(user["_id"]),
        "email": user["email"],
    })

    return {
        "success": True,
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"]
        }
    }