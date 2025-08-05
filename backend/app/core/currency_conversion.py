from collections import defaultdict
from pymongo import DESCENDING
from datetime import datetime
from app.core.database import db

async def get_ecb_fx_rates_from_db() -> dict[str, dict[str, float]]:
    historical_rates = defaultdict(dict)
    cursor = db["currency_update"].find().sort("date", DESCENDING)

    async for doc in cursor:
        date = doc.get("date")
        currency = doc.get("currency_code")
        value = doc.get("value")
        if date and currency and value:
            historical_rates[date][currency.upper()] = value
            historical_rates[date]["EUR"] = 1.0

    return historical_rates


def get_fx_rate_by_date_from_db_rates(rates_dict: dict[str, dict[str, float]], order_date: str, currency: str) -> float:
    currency = currency.upper()
    if currency == "EUR":
        return 1.0

    try:
        target_date = datetime.strptime(order_date, "%Y-%m-%d")

        # Exact match
        if order_date in rates_dict and currency in rates_dict[order_date]:
            return rates_dict[order_date][currency]

        # Find closest date
        closest_date = None
        min_diff = None

        for date_str in rates_dict:
            if currency in rates_dict[date_str]:
                current_date = datetime.strptime(date_str, "%Y-%m-%d")
                diff = abs((current_date - target_date).days)

                if min_diff is None or diff < min_diff:
                    min_diff = diff
                    closest_date = date_str

        if closest_date:
            return rates_dict[closest_date][currency]

    except Exception as e:
        print(f"Error fetching FX rate: {e}")

    return 1.0
