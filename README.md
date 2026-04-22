# Untitled Delivery Project

A real-time food delivery platform that connects customers with couriers through live GPS tracking, automatic order assignment, and turn-by-turn navigation. Built as a full-stack application with a Nuxt 4 frontend and a Spring Boot backend.

![Tech Stack](https://img.shields.io/badge/Nuxt-4-black?style=flat-square&logo=nuxt.js)
![Backend](https://img.shields.io/badge/Spring%20Boot-3.2-blue?style=flat-square&logo=spring-boot)
![License](https://img.shields.io/badge/License-AGPL--3.0-green?style=flat-square)

## What it does

When a customer places an order, the system automatically assigns it to the nearest available courier using Haversine distance calculation. The courier receives turn-by-turn navigation from the restaurant to the customer's location, while the customer tracks their courier's real-time position on an interactive map powered by MapLibre GL and OpenStreetMap. All location updates flow through WebSocket connections, with Redis serving as the real-time data layer.

## Features

- **Real-time courier tracking** -- GPS coordinates streamed via WebSocket and displayed on an interactive MapLibre GL map
- **Automatic order assignment** -- nearest available courier assigned using Haversine distance; FIFO queue for overflow
- **Turn-by-turn navigation** -- OSRM-based routing with Turf.js deviation detection and recalculation
- **Multi-language support** -- English, Italian, and Spanish with cookie-based locale persistence
- **Dual-role interface** -- separate views for customers (order & track) and couriers (receive & navigate)
- **Redis-powered state** -- all data persisted in Redis with TTL-based expiration and distributed locking

## Project structure

```
.
├── app/                    # Nuxt 4 frontend (Vue 3 + Pinia)
│   ├── pages/              # Route pages
│   ├── components/         # Vue components
│   ├── composables/        # API wrappers & composables
│   ├── stores/             # Pinia stores
│   └── plugins/            # Nuxt plugins
├── deps/backend/           # Spring Boot backend (submodule)
│   ├── src/                # Java source code
│   └── pom.xml             # Maven build config
├── i18n/                   # Internationalization (en, it, es)
├── public/                 # Static assets
├── nuxt.config.ts          # Nuxt configuration
└── Caddyfile.template      # Caddy reverse-proxy config
```

## Quick start

### Prerequisites

- **Node.js** 18+ (for the frontend)
- **Java** 17+ and **Maven** (for the backend)
- **Redis** running on `localhost:6379`

### Backend

```bash
cd deps/backend
mvn clean install
mvn spring-boot:run
```

The backend starts on port 8080 and connects to Redis at `localhost:6379` by default. See [docs/technical-documentation-en.md](./docs/technical-documentation-en.md) for deployment and configuration details.

### Frontend

```bash
npm install
npm run dev
```

The frontend starts on port 3000. In development, a Nitro proxy forwards API and WebSocket requests to the backend at `localhost:8080`.

## Documentation

| Document | Language | Description |
|----------|----------|-------------|
| [User Manual (EN)](docs/user-manual-en.md) | English | Guide for end users — how to place orders, track deliveries, and use the courier interface |
| [User Manual (IT)](docs/user-manual-it.md) | Italiano | Guida per gli utenti finali |
| [Technical Documentation (EN)](docs/technical-documentation-en.md) | English | Architecture, API reference, data models, WebSocket protocol, and deployment guide |
| [Technical Documentation (IT)](docs/technical-documentation-it.md) | Italiano | Documentazione tecnica — architettura, API, modello dati e distribuzione |

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file and the [License page](/License) in the application for full terms.
