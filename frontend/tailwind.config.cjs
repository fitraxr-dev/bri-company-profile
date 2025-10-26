module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Poppins", '"Helvetica Neue"', "Arial", "sans-serif"],
        body: ["Lato", "Open Sans", "Arial", "sans-serif"],
      },
      colors: {
        bri: {
          primary: "#00529B", // BRI Blue (primary)
          deep: "#003B73", // Deep Blue (dark variant)
          orange: "#F58220", // Orange accent
          bg: "#F4F6F8", // Light gray / background
          sky: "#E6F0FA", // Sky blue (soft)
          charcoal: "#1F203B", // Charcoal (text dark)
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    // add a custom daisyUI theme that maps to the BRI palette
    themes: [
      {
        bri: {
          primary: "#00529B",
          "primary-content": "#ffffff",
          secondary: "#003B73",
          accent: "#F58220",
          neutral: "#1F203B",
          "base-100": "#F4F6F8",
          // keep daisyUI vars for subtle radius/spacing if desired
        },
      },
      "light",
      "dark",
    ],
  },
};
