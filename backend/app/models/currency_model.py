import httpx
from app.core.database import db
from app.schemas.currencies_schemas import CurrencyUpdate
from app.utils.country_mapping import currency_country_map

currency_update_col = db["currency_update"]

async def fetch_two_years_ecb_rates():
    """
    Fetch exchange rates for ALL currencies from ECB API
    Uses individual requests for each major currency to avoid API limitations
    """
    start_date = "2023-01-01"
    end_date = "2025-08-04"
    
    # Major currencies that ECB provides data for
    major_currencies = [
        "USD", "JPY", "BGN", "CZK", "DKK", "GBP", "HUF", "PLN", "RON",
        "SEK", "CHF", "ISK", "NOK", "TRY", "AUD", "BRL", "CAD", "CNY",
        "HKD", "IDR", "ILS", "INR", "KRW", "MXN", "MYR", "NZD", "PHP",
        "SGD", "THB", "ZAR"
    ]
    
    headers = {"Accept": "application/vnd.sdmx.data+json;version=1.0.0-wd"}
    all_documents = []
    successful_currencies = []
    failed_currencies = []
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        for currency in major_currencies:
            try:
                url = (
                    f"https://data-api.ecb.europa.eu/service/data/EXR/D.{currency}.EUR.SP00.A?"
                    f"startPeriod={start_date}&endPeriod={end_date}"
                )
                
                print(f"Fetching {currency}...")
                response = await client.get(url, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    documents = await process_currency_data(data, currency)
                    all_documents.extend(documents)
                    successful_currencies.append(currency)
                    print(f"  ✓ {currency}: {len(documents)} records")
                elif response.status_code == 404:
                    print(f"  ✗ {currency}: No data available")
                    failed_currencies.append(f"{currency} (no data)")
                else:
                    print(f"  ✗ {currency}: HTTP {response.status_code}")
                    failed_currencies.append(f"{currency} (HTTP {response.status_code})")
                    
            except Exception as e:
                print(f"  ✗ {currency}: Error - {e}")
                failed_currencies.append(f"{currency} (error: {str(e)[:50]})")
                continue
    
    # Insert all documents
    if all_documents:
        await currency_update_col.insert_many(all_documents)
        print(f"\nInserted {len(all_documents)} total records into `currency_update`.")
        
        # Show summary
        print(f"\nSUCCESS: {len(successful_currencies)} currencies processed")
        print(f"Successful: {', '.join(successful_currencies)}")
        
        if failed_currencies:
            print(f"\nFAILED: {len(failed_currencies)} currencies")
            for failed in failed_currencies:
                print(f"  - {failed}")
        
        # Show records per currency
        currency_counts = {}
        for doc in all_documents:
            curr = doc['currency_code']
            currency_counts[curr] = currency_counts.get(curr, 0) + 1
        
        print("\nRecords per currency:")
        for curr, count in sorted(currency_counts.items()):
            print(f"  {curr}: {count} records")
    else:
        print("No documents to insert.")
        print(f"All {len(failed_currencies)} currencies failed:")
        for failed in failed_currencies:
            print(f"  - {failed}")
    
    return len(all_documents)

async def process_currency_data(data, expected_currency=None):
    """
    Process ECB API response data for a single currency
    """
    documents = []
    
    # Extract data structure
    series_data = data.get("dataSets", [{}])[0].get("series", {})
    series_dimensions = data.get("structure", {}).get("dimensions", {}).get("series", [])
    observation_dimensions = data.get("structure", {}).get("dimensions", {}).get("observation", [])
    
    if not observation_dimensions:
        return documents
        
    date_values = observation_dimensions[0].get("values", [])

    # Locate currency metadata
    currency_values = None
    for dim in series_dimensions:
        if dim.get("id") == "CURRENCY":
            currency_values = dim.get("values", [])
            break
    
    if not currency_values:
        return documents

    # Process each series
    for series_key, series_info in series_data.items():
        try:
            # Parse series key to get currency index
            parts = series_key.split(":")
            if len(parts) >= 1:
                currency_index = int(parts[0])
                
                if currency_index >= len(currency_values):
                    continue
                    
                currency_info = currency_values[currency_index]
                currency_code = currency_info.get("id")
                currency_name = currency_info.get("name")
                
                if not currency_code:
                    continue
                
                # Skip if this doesn't match expected currency (when fetching individually)
                if expected_currency and currency_code != expected_currency:
                    continue
                
                country_info = currency_country_map.get(
                    currency_code, {"country_code": None, "country_name": None}
                )
                
                observations = series_info.get("observations", {})
                
                for obs_key, obs_data in observations.items():
                    try:
                        obs_index = int(obs_key)
                        if obs_index >= len(date_values):
                            continue
                            
                        date_str = date_values[obs_index].get("id")
                        rate = obs_data[0] if obs_data and len(obs_data) > 0 else None
                        
                        if rate and rate != 0:
                            doc = CurrencyUpdate(
                                date=date_str,
                                country_code=country_info["country_code"],
                                country_name=country_info["country_name"],
                                currency_code=currency_code,
                                currency_name=currency_name,
                                convert_to_currency="EUR",
                                value=round(1 / rate, 6),
                            )
                            documents.append(doc.model_dump())
                    except (ValueError, IndexError, ZeroDivisionError):
                        continue
                        
        except (ValueError, IndexError):
            continue
    
    return documents
