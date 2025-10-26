import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import InfoSahamBRI from "../components/InfoSahamBRI";
import FooterBRI from "../components/FooterBRI";

export default function HomePage() {
  const [pong, setPong] = useState(null);

  useEffect(() => {
    axios
      .get("/api/ping")
      .then((r) => setPong(r.data?.message))
      .catch(() => setPong("no response"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Hero />
      <AboutSection />
      <ServicesSection />

      {/* Section Info Saham BRI - Minimalist */}
      <section className="py-12 bg-gray-50" id="saham">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Informasi Saham BRI
            </h2>
            <p className="text-sm text-gray-600">
              Data real-time dari bursa efek
            </p>
          </div>
          <InfoSahamBRI />
        </div>
      </section>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-heading mb-4">
          Welcome to Bank BRI Redesign
        </h1>
        <p className="font-body">
          Backend Status: {pong === null ? "Loading..." : pong}
        </p>
      </div>

      {/* Footer */}
      <FooterBRI />
    </div>
  );
}
