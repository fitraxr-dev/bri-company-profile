import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/bri-logo-white.png";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Close mobile menu when resizing to md and up
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { href: "#about", label: t("navbar.about") },
    { href: "#services", label: t("navbar.services") },
    { href: "#saham", label: t("navbar.stock") },
  ];

  return (
    <header className="relative bg-bri-primary text-white shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Left: logo */}
          <div className="flex items-center flex-1 gap-2">
            <a
              href="#hero"
              aria-label="Bank BRI Home"
              className="flex items-center"
            >
              <img
                src={logo}
                alt="BRI logo"
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain transition-transform duration-150 hover:scale-105"
              />
            </a>
            <span className="text-4xl font-bold text-bri-orange">mo</span>
          </div>

          {/* Center / Desktop menu */}
          <div className="hidden md:flex md:items-center md:justify-center flex-1">
            <ul className="menu menu-horizontal gap-2 p-0">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="font-heading text-white px-3 py-2 rounded-md hover:bg-bri-sky hover:text-bri-charcoal transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: mobile toggle & optional actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher - Desktop */}
            <div className="hidden md:flex">
              <LanguageSwitcher />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle navigation menu"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden ${open ? "block" : "hidden"} bg-bri-primary/95`}
        role="menu"
        aria-label="Mobile navigation"
      >
        <div className="px-4 pb-4">
          <ul className="flex flex-col gap-1 py-2">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="block px-3 py-2 rounded-md text-white font-heading hover:bg-bri-sky hover:text-bri-charcoal"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Language Switcher - Mobile */}
          <div className="mt-4 px-3 flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
