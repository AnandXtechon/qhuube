from pydantic import BaseModel, Field
from typing import List
from pydantic import GetCoreSchemaHandler, GetJsonSchemaHandler
from pydantic_core import core_schema
from bson import ObjectId
import typing

class PyObjectId(ObjectId):

    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: typing.Any, handler: GetCoreSchemaHandler
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

class HeaderCreateSchema(BaseModel):
    label: str
    value: str
    aliases: List[str] = Field(default_factory=list)


class HeaderSchema(HeaderCreateSchema):
    _id: str


class HeaderListResponse(BaseModel):
    success: bool
    headers: List[HeaderSchema]



