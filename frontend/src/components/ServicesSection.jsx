import React from "react";
import { useTranslation } from "react-i18next";
import {
  Wallet,
  CreditCard,
  Smartphone,
  TrendingUp,
  Building2,
  Users,
} from "lucide-react";

export default function ServicesSection() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Wallet,
      title: t("services.savings.title"),
      description: t("services.savings.description"),
    },
    {
      icon: CreditCard,
      title: t("services.credit.title"),
      description: t("services.credit.description"),
    },
    {
      icon: Smartphone,
      title: t("services.digital.title"),
      description: t("services.digital.description"),
    },
    {
      icon: TrendingUp,
      title: t("services.investment.title"),
      description: t("services.investment.description"),
    },
    {
      icon: Building2,
      title: t("services.corporate.title"),
      description: t("services.corporate.description"),
    },
    {
      icon: Users,
      title: t("services.brilink.title"),
      description: t("services.brilink.description"),
    },
  ];

  return (
    <section
      id="services"
      className="relative py-16 md:py-24 bg-white overflow-hidden"
      aria-label="Produk dan Layanan BRI"
    >
      {/* subtle background decoration */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #00529C 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bri-primary mb-4">
            {t("services.title")}
          </h2>
          <p className="font-body text-lg md:text-xl text-bri-charcoal max-w-3xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="group bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                {/* Icon */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-bri-primary to-bri-deep flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon
                    className="w-7 h-7 md:w-8 md:h-8 text-white"
                    strokeWidth={2}
                  />
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl md:text-2xl font-semibold text-bri-primary mb-3 group-hover:text-bri-deep transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="font-body text-base text-bri-charcoal/80 leading-relaxed">
                  {service.description}
                </p>

                {/* subtle hover accent */}
                <div className="w-0 h-1 bg-bri-orange rounded-full group-hover:w-16 transition-all duration-500 mt-4" />
              </div>
            );
          })}
        </div>
      </div>

      {/* bottom decoration */}
      <div
        className="absolute -bottom-12 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #F58220 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
