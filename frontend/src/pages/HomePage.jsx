import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import KPRSimulator from "../components/KPRSimulator";
import InfoSahamBRI from "../components/InfoSahamBRI";
import ArticlesSection from "../components/ArticlesSection";
import FooterBRI from "../components/FooterBRI";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Hero />
      <AboutSection />
      <ServicesSection />
      <KPRSimulator />

      {/* Section Info Saham BRI */}
      <section
        id="saham"
        className="relative py-16 md:py-24 bg-white overflow-hidden"
        aria-label="Informasi Saham BRI"
      >
        {/* Subtle background decoration */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #00529C 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bri-primary mb-4">
              Informasi Saham BRI
            </h2>
            <p className="font-body text-lg md:text-xl text-bri-charcoal max-w-3xl mx-auto">
              Data real-time dari bursa efek
            </p>
          </div>
          <InfoSahamBRI />
        </div>
      </section>

      {/* Articles Section */}
      <ArticlesSection />

      {/* Footer */}
      <FooterBRI />
    </div>
  );
}
