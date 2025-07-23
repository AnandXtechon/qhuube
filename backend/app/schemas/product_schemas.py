from typing import List
import typing
from pydantic import BaseModel, Field
from pydantic import GetCoreSchemaHandler, GetJsonSchemaHandler
from pydantic_core import core_schema
from bson import ObjectId

class PyObjectId(ObjectId):

    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type:typing.Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.no_info_after_validator_function(
            cls.validate,
            core_schema.str_schema(),
            serialization=core_schema.plain_serializer_function_ser_schema(str),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(
        cls, core_schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler
    ) -> dict:
        return {"type": "string"}
    

class ProductCreateSchema(BaseModel):
        product_type: str
        country: str
        vat_rate: float
        vat_category: str
        shipping_vat_rate: float


class ProductUpdateSchema(BaseModel):
        product_type: str
        country: str
        vat_rate: float
        vat_category: str
        shipping_vat_rate: float

class ProductSchema(ProductCreateSchema):
    id: PyObjectId = Field(..., alias="_id")
    class Config:
        populate_by_name = True



class ProductListResponse(BaseModel):
    success: bool
    products: List[ProductSchema]


class ProductDeleteResponse(BaseModel):
    success: bool
    message: str
