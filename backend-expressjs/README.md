# GoTo Redesign — Backend

This is a minimal Express + Mongoose backend scaffold.

How to run

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Install dependencies:

   npm install

3. Start dev server:

   npm run dev

API examples

- GET /api/ping → { message: 'pong' }
- GET /api/users → list users
- POST /api/users → create user (body: { name, email })
