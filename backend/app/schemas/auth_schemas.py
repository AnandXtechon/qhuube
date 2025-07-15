from pydantic import BaseModel, EmailStr

class SignupSchema(BaseModel):
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    success: bool
    token: str
    user: dict

class LoginResponse(UserResponse):
    pass