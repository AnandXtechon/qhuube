import httpx
import xml.etree.ElementTree as ET
import pandas as pd
from datetime import datetime, timedelta

ECB_HIST_URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist.xml'

async def get_ecb_fx_rates() -> dict[str, dict[str, float]]:
    async with httpx.AsyncClient() as client:
        response = await client.get(ECB_HIST_URL)
        response.raise_for_status()
    
    ns = {'gesmes': 'http://www.gesmes.org/xml/2002-08-01',
          'eurofxref': 'http://www.ecb.int/vocabulary/2002-08-01/eurofxref'}
    
    root = ET.fromstring(response.text)
    historical_rates = {}
    
    try:
        # Find all Cube elements with 'time' attribute (these are the date cubes)
        date_cubes = []
        for cube in root.findall('.//eurofxref:Cube', ns):
            if 'time' in cube.attrib:
                date_cubes.append(cube)
        
        if not date_cubes:
            # Fallback: try without namespaces
            root_no_ns = ET.fromstring(response.text)
            for elem in root_no_ns.iter():
                if '}' in elem.tag:
                    elem.tag = elem.tag.split('}')[1]
            
            for cube in root_no_ns.findall('.//Cube'):
                if 'time' in cube.attrib:
                    date_cubes.append(cube)
        
        # Process each date cube
        for daily_cube in date_cubes:
            if 'time' not in daily_cube.attrib:
                continue
                
            date_str = daily_cube.attrib['time']
            daily_rates = {'EUR': 1.0}
            
            # Find currency rate cubes within this date cube
            if hasattr(daily_cube, 'findall'):
                rate_cubes = daily_cube.findall('eurofxref:Cube', ns) if ns else daily_cube.findall('Cube')
            else:
                rate_cubes = daily_cube.findall('Cube')
            
            for rate_cube in rate_cubes:
                if 'currency' in rate_cube.attrib and 'rate' in rate_cube.attrib:
                    currency = rate_cube.attrib['currency']
                    rate = float(rate_cube.attrib['rate'])
                    daily_rates[currency] = rate
            
            historical_rates[date_str] = daily_rates
    
    except Exception as e:
        print(f"Error parsing ECB XML: {e}")
        raise
    
    return historical_rates


def get_fx_rate_for_date(ecb_rates: dict, order_date: str, currency: str) -> float:
    """
    Get FX rate for a specific date and currency.
    If exact date not found, look for the most recent previous date.
    """
    if currency == "EUR":
        return 1.0
    
    # Try exact date first
    if order_date in ecb_rates and currency in ecb_rates[order_date]:
        return ecb_rates[order_date][currency]
    
    # If exact date not found, look for most recent previous date
    try:
        target_date = datetime.strptime(order_date, '%Y-%m-%d')
        
        # Sort dates in descending order and find the most recent date before target
        sorted_dates = sorted(ecb_rates.keys(), reverse=True)
        
        for date_str in sorted_dates:
            rate_date = datetime.strptime(date_str, '%Y-%m-%d')
            if rate_date <= target_date and currency in ecb_rates[date_str]:
                return ecb_rates[date_str][currency]
                
    except ValueError as e:
        print(f"Error parsing date {order_date}: {e}")
    
    # If no rate found, return None
    return None
