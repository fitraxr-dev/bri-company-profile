# GoTo Redesign — Frontend

Vite + React + TailwindCSS + daisyUI starter.

How to run

1. Install dependencies:

   npm install

2. Run dev server:

   npm run dev

Notes

- Dev server runs on port 3000 by default (see `vite.config.js`).
- To communicate with the backend running on a different port (e.g. 5000), either run a proxy or call the full backend URL.

Color palette (BRI)

The project uses the BRI color palette exposed as Tailwind tokens and CSS variables.

- Tailwind tokens: use `bg-bri`, `bg-bri-deep`, `text-bri-charcoal`, `text-bri`, `bg-bri-bg`, etc.
- CSS variables (global): `--bri-blue`, `--bri-deep`, `--bri-orange`, `--bri-bg`, `--bri-sky`, `--bri-charcoal`.

Example:

- Button with primary background: `class="bg-bri text-white"`
- Use CSS var in custom CSS: `background: var(--bri-orange);`
