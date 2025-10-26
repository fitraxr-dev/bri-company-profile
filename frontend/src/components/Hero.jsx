import React from "react";
import { useTranslation, Trans } from "react-i18next";
import kartuBrimo from "../assets/kartu-removebg-preview.png";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      aria-label="Hero section - Bank BRI"
      style={{
        background: "linear-gradient(135deg, #00529C 0%, #003B73 70%)",
      }}
    >
      {/* soft glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-16 w-80 h-80 rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, #F58220 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8">
          {/* Left: text */}
          <div className="w-full md:w-1/2 text-white">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <Trans i18nKey="hero.title">
                Bersama BRI
                <span className="font-bold text-bri-orange">mo</span>, Wujudkan
                Masa Depan Finansial Anda.
              </Trans>
            </h1>
            <p className="mt-6 font-body text-lg sm:text-xl text-white/90 max-w-xl">
              {t("hero.description")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#services"
                className="btn btn-lg px-6 py-3 bg-bri-orange text-white font-semibold shadow-md hover:brightness-95"
                aria-label={t("hero.learnServices")}
              >
                {t("hero.joinBrimo")}
              </a>
            </div>
          </div>

          {/* Right: illustration */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="w-full max-w-md lg:max-w-lg relative">
              {/* Background decoration circles */}
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-20"
                style={{ background: "#F58220" }}
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-2xl opacity-15"
                style={{ background: "#00529C" }}
                aria-hidden="true"
              />
              
              {/* BRImo Card Image */}
              <div className="relative z-10 animate-float">
                <img
                  src={kartuBrimo}
                  alt="Kartu BRImo - Digital Banking BRI"
                  className="w-full h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
