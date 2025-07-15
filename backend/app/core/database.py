from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb+srv://anandpande:L7IMGPqJCVo6XVcI@qhuubecluster01.mpqgwky.mongodb.net"
client = AsyncIOMotorClient(MONGO_URI)
db = client["users"]