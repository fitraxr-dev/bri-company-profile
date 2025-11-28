"""
Stock service for scraping BBRI stock data from BRI website.
"""
import httpx
from bs4 import BeautifulSoup
import re
import logging

logger = logging.getLogger(__name__)


class StockService:
    """Service for fetching BBRI stock data."""
    
    @staticmethod
    async def get_stock_data() -> dict:
        """
        Scrape BBRI stock data from BRI official website.
        Returns stock information including price, change, volume, etc.
        """
        try:
            url = "https://bri.co.id/informasi-investor"
            logger.info(f"Fetching stock data from: {url}")
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            }
            
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'lxml')
            
            # Scrape data based on HTML structure
            price_text = soup.find(id='price').get_text(strip=True) if soup.find(id='price') else ""
            change_text = soup.find(id='plusMinus').get_text(strip=True) if soup.find(id='plusMinus') else ""
            volume_text = soup.find(id='volAvg').get_text(strip=True) if soup.find(id='volAvg') else ""
            day_range_text = soup.find(id='range').get_text(strip=True) if soup.find(id='range') else ""
            fifty_two_week_range_text = soup.find(id='fiveTwoWeek').get_text(strip=True) if soup.find(id='fiveTwoWeek') else ""
            last_update_text = soup.find(id='lastUpdate').get_text(strip=True) if soup.find(id='lastUpdate') else ""
            
            logger.info(f"Raw scraped data: price={price_text}, change={change_text}")
            
            # Parse price: "3.850,00" -> 3850.00
            price = 0.0
            if price_text:
                price = float(price_text.replace('.', '').replace(',', '.'))
            
            # Parse change: "+30.00(+0.79%)" or "-30.00(-0.79%)"
            change = 0.0
            change_percent = 0.0
            
            if change_text:
                # Extract change value and percentage
                change_match = re.search(
                    r'([+\-])?(\d+\.?\d*)\(([+\-])?(\d+\.?\d*)%\)',
                    change_text
                )
                if change_match:
                    change_sign = change_match.group(1) or change_match.group(3) or '+'
                    change = float(change_match.group(2))
                    change_percent = float(change_match.group(4))
                    
                    if change_sign == '-':
                        change = -change
                        change_percent = -change_percent
            
            # Validate data
            if not price or price == 0:
                raise ValueError("Invalid price data from BRI website")
            
            return {
                "success": True,
                "data": {
                    "symbol": "BBRI",
                    "name": "Bank Rakyat Indonesia (Persero) Tbk",
                    "price": price,
                    "change": change,
                    "changePercent": change_percent,
                    "volume": volume_text or "-",
                    "dayRange": day_range_text or "-",
                    "fiftyTwoWeekRange": fifty_two_week_range_text or "-",
                    "lastUpdate": last_update_text or "-",
                    "currency": "IDR",
                    "exchange": "IDX",
                }
            }
        
        except httpx.TimeoutException:
            logger.error("Timeout while fetching stock data")
            return {
                "success": False,
                "error": "Timeout saat mengambil data saham",
                "message": "Request timeout after 15 seconds"
            }
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e}")
            return {
                "success": False,
                "error": "Gagal mengambil data saham",
                "message": f"HTTP {e.response.status_code}"
            }
        except ValueError as e:
            logger.error(f"Data parsing error: {e}")
            return {
                "success": False,
                "error": "Format data tidak valid",
                "message": str(e)
            }
        except Exception as e:
            logger.error(f"Unexpected error fetching stock data: {e}")
            return {
                "success": False,
                "error": "Gagal mengambil data saham",
                "message": str(e)
            }


# Create a singleton instance
stock_service = StockService()
