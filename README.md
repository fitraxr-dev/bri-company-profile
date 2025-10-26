# GoTo Redesign (MERN-ish) — Starter

This workspace contains two folders:

- `backend/` — Express + Mongoose API scaffold
- `frontend/` — Vite + React app with TailwindCSS + daisyUI

Quick start (Windows PowerShell)

1. Backend

   cd "./backend"
   npm install
   copy .env.example .env # or `cp .env.example .env` on other shells
   npm run dev

2. Frontend

   cd "./frontend"
   npm install
   npm run dev

Notes

- The frontend dev server is configured on port 3000. Backend default is 5000.
- For local development you can set `MONGODB_URI` in `backend/.env`.
- To enable a proxy so the frontend can call `/api/*` without CORS, add a proxy in `vite.config.js` or call the full backend URL.
