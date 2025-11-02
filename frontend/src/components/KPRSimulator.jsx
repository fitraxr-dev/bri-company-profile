import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Home, Car, Calculator, RefreshCw } from "lucide-react";

export default function KPRSimulator() {
  const { t } = useTranslation();

  // State untuk input form
  const [loanType, setLoanType] = useState("house"); // 'house' atau 'car'
  const [propertyPrice, setPropertyPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [loanTerm, setLoanTerm] = useState("20");
  const [interestRate, setInterestRate] = useState("6.5");

  // State untuk hasil perhitungan
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Format rupiah
  const formatRupiah = (number) => {
    if (!number) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Format angka dengan pemisah ribuan
  const formatNumber = (number) => {
    if (!number && number !== 0) return "";
    return new Intl.NumberFormat("id-ID").format(number);
  };

  // Hitung cicilan KPR
  const calculateKPR = () => {
    const property = parseFloat(propertyPrice) || 0;
    const downPay = parseFloat(downPayment) || 0;
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const totalMonths = parseFloat(loanTerm) * 12;

    if (property <= 0 || downPay < 0 || monthlyRate < 0 || totalMonths <= 0) {
      alert(t("simulator.validation.invalidInput") || "Input tidak valid");
      return;
    }

    if (downPay > property) {
      alert(
        t("simulator.validation.downPaymentTooHigh") ||
          "DP tidak bisa lebih dari harga properti"
      );
      return;
    }

    const loanAmount = property - downPay;

    if (loanAmount <= 0) {
      alert(t("simulator.validation.invalidLoan") || "Jumlah pinjaman tidak valid");
      return;
    }

    // Rumus: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    // M = cicilan per bulan
    // P = pokok pinjaman
    // r = bunga per bulan
    // n = jumlah bulan
    const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths);
    const denominator = Math.pow(1 + monthlyRate, totalMonths) - 1;
    const monthlyPayment = numerator / denominator;

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    setResult({
      propertyPrice: property,
      downPayment: downPay,
      loanAmount: loanAmount,
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      loanTerm: loanTerm,
      interestRate: interestRate,
      loanType: loanType,
    });

    setShowResult(true);
  };

  // Reset form
  const handleReset = () => {
    setPropertyPrice("");
    setDownPayment("");
    setLoanTerm("20");
    setInterestRate("6.5");
    setResult(null);
    setShowResult(false);
  };

  const downPaymentPercent =
    propertyPrice && downPayment
      ? ((parseFloat(downPayment) / parseFloat(propertyPrice)) * 100).toFixed(1)
      : 0;

  return (
    <section
      id="kpr-simulator"
      className="relative py-16 md:py-24 bg-white overflow-hidden"
      aria-label="Simulasi KPR BRI"
    >
      {/* Subtle background decoration */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #F58220 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #00529C 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bri-primary mb-4">
            {t("simulator.title") || "Simulasi KPR"}
          </h2>
          <p className="font-body text-lg md:text-xl text-bri-charcoal max-w-3xl mx-auto">
            {t("simulator.subtitle") ||
              "Hitung cicilan KPR untuk rumah atau kendaraan Anda dengan bunga kompetitif dari BRI"}
          </p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              {/* Loan Type Selector */}
              <div className="mb-8">
                <h3 className="font-heading text-lg font-semibold text-bri-primary mb-4">
                  {t("simulator.selectType") || "Pilih Tipe Pembiayaan"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* House Button */}
                  <button
                    onClick={() => {
                      setLoanType("house");
                      setShowResult(false);
                    }}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 font-semibold ${
                      loanType === "house"
                        ? "border-bri-orange bg-bri-orange/10 text-bri-primary shadow-md"
                        : "border-gray-300 bg-white text-bri-charcoal hover:border-bri-orange"
                    }`}
                  >
                    <Home size={20} />
                    {t("simulator.house") || "Rumah"}
                  </button>

                  {/* Car Button */}
                  <button
                    onClick={() => {
                      setLoanType("car");
                      setShowResult(false);
                    }}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 font-semibold ${
                      loanType === "car"
                        ? "border-bri-orange bg-bri-orange/10 text-bri-primary shadow-md"
                        : "border-gray-300 bg-white text-bri-charcoal hover:border-bri-orange"
                    }`}
                  >
                    <Car size={20} />
                    {t("simulator.car") || "Kendaraan"}
                  </button>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-6">
                {/* Property/Asset Price */}
                <div>
                  <label className="block font-heading font-semibold text-bri-primary mb-2">
                    {loanType === "house"
                      ? t("simulator.propertyPrice") || "Harga Rumah"
                      : t("simulator.carPrice") || "Harga Kendaraan"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bri-charcoal font-semibold">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={propertyPrice}
                      onChange={(e) => {
                        setPropertyPrice(e.target.value);
                        setShowResult(false);
                      }}
                      placeholder="500000000"
                      className="w-full pl-12 pr-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bri-orange focus:border-transparent font-body"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {propertyPrice &&
                      `${t("simulator.amount") || "Jumlah"}: ${formatRupiah(
                        propertyPrice
                      )}`}
                  </p>
                </div>

                {/* Down Payment */}
                <div>
                  <label className="block font-heading font-semibold text-bri-primary mb-2">
                    {t("simulator.downPayment") || "Uang Muka (DP)"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bri-charcoal font-semibold">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => {
                        setDownPayment(e.target.value);
                        setShowResult(false);
                      }}
                      placeholder="100000000"
                      className="w-full pl-12 pr-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bri-orange focus:border-transparent font-body"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {downPayment && propertyPrice
                      ? `${downPaymentPercent}% dari harga`
                      : "Minimum 10% dari harga properti"}
                  </p>
                </div>

                {/* Loan Term */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-heading font-semibold text-bri-primary mb-2">
                      {t("simulator.loanTerm") || "Tenor Pinjaman"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => {
                          setLoanTerm(e.target.value);
                          setShowResult(false);
                        }}
                        min="1"
                        max="30"
                        className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bri-orange focus:border-transparent font-body"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bri-charcoal font-semibold">
                        {t("simulator.years") || "Tahun"}
                      </span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <label className="block font-heading font-semibold text-bri-primary mb-2">
                      {t("simulator.interestRate") || "Suku Bunga (p.a.)"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => {
                          setInterestRate(e.target.value);
                          setShowResult(false);
                        }}
                        step="0.1"
                        min="0"
                        max="20"
                        className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bri-orange focus:border-transparent font-body"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bri-charcoal font-semibold">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={calculateKPR}
                    className="flex-1 btn bg-bri-orange text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Calculator size={20} />
                    {t("simulator.calculate") || "Hitung"}
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn bg-gray-300 text-bri-charcoal font-semibold py-3 rounded-lg hover:bg-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={20} />
                    {t("simulator.reset") || "Reset"}
                  </button>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-bri-sky rounded-lg p-4 border-l-4 border-bri-orange">
              <p className="text-sm text-bri-charcoal">
                <span className="font-semibold">
                  {t("simulator.note") || "Catatan"}:
                </span>{" "}
                {t("simulator.disclaimer") ||
                  "Simulasi ini hanya untuk perkiraan. Bunga dan persyaratan kredit dapat berbeda sesuai kondisi pasar dan kelayakan kredit Anda."}
              </p>
            </div>
          </div>

          {/* Right: Result Card */}
          <div className="lg:col-span-1">
            {showResult && result ? (
              <div className="sticky top-24 bg-gradient-to-br from-bri-primary to-bri-deep rounded-2xl p-8 text-white shadow-2xl">
                <h3 className="font-heading text-2xl font-bold mb-6 text-center">
                  {t("simulator.result") || "Hasil Simulasi"}
                </h3>

                <div className="space-y-4">
                  {/* Loan Amount */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white/80 text-sm">
                      {t("simulator.loanAmount") || "Jumlah Pinjaman"}
                    </p>
                    <p className="font-heading font-bold text-xl text-bri-orange">
                      {formatRupiah(result.loanAmount)}
                    </p>
                  </div>

                  {/* Monthly Payment */}
                  <div className="bg-white/10 rounded-lg p-4 border-2 border-bri-orange">
                    <p className="text-white/80 text-sm">
                      {t("simulator.monthlyPayment") || "Cicilan per Bulan"}
                    </p>
                    <p className="font-heading font-bold text-2xl text-white">
                      {formatRupiah(result.monthlyPayment)}
                    </p>
                  </div>

                  {/* Total Payment */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white/80 text-sm">
                      {t("simulator.totalPayment") || "Total Pembayaran"}
                    </p>
                    <p className="font-heading font-bold text-lg">
                      {formatRupiah(result.totalPayment)}
                    </p>
                  </div>

                  {/* Total Interest */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-white/80 text-sm">
                      {t("simulator.totalInterest") || "Total Bunga"}
                    </p>
                    <p className="font-heading font-bold text-lg text-amber-300">
                      {formatRupiah(result.totalInterest)}
                    </p>
                  </div>

                  {/* Loan Details */}
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/80">
                          {t("simulator.tenor") || "Tenor"}
                        </span>
                        <span className="font-semibold">{result.loanTerm} tahun</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">
                          {t("simulator.rate") || "Suku Bunga"}
                        </span>
                        <span className="font-semibold">{result.interestRate}% p.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">
                          {t("simulator.downPaymentPercent") || "DP"}
                        </span>
                        <span className="font-semibold">
                          {formatRupiah(result.downPayment)} (
                          {(
                            (result.downPayment / result.propertyPrice) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowResult(false)}
                  className="w-full mt-6 bg-white text-bri-primary font-semibold py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                >
                  {t("simulator.hideResult") || "Tutup Hasil"}
                </button>
              </div>
            ) : (
              <div className="sticky top-24 bg-gradient-to-br from-bri-sky to-white rounded-2xl p-8 border border-gray-300">
                <Calculator className="w-16 h-16 text-bri-orange mx-auto mb-4 opacity-50" />
                <p className="text-center font-heading font-semibold text-bri-primary">
                  {t("simulator.fillForm") ||
                    "Isi formulir di samping untuk melihat hasil simulasi"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
