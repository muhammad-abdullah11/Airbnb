# Airbnb

Simple Airbnb-like demo project (client + server).

Overview
- Client: React + Vite (located in `client/`).
- Server: Node/Express (located in `server/`).

Development
1. Install dependencies for both projects:
	- `cd client && npm install`
	- `cd server && npm install`
2. Run client and server in development (separate terminals):
	- `cd client && npm run dev`
	- `cd server && npm run dev` (or `node server.js`)

Production build & run
1. Build the client for production:
	- `cd client && npm run build`
	This outputs a production bundle in `client/dist`.
2. Serve client build from the server:
	- Option A (recommended for this repo): copy or move `client/dist` into `server/public` (or configure server to serve `client/dist`), then start the server:
	  - `cd server && npm install && NODE_ENV=production node server.js`
	- Option B: Deploy the `client/dist` to a static-hosting service (Netlify, Vercel, S3) and run the server separately for API endpoints.

Environment variables
- The server may require environment variables (JWT secrets, database URL, SMTP credentials). Provide them via a `.env` file or your hosting provider's configuration.

Deploy tips
- Ensure the server serves the client static files in production (express.static or similar).
- Use a process manager like `pm2` or containerization (Docker) for production stability.

License & contact
- This is a demo repository. Update this README with project-specific license and contact information as needed.

