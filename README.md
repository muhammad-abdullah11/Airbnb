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

```bash
cd client
npm ci
npm run build
```

2. Copy or serve the client build from the server (preferred: configure server to serve `client/dist`):

```bash
# from repo root
cp -r client/dist server/public
cd server
npm ci
NODE_ENV=production PORT=4000 node server.js
```

Ensure the server's Express app serves static files and falls back to index.html for SPA routing. Example Express snippet (server code):

```js
app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
```

**Docker (recommended for production deployments)**
- Example `Dockerfile` for the server (multi-stage building the client and serving statics):

```
# Stage 1: build client
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# Stage 2: build server image
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --production
COPY server/ .
# Copy client build into server public
COPY --from=client-builder /app/client/dist ./public
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "server.js"]
```

- A minimal `docker-compose.yml` (production) might include the server, a database and a reverse proxy (nginx):

```yaml
version: '3.8'
services:
	app:
		build: .
		ports:
			- '4000:4000'
		env_file: .env
		restart: unless-stopped
	mongo:
		image: mongo:6
		volumes:
			- mongo-data:/data/db
volumes:
	mongo-data:
```

**Reverse Proxy & TLS**
- Put Nginx, Traefik, or a managed load balancer in front of the app. Terminate TLS at the proxy and forward traffic to the Node server on an internal port.

**Process Management**
- Prefer container orchestration (Kubernetes, ECS) or use `pm2`/systemd if running on a VM.

**Logging & Monitoring**
- Centralize logs (e.g., Fluentd/ELK, Datadog). Send structured logs (JSON) from the server.
- Add basic application metrics (Prometheus) and error tracking (Sentry).

**Database & Migrations**
- Use a managed DB for production. Ensure backups and point-in-time recovery are configured.
- If you use schema migrations, integrate a migration tool and run migrations at deploy time.

**CI/CD**
- Build and test the client and server in CI. Artifacts or Docker images should be published to a registry.
- Example pipeline steps:
	- Install dependencies & run tests
	- Build client (`npm run build`)
	- Build Docker image and push to registry
	- Deploy via your orchestrator or update service image

**Security & Best Practices**
- Keep secrets out of source control; use environment secrets or vaults.
- Run dependencies audit regularly (`npm audit`), and pin/build reproducible images.
- Set `NODE_ENV=production` and disable dev-only middleware.

**Troubleshooting**
- 502/504: Check reverse proxy and app health. Increase timeouts for long-running requests.
- 500 errors: Inspect server logs and error tracking. Ensure env vars are correct.

**Useful Commands**

```bash
# Local development (two terminals)
cd client && npm install && npm run dev
cd server && npm install && npm run dev

# Build and start production locally
cd client && npm ci && npm run build
cd server && npm ci && NODE_ENV=production node server.js

# Build Docker image
docker build -t yourorg/airbnb:latest .
```

**Where to look in this repo**
- **Server:** [server](server) — API, middlewares, models, routes
- **Client:** [client](client) — React app and Vite config

**Contact & License**
- This is a demo project. Add your license and maintainer contact information here.


