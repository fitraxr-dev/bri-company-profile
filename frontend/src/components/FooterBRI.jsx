import React from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWallet,
  FaCreditCard,
  FaMobileAlt,
  FaChevronRight,
} from "react-icons/fa";

/**
 * FooterBRI Component
 * Footer profesional untuk website company profile Bank BRI
 * dengan layout responsif dan desain modern
 */
const FooterBRI = () => {
  const { t } = useTranslation();

  // Data untuk navigasi
  const aboutLinks = [
    { name: t("footer.company.about"), href: "/tentang" },
    { name: t("footer.company.management"), href: "/manajemen" },
    { name: t("footer.company.career"), href: "/karir" },
    { name: t("footer.company.news"), href: "/berita" },
  ];

  const productLinks = [
    {
      name: t("footer.products.savings"),
      href: "/produk/tabungan",
      icon: FaWallet,
    },
    {
      name: t("footer.products.loans"),
      href: "/produk/pinjaman",
      icon: FaCreditCard,
    },
    {
      name: t("footer.products.creditCard"),
      href: "/produk/kartu",
      icon: FaCreditCard,
    },
    { name: t("footer.products.brimo"), href: "/brimo", icon: FaMobileAlt },
  ];

  const socialMedia = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      href: "https://www.facebook.com/BRIofficialpage",
      color: "hover:bg-blue-600",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://www.instagram.com/bankbri_id",
      color: "hover:bg-pink-600",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      href: "https://www.linkedin.com/company/pt--bank-rakyat-indonesia--persero--tbk-",
      color: "hover:bg-blue-700",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      href: "https://www.youtube.com/user/BANKBRI",
      color: "hover:bg-red-600",
    },
  ];

  return (
    <footer className="bg-[#002B7F] text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolom 1 - Brand & Deskripsi */}
          <div className="space-y-4">
            {/* Logo BRI */}
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-white">
                Bank <span className="text-blue-400">BRI</span>
              </h2>
              <div className="w-16 h-1 bg-blue-400 mt-2 rounded"></div>
            </div>

            {/* Deskripsi */}
            <p className="text-sm leading-relaxed">
              <Trans i18nKey="footer.brand.description">
                Memberikan layanan perbankan terbaik untuk seluruh lapisan
                masyarakat Indonesia dengan semangat{" "}
                <span className="text-white font-semibold">
                  Melayani Dengan Setulus Hati
                </span>
                .
              </Trans>
            </p>

            {/* Tagline */}
            <div className="pt-2">
              <p className="text-xs text-blue-300 italic">
                {t("footer.brand.tagline")}
              </p>
            </div>
          </div>

          {/* Kolom 2 - Tentang Perusahaan */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center">
              {t("footer.company.title")}
            </h3>
            <ul className="space-y-3">
              {aboutLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm flex items-center gap-2 text-white hover:translate-x-1 transition-all duration-200 group"
                  >
                    <FaChevronRight className="w-3 h-3 text-blue-400 group-hover:text-white" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3 - Produk & Layanan */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center">
              {t("footer.products.title")}
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm flex items-center gap-2  text-white hover:translate-x-1 transition-all duration-200 group"
                    >
                      <Icon className="w-4 h-4 text-blue-400 group-hover:text-white" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Quick Access Button */}
            <div className="mt-6">
              <a
                href="/produk"
                className="inline-block text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {t("services.viewAll")} →
              </a>
            </div>
          </div>

          {/* Kolom 4 - Hubungi Kami */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              {t("footer.contact.title")}
            </h3>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              {/* Alamat */}
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm  text-white leading-relaxed">
                    Gedung BRI I, Jl. Jend. Sudirman Kav. 44-46, Jakarta Pusat
                    10210
                  </p>
                </div>
              </div>

              {/* Call Center */}
              <div className="flex items-center gap-3">
                <FaPhone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <a
                    href="tel:14017"
                    className="text-sm text-white"
                  >
                    14017 / 1500017
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <FaEnvelope className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <a
                    href="mailto:callbri@bri.co.id"
                    className="text-sm text-white"
                  >
                    callbri@bri.co.id
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-sm text-white font-semibold mb-3">
                {t("footer.social.title")}:
              </p>
              <div className="flex gap-3">
                {socialMedia.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className={`w-10 h-10 flex items-center justify-center bg-blue-800 rounded-lg ${social.color} transition-all duration-200 hover:scale-110`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-blue-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-center md:text-left">
              {t("footer.bottom.copyright")}
            </p>

            {/* Additional Links */}
            <div className="flex gap-6 text-sm">
              <a
                href="/privacy-policy"
                className="text-white"
              >
                {t("footer.legal.privacy")}
              </a>
              <a
                href="/terms"
                className="text-white"
              >
                {t("footer.legal.terms")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterBRI;
