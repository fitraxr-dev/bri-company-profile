import React from "react";
import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation();
  return (
    <section
      id="about"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ffffff 0%, #E6F0FA 50%, #F4F6F8 100%)",
      }}
      aria-label="Tentang BRI"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left: Text content */}
          <div className="w-full md:w-1/2 relative">
            {/* Orange accent line */}
            <div
              className="absolute -left-6 top-0 w-1 h-24 md:h-32 bg-bri-orange rounded-full opacity-80 animate-pulse"
              aria-hidden="true"
            />

            <div className="space-y-6 transition-all duration-500 ease-in-out transform hover:translate-x-1">
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bri-primary leading-tight">
                {t("about.title")}
              </h2>

              <p className="font-heading text-xl md:text-2xl text-bri-deep font-semibold">
                {t("about.subtitle")}
              </p>

              <p className="font-body text-base md:text-lg text-bri-charcoal leading-relaxed max-w-xl text-balance">
                {t("about.description")}
              </p>
            </div>
          </div>

          {/* Right: Illustration / Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="w-full max-w-md lg:max-w-lg transition-all duration-500 ease-in-out transform hover:scale-105">
              {/* SVG illustration of a building/bank with subtle animations */}
              <svg
                viewBox="0 0 600 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-xl"
                aria-hidden="true"
              >
                {/* background subtle circles */}
                <circle
                  cx="480"
                  cy="100"
                  r="80"
                  fill="#00529C"
                  opacity="0.04"
                />
                <circle
                  cx="120"
                  cy="420"
                  r="60"
                  fill="#F58220"
                  opacity="0.06"
                />

                {/* main building structure */}
                <g className="animate-fade-in">
                  {/* base */}
                  <rect
                    x="120"
                    y="340"
                    width="360"
                    height="140"
                    rx="8"
                    fill="#00529C"
                    opacity="0.08"
                  />

                  {/* tower left */}
                  <rect
                    x="140"
                    y="140"
                    width="100"
                    height="200"
                    rx="6"
                    fill="#00529C"
                    opacity="0.12"
                  />

                  {/* tower center (taller) */}
                  <rect
                    x="260"
                    y="80"
                    width="120"
                    height="260"
                    rx="6"
                    fill="#00529C"
                    opacity="0.15"
                  />

                  {/* tower right */}
                  <rect
                    x="400"
                    y="160"
                    width="100"
                    height="180"
                    rx="6"
                    fill="#00529C"
                    opacity="0.12"
                  />

                  {/* windows */}
                  <g fill="#ffffff" opacity="0.25">
                    {/* left tower windows */}
                    <rect x="155" y="160" width="20" height="20" rx="2" />
                    <rect x="205" y="160" width="20" height="20" rx="2" />
                    <rect x="155" y="195" width="20" height="20" rx="2" />
                    <rect x="205" y="195" width="20" height="20" rx="2" />
                    <rect x="155" y="230" width="20" height="20" rx="2" />
                    <rect x="205" y="230" width="20" height="20" rx="2" />

                    {/* center tower windows */}
                    <rect x="280" y="100" width="24" height="24" rx="2" />
                    <rect x="320" y="100" width="24" height="24" rx="2" />
                    <rect x="280" y="140" width="24" height="24" rx="2" />
                    <rect x="320" y="140" width="24" height="24" rx="2" />
                    <rect x="280" y="180" width="24" height="24" rx="2" />
                    <rect x="320" y="180" width="24" height="24" rx="2" />
                    <rect x="280" y="220" width="24" height="24" rx="2" />
                    <rect x="320" y="220" width="24" height="24" rx="2" />

                    {/* right tower windows */}
                    <rect x="415" y="180" width="20" height="20" rx="2" />
                    <rect x="465" y="180" width="20" height="20" rx="2" />
                    <rect x="415" y="215" width="20" height="20" rx="2" />
                    <rect x="465" y="215" width="20" height="20" rx="2" />
                  </g>

                  {/* orange accent on top */}
                  <rect
                    x="280"
                    y="68"
                    width="80"
                    height="8"
                    rx="4"
                    fill="#F58220"
                    opacity="0.6"
                  />
                </g>

                {/* foreground subtle card/badge */}
                <g transform="translate(40, 80)">
                  <rect
                    width="140"
                    height="100"
                    rx="12"
                    fill="#ffffff"
                    opacity="0.08"
                  />
                  <text
                    x="70"
                    y="50"
                    textAnchor="middle"
                    fill="#00529C"
                    fontSize="28"
                    fontWeight="700"
                    opacity="0.2"
                  >
                    125+
                  </text>
                  <text
                    x="70"
                    y="72"
                    textAnchor="middle"
                    fill="#00529C"
                    fontSize="12"
                    opacity="0.15"
                  >
                    Tahun
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* subtle bottom glow */}
      <div
        className="absolute -bottom-16 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #F58220 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
