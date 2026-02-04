# Airbnb — Production README

This repository is a demo Airbnb-like application containing a Vite/React client and an Express API server. This README focuses on production readiness: build, configuration, Docker, deployment recommendations, and operational concerns.

**Architecture**
- **Client:** React + Vite — source in [client](client)
- **Server:** Node.js + Express — source in [server](server)
- **Data:** MongoDB (or other DB configured via environment)

**Prerequisites**
- Node.js >= 16, npm or yarn
- Production database (MongoDB URI) and secret stores
- Optional: Docker & Docker Compose for containerized deployments

**Environment (example)**
Create a `.env` (never commit secrets).

```
PORT=4000
NODE_ENV=production
MONGO_URI=mongodb://user:pass@host:27017/dbname
JWT_SECRET=your_jwt_secret_here
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=strongpassword
CLIENT_URL=https://your-frontend.example.com
```

**Build & Serve (recommended minimal flow)**
1. Build client bundle:
<!-- PROJECT-SPECIFIC README -->
# Airbnb — Project README (Production-grade, project-specific)

This README describes this repository’s structure, purpose, how to run locally, produce production builds, environment configuration, and recommended deployment options for this specific Airbnb-like project.

## Project at a glance
- **Client:** React + Vite application in [client](client).
- **Server:** Node.js + Express API in [server](server).
- **Main features:** User authentication (OTP), host listing creation/editing, listing discovery, booking flow, reviews, and basic payments/test flow.

## Repository structure (key files)
- `client/` — React frontend
	- `src/Components/Pages/` — UI pages (Auth, HomePage, Listing, Host flows)
	- `index.html`, `vite.config.js` — Vite config and entry
- `server/` — Express backend
	- `server.js` / `src/app.js` — server entry
	- `src/Controllers/` — business logic for bookings, listings, reviews, users
	- `src/Routes/` — route definitions (booking.routes.js, listing.routes.js, review.routes.js, user.routes.js)
	- `src/Models/` — Mongoose models (booking.model.js, listing.model.js, review.model.js, user.model.js)
	- `src/Middlewares/` — `auth.middlewares.js`, `upload.js` and others
	- `src/db/db.js` — DB connection
	- `src/Utils/` — `jwtToken.js`, `nodemailer.js`



Client runs on Vite's dev server, server exposes API endpoints under `/api` (check route prefixes in `server/src/Routes`).

## Production build & serve (project-specific)
This project is intended to be deployed as a single app where the server serves the built client.

1. From repo root, build the client:

```bash
cd client
npm ci
npm run build
```

2. Copy build files into the server `public` directory (or configure server to serve `client/dist` directly):

```bash
cp -r client/dist server/public
cd server
npm ci --production
NODE_ENV=production PORT=4000 node server.js
```

## API surface (where to find endpoints)
Routes are defined under `server/src/Routes/`. The main route groups implemented in this project are:

- `user.routes.js` — registration, login, verify OTP, profile operations
- `listing.routes.js` — create, read, update, delete listings; host-specific endpoints
- `booking.routes.js` — create and manage bookings, booking confirmations
- `review.routes.js` — post and fetch reviews for listings

Open those files for exact paths and HTTP methods. The controllers in `server/src/Controllers/` contain the handling logic and interactions with `server/src/Models/`.

## Data models (high-level)
- `User` — authentication info, profile, host flag, payment/contact details
- `Listing` — title, description, location, price, host reference, images
- `Booking` — listing reference, user reference, dates, payment status
- `Review` — listing/user reference, rating, comment

See `server/src/Models/*.js` for schema details.

