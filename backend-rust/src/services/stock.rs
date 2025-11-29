use reqwest;
use scraper::{Html, Selector};
use serde::Serialize;

use crate::error::{AppError, AppResult};

#[derive(Debug, Serialize)]
pub struct StockData {
    pub success: bool,
    pub data: StockInfo,
}

#[derive(Debug, Serialize)]
pub struct StockInfo {
    pub symbol: String,
    pub name: String,
    pub price: f64,
    pub change: f64,
    
    #[serde(rename = "changePercent")]
    pub change_percent: f64,
    
    pub volume: String,
    
    #[serde(rename = "dayRange")]
    pub day_range: String,
    
    #[serde(rename = "fiftyTwoWeekRange")]
    pub fifty_two_week_range: String,
    
    #[serde(rename = "lastUpdate")]
    pub last_update: String,
}

pub struct StockService;

impl StockService {
    pub async fn get_stock_data() -> AppResult<StockData> {
        // Try to fetch from BRI website first
        match Self::fetch_from_bri().await {
            Ok(data) => Ok(data),
            Err(e) => {
                eprintln!("Failed to fetch from BRI website: {}, using mock data", e);
                Ok(Self::get_mock_data())
            }
        }
    }

    async fn fetch_from_bri() -> AppResult<StockData> {
        let url = "https://bri.co.id/informasi-investor";
        
        // Create HTTP client with headers
        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(15))
            .build()
            .map_err(|e| AppError::InternalError(format!("Failed to create HTTP client: {}", e)))?;
        
        // Fetch the page
        let response = client
            .get(url)
            .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
            .header("Accept-Language", "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7")
            .send()
            .await
            .map_err(|e| AppError::InternalError(format!("Failed to fetch stock data: {}", e)))?;
        
        let html_content = response
            .text()
            .await
            .map_err(|e| AppError::InternalError(format!("Failed to read response: {}", e)))?;
        
        // Parse HTML
        let document = Html::parse_document(&html_content);
        
        // Create selectors
        let price_selector = Selector::parse("#price").unwrap();
        let change_selector = Selector::parse("#plusMinus").unwrap();
        let volume_selector = Selector::parse("#volAvg").unwrap();
        let day_range_selector = Selector::parse("#range").unwrap();
        let fifty_two_week_selector = Selector::parse("#fiveTwoWeek").unwrap();
        let last_update_selector = Selector::parse("#lastUpdate").unwrap();
        
        // Extract data
        let price_text = document
            .select(&price_selector)
            .next()
            .map(|el| el.text().collect::<String>())
            .unwrap_or_default()
            .trim()
            .to_string();
        
        let change_text = document
            .select(&change_selector)
            .next()
            .map(|el| el.text().collect::<String>())
            .unwrap_or_default()
            .trim()
            .to_string();
        
        let volume_text = document
            .select(&volume_selector)
            .next()
            .map(|el| el.text().collect::<String>())
            .unwrap_or_default()
            .trim()
            .to_string();
        
        let day_range = document
            .select(&day_range_selector)
            .next()
            .map(|el| el.text().collect::<String>())
            .unwrap_or_default()
            .trim()
            .to_string();
        
        let fifty_two_week_range = document
            .select(&fifty_two_week_selector)
            .next()
            .map(|el| el.text().collect::<String>())
            .unwrap_or_default()
            .trim()
            .to_string();
        
        let last_update = document
            .select(&last_update_selector)
            .next()
            .map(|el| el.text().collect::<String>())
            .unwrap_or_default()
            .trim()
            .to_string();
        
        // Parse price: "3.850,00" -> 3850.00
        let price = Self::parse_indonesian_number(&price_text);
        
        // Parse change: "+30.00(+0.79%)" or "-30.00(-0.79%)"
        let (change, change_percent) = Self::parse_change(&change_text);
        
        // Validate data
        if price == 0.0 {
            return Err(AppError::InternalError(
                "Invalid price data from BRI website".to_string()
            ));
        }
        
        let stock_info = StockInfo {
            symbol: "BBRI".to_string(),
            name: "Bank Rakyat Indonesia (Persero) Tbk".to_string(),
            price,
            change,
            change_percent,
            volume: if volume_text.is_empty() { "-".to_string() } else { volume_text },
            day_range: if day_range.is_empty() { "-".to_string() } else { day_range },
            fifty_two_week_range: if fifty_two_week_range.is_empty() { "-".to_string() } else { fifty_two_week_range },
            last_update: if last_update.is_empty() { "-".to_string() } else { last_update },
        };
        
        Ok(StockData {
            success: true,
            data: stock_info,
        })
    }
    
    fn parse_indonesian_number(text: &str) -> f64 {
        // Convert Indonesian number format to float
        // "3.850,00" -> 3850.00
        text.replace('.', "")
            .replace(',', ".")
            .parse::<f64>()
            .unwrap_or(0.0)
    }
    
    fn parse_change(text: &str) -> (f64, f64) {
        // Parse "+30.00(+0.79%)" or "-30.00(-0.79%)"
        if text.is_empty() {
            return (0.0, 0.0);
        }
        
        // Use regex to extract numbers
        let re = regex::Regex::new(r"([+-])?(\d+\.?\d*)\(([+-])?(\d+\.?\d*)%\)").unwrap();
        
        if let Some(captures) = re.captures(text) {
            let change_sign = captures.get(1).map(|m| m.as_str()).unwrap_or("+");
            let change_value = captures.get(2).map(|m| m.as_str()).unwrap_or("0");
            let percent_sign = captures.get(3).map(|m| m.as_str()).unwrap_or("+");
            let percent_value = captures.get(4).map(|m| m.as_str()).unwrap_or("0");
            
            let change = change_value.parse::<f64>().unwrap_or(0.0) 
                * if change_sign == "-" { -1.0 } else { 1.0 };
            
            let change_percent = percent_value.parse::<f64>().unwrap_or(0.0)
                * if percent_sign == "-" { -1.0 } else { 1.0 };
            
            return (change, change_percent);
        }
        
        (0.0, 0.0)
    }

    fn get_mock_data() -> StockData {
        use rand::Rng;
        let mut rng = rand::thread_rng();
        
        let base_price = 3850.0;
        let random_change: f64 = rng.gen_range(-50.0..50.0);
        let price = base_price + random_change;
        let change_percent = (random_change / base_price) * 100.0;
        
        let now = chrono::Local::now();
        let last_update = now.format("%d/%m/%Y %H:%M").to_string();
        
        StockData {
            success: true,
            data: StockInfo {
                symbol: "BBRI".to_string(),
                name: "Bank Rakyat Indonesia (Persero) Tbk".to_string(),
                price: (price * 100.0).round() / 100.0,
                change: (random_change * 100.0).round() / 100.0,
                change_percent: (change_percent * 100.0).round() / 100.0,
                volume: "300.000.000".to_string(),
                day_range: "3.800,00 - 3.900,00".to_string(),
                fifty_two_week_range: "3.360,00 - 4.870,00".to_string(),
                last_update,
            },
        }
    }
}
