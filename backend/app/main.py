from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, file_upload, header




app = FastAPI(title="Qhuube Tax Complaice")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(file_upload.router, prefix="/api/v1", tags=["File Upload"])
app.include_router(header.router, prefix="/api/v1", tags=["Header"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://qhuube.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)