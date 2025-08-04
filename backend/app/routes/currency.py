from fastapi import APIRouter
import httpx
from app.models.currency_model import fetch_two_years_ecb_rates
from app.utils.country_mapping import currency_country_map
from app.schemas.currencies_schemas import CurrencyUpdate
from app.core.database import db
from datetime import datetime, timedelta, timezone
import aiohttp
import logging

router = APIRouter()

@router.get("/currency/fetch-two-years")
async def sync_two_year_currency():
    inserted_count = await fetch_two_years_ecb_rates()
    return {
        "message": "2-year historical ECB currency data synced successfully.",
        "records_inserted": inserted_count
    }

@router.post("/currency/init-supported-countries-from-existing-data")
async def init_offline_supported_countries():
    # Step 1: Get all unique currencies in your data
    pipeline = [
        { "$match": { "currency_code": { "$ne": None } } },
        {
            "$group": {
                "_id": "$currency_code",
                "country_name": { "$first": "$currency_name" },
                "country_code": { "$first": "$country_code" },
                "min_date": { "$min": "$date" },
                "max_date": { "$max": "$date" }
            }
        }
    ]


    results = await db.currency_update.aggregate(pipeline).to_list(length=None)

    docs = []
    for item in results:
        docs.append({
            "country_name": item["country_name"],
            "country_code": item["country_code"],
            "currency_code": item["_id"],
            "is_active": True,
            "from_start_date": item["min_date"],
            "last_updated_currency_date": item["max_date"]
        })

    if docs:
        await db.offline_currency_supported_countries.insert_many(docs)
        return {"message": f"{len(docs)} countries initialized successfully."}
    else:
        return {"message": "No currency data found to initialize countries."}
    
currency_update_col = db["currency_update"]
cron_log_col = db["currency_cron_logs"]
supported_col = db["offline_currency_supported_countries"]

ECB_BASE_URL = "https://data-api.ecb.europa.eu/service/data/EXR/D.{currency}.EUR.SP00.A"
HEADERS = {"Accept": "application/vnd.sdmx.data+json;version=1.0.0-wd"}

def date_to_datetime(d: datetime.date) -> datetime:
    return datetime(d.year, d.month, d.day)

@router.post("/currency/daily_live_currency_sync")
async def daily_live_currency_sync():
    today = datetime.now(timezone.utc)
    today_date = today.date()

    supported = await supported_col.find({"is_active": True}).to_list(None)

    all_inserted = 0
    all_failed = 0
    logs = []

    for country in supported:
        currency_code = country["currency_code"]
        currency_name = currency_country_map.get(currency_code, {}).get("country_name", country["country_name"])
        country_code = country["country_code"]

        try:
            last_updated = country.get("last_updated_currency_date")
            if isinstance(last_updated, str):
                last_updated = datetime.strptime(last_updated, "%Y-%m-%d").date()

            from_date = (last_updated + timedelta(days=1)).strftime("%Y-%m-%d")
            to_date = today_date.strftime("%Y-%m-%d")

            if from_date > to_date:
                logs.append(f"{currency_code}: Up-to-date")
                continue

            url = f"{ECB_BASE_URL.format(currency=currency_code)}?startPeriod={from_date}&endPeriod={to_date}"
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.get(url, headers=HEADERS)
                res.raise_for_status()
                data = res.json()

            series_data = data["dataSets"][0].get("series", {})
            date_values = data["structure"]["dimensions"]["observation"][0]["values"]

            if not series_data:
                logs.append(f"{currency_code}: No series data found (possibly all days were holidays).")
                continue

            inserted = 0
            for series_info in series_data.values():
                observations = series_info.get("observations")
                if not observations:
                    logs.append(f"{currency_code}: No observations found from {from_date} to {to_date} (possibly ECB holiday).")
                    continue

                for idx, obs_data in observations.items():
                    date_str = date_values[int(idx)]["id"]
                    rate = obs_data[0]
                    if not rate:
                        continue

                    doc = CurrencyUpdate(
                        date=date_str,
                        country_code=country_code,
                        country_name=currency_name,
                        currency_code=currency_code,
                        currency_name=currency_name,
                        convert_to_currency="EUR",
                        value=round(1 / rate, 6),
                        created_at=today
                    )
                    await currency_update_col.insert_one(doc.model_dump())
                    inserted += 1

            if inserted > 0:
                await supported_col.update_one(
                    {"_id": country["_id"]},
                    {"$set": {"last_updated_currency_date": today_date.strftime("%Y-%m-%d")}}
                )
                logs.append(f"{currency_code}: {inserted} records inserted.")
                all_inserted += 1
            else:
                logs.append(f"{currency_code}: No data inserted (possibly all ECB holidays).")

        except Exception as e:
            logs.append(f"{currency_code}: Failed due to {str(e)}")
            all_failed += 1

    # Determine final cron status
    if all_inserted > 0:
        cron_status = "Updated"
    elif all_failed == 0:
        cron_status = "Holiday"
    else:
        cron_status = "Failed"

    await cron_log_col.insert_one({
        "date": date_to_datetime(today_date),
        "status": cron_status,
        "logs_details": "\n".join(logs),
        "created_at": today
    })

    return {
        "message": f"Sync completed. Success: {all_inserted}, Failed: {all_failed}",
        "logs": logs
    }
