import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Service untuk mengambil data saham BRI
 * Scraping langsung dari website BRI resmi
 */
class StockService {
  /**
   * Mengambil data saham BBRI dari situs BRI resmi
   */
  async getStockFromBRI() {
    try {
      const url = "https://bri.co.id/informasi-investor";
      console.log("Fetching stock data from:", url);

      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        timeout: 15000,
      });

      const $ = cheerio.load(response.data);

      // Scraping berdasarkan struktur HTML yang diberikan
      // 1. Ambil harga saham dari #price
      const priceText = $("#price").text().trim();

      // 2. Ambil perubahan dan persentase dari #plusMinus
      const changeText = $("#plusMinus").text().trim();

      // 3. Ambil volume dari #volAvg
      const volumeText = $("#volAvg").text().trim();

      // 4. Ambil Day's Range dari #range
      const dayRangeText = $("#range").text().trim();

      // 5. Ambil 52wk Range dari #fiveTwoWeek
      const fiftyTwoWeekRangeText = $("#fiveTwoWeek").text().trim();

      // 6. Ambil last update dari #lastUpdate
      const lastUpdateText = $("#lastUpdate").text().trim();

      console.log("Raw scraped data:", {
        price: priceText,
        change: changeText,
        volume: volumeText,
        dayRange: dayRangeText,
        fiftyTwoWeekRange: fiftyTwoWeekRangeText,
        lastUpdate: lastUpdateText,
      });

      // Parsing data
      // Price: "3.850,00" -> 3850.00
      const price = priceText
        ? parseFloat(priceText.replace(/\./g, "").replace(",", "."))
        : 0;

      // Change: "+30.00(+0.79%)" atau "-30.00(-0.79%)"
      let change = 0;
      let changePercent = 0;

      if (changeText) {
        // Extract change value: "+30.00(+0.79%)" -> ["30.00", "0.79"]
        const changeMatch = changeText.match(
          /([\+\-])?(\d+\.?\d*)\(([\+\-])?(\d+\.?\d*)%\)/
        );
        if (changeMatch) {
          const changeSign = changeMatch[1] || changeMatch[3] || "+";
          change = parseFloat(changeMatch[2]) * (changeSign === "-" ? -1 : 1);
          changePercent =
            parseFloat(changeMatch[4]) * (changeSign === "-" ? -1 : 1);
        }
      }

      // Volume: "313.903.600,00" -> keep as string dengan format
      const volume = volumeText || "-";

      // Day's Range: "3.820,00 - 3.910,00" -> keep as is
      const dayRange = dayRangeText || "-";

      // 52wk Range: "3.360,00 - 4.870,00" -> keep as is
      const fiftyTwoWeekRange = fiftyTwoWeekRangeText || "-";

      // Validasi data
      if (!price || price === 0) {
        throw new Error("Invalid price data from BRI website");
      }

      return {
        success: true,
        data: {
          symbol: "BBRI",
          name: "Bank Rakyat Indonesia (Persero) Tbk",
          price: price,
          change: change,
          changePercent: changePercent,
          volume: volume,
          dayRange: dayRange,
          fiftyTwoWeekRange: fiftyTwoWeekRange,
          lastUpdate: lastUpdateText || new Date().toLocaleString("id-ID"),
          source: "BRI Website",
        },
      };
    } catch (error) {
      console.error("Error fetching from BRI website:", error.message);
      throw error;
    }
  }

  /**
   * Mengambil data saham dengan fallback ke mock data
   */
  async getStockData() {
    try {
      // Ambil data dari BRI website
      return await this.getStockFromBRI();
    } catch (briError) {
      console.log("BRI website failed, using mock data...");
      console.error("Error details:", briError.message);

      // Jika gagal, gunakan data mock yang realistis
      return this.getMockData();
    }
  }

  /**
   * Data mock untuk development/fallback
   */
  getMockData() {
    // Generate random price changes untuk simulasi
    const basePrice = 3850;
    const randomChange = (Math.random() - 0.5) * 100; // -50 to +50
    const price = basePrice + randomChange;
    const change = randomChange;
    const changePercent = (change / basePrice) * 100;

    // Format waktu Indonesia
    const now = new Date();
    const lastUpdate = now.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      success: true,
      data: {
        symbol: "BBRI",
        name: "Bank Rakyat Indonesia (Persero) Tbk",
        price: Math.round(price),
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: "313.903.600,00",
        dayRange: "3.820,00 - 3.910,00",
        fiftyTwoWeekRange: "3.360,00 - 4.870,00",
        lastUpdate: lastUpdate,
        source: "Mock Data (Demo)",
      },
    };
  }
}

// module.exports = new StockService();
export default new StockService();
