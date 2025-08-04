from bson import ObjectId
from pydantic import BaseModel, Field
from typing  import Literal, Optional
from datetime import datetime, timezone


class CurrencyUpdate(BaseModel):
    date: str
    country_code: str
    country_name: str
    currency_code: str
    currency_name: str
    convert_to_currency: str = "EUR"
    value: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OfflineCurrencyCountry(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    country_name: str
    country_code: str
    currency_code: str
    is_active: bool
    from_start_date: str
    last_updated_currency_date: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class CurrencyCronLog(BaseModel):
    date: str
    status: Literal["Updated", "Failed", "Holiday"]
    logs_details: str
    created_at: datetime = Field(default_factory=lambda: datetime(timezone.utc))