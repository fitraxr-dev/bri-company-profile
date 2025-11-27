package services

import (
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

// StockData represents stock information
type StockData struct {
	Symbol            string  `json:"symbol"`
	Name              string  `json:"name"`
	Price             float64 `json:"price"`
	Change            float64 `json:"change"`
	ChangePercent     float64 `json:"changePercent"`
	Volume            string  `json:"volume"`
	DayRange          string  `json:"dayRange"`
	FiftyTwoWeekRange string  `json:"fiftyTwoWeekRange"`
	LastUpdate        string  `json:"lastUpdate"`
	Source            string  `json:"source"`
	FetchedAt         string  `json:"fetchedAt"`
}

// StockService handles stock data operations
type StockService struct{}

// GetStockData fetches BBRI stock data from BRI website
func (ss *StockService) GetStockData() (*StockData, error) {
	url := "https://bri.co.id/informasi-investor"

	// Create HTTP client with timeout
	client := &http.Client{
		Timeout: 15 * time.Second,
	}

	// Create request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	// Set headers
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
	req.Header.Set("Accept-Language", "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7")

	// Make request
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch data: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("failed to fetch data: status code %d", resp.StatusCode)
	}

	// Parse HTML
	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to parse HTML: %v", err)
	}

	// Extract data using selectors
	priceText := strings.TrimSpace(doc.Find("#price").Text())
	changeText := strings.TrimSpace(doc.Find("#plusMinus").Text())
	volumeText := strings.TrimSpace(doc.Find("#volAvg").Text())
	dayRangeText := strings.TrimSpace(doc.Find("#range").Text())
	fiftyTwoWeekRangeText := strings.TrimSpace(doc.Find("#fiveTwoWeek").Text())
	lastUpdateText := strings.TrimSpace(doc.Find("#lastUpdate").Text())

	// Parse price: "3.850,00" -> 3850.00
	price := parseIndonesianNumber(priceText)

	// Parse change and change percent: "+30.00(+0.79%)"
	change, changePercent := parseChange(changeText)

	// Validate data
	if price == 0 {
		return nil, fmt.Errorf("invalid price data from BRI website")
	}

	stockData := &StockData{
		Symbol:            "BBRI",
		Name:              "Bank Rakyat Indonesia (Persero) Tbk",
		Price:             price,
		Change:            change,
		ChangePercent:     changePercent,
		Volume:            volumeText,
		DayRange:          dayRangeText,
		FiftyTwoWeekRange: fiftyTwoWeekRangeText,
		LastUpdate:        lastUpdateText,
		Source:            "BRI Official Website",
		FetchedAt:         time.Now().Format(time.RFC3339),
	}

	return stockData, nil
}

// parseIndonesianNumber converts Indonesian number format to float64
// Example: "3.850,00" -> 3850.00
func parseIndonesianNumber(s string) float64 {
	// Remove dots (thousand separators)
	s = strings.ReplaceAll(s, ".", "")
	// Replace comma with dot (decimal separator)
	s = strings.ReplaceAll(s, ",", ".")
	
	num, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return 0
	}
	return num
}

// parseChange extracts change and change percent
// Example: "+30.00(+0.79%)" -> 30.00, 0.79
// Example: "-30.00(-0.79%)" -> -30.00, -0.79
func parseChange(s string) (float64, float64) {
	if s == "" {
		return 0, 0
	}

	// Regex to match: (+/-)30.00((+/-)0.79%)
	re := regexp.MustCompile(`([+\-])?(\d+\.?\d*)\(([+\-])?(\d+\.?\d*)%\)`)
	matches := re.FindStringSubmatch(s)

	if len(matches) < 5 {
		return 0, 0
	}

	// Parse change value
	changeSign := 1.0
	if matches[1] == "-" || matches[3] == "-" {
		changeSign = -1.0
	}
	changeVal, _ := strconv.ParseFloat(matches[2], 64)
	change := changeVal * changeSign

	// Parse change percent
	percentSign := 1.0
	if matches[3] == "-" {
		percentSign = -1.0
	}
	percentVal, _ := strconv.ParseFloat(matches[4], 64)
	changePercent := percentVal * percentSign

	return change, changePercent
}
