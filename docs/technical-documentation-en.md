# Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Backend -- Spring Boot](#backend--spring-boot)
   - [REST API Endpoints](#rest-api-endpoints)
   - [Data Models](#data-models)
   - [WebSocket](#websocket)
   - [Services and Business Logic](#services-and-business-logic)
5. [Frontend -- Nuxt 4](#frontend--nuxt-4)
   - [Pages](#pages)
   - [Components](#components)
   - [Composables](#composables)
   - [Pinia Stores](#pinia-stores)
6. [Configuration and Deployment](#configuration-and-deployment)
7. [WebSocket Protocol](#websocket-protocol)

---

## Architecture Overview

The system is a full-stack client-server application for real-time food delivery management. The architecture follows the MVC pattern:

- The **frontend** (Nuxt 4) handles the user interface, interactive map, and real-time communication
- The **backend** (Spring Boot) exposes REST APIs and manages WebSocket connections for GPS position streaming
- **Redis** serves as the single data store, holding orders, courier locations, and the pending order queue

```
┌──────────────┐        HTTP/WebSocket        ┌──────────────────┐
│   Frontend   │ ──────────────────────────►  │     Backend      │
│   (Nuxt 4)   │                              │  (Spring Boot)   │
│              │                              │                  │
│  - MapLibre  │                              │  - REST API      │
│  - WebSocket │ ◄──────────────────────────  │  - WebSocket     │
│  - i18n      │        HTTP/WebSocket        │  - Redis Client  │
└──────────────┘                              └────────┬─────────┘
                                                       │
                                              ┌───────┴───────┐
                                              │     Redis     │
                                              │   (Data Store)│
                                              └───────────────┘
```

---

## Technologies Used

### Frontend

| Technology | Version | Purpose |
|------------|----------|---------|
| Nuxt | 4.1.3 | Full-stack Vue.js framework |
| Vue | 3.5.32 | UI framework |
| Tailwind CSS | 4.2.3 | Utility-first CSS framework |
| MapLibre GL (vue-maplibre-gl) | 8.4.2 | Interactive map rendering |
| nuxt-maplibre | 1.2.2 | Nuxt module for MapLibre |
| Pinia (@pinia/nuxt) | 0.11.3 | State management |
| @nuxtjs/i18n | 10.2.4 | Internationalization |
| @vueuse/nuxt | 14.2.1 | Utility composables |
| @turf/turf | 7.3.5 | Spatial geocalculation |
| ESLint (@nuxt/eslint) | 10.2.1 | Code linting |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.2.1 | Java framework |
| spring-boot-starter-web | 3.2.1 | REST API |
| spring-boot-starter-websocket | 3.2.1 | WebSocket support |
| spring-boot-starter-data-redis | 3.2.1 | Redis client |
| Lombok | Compile-time | Boilerplate reduction |
| Jackson JSR310 | Compile-time | Java 8+ date support |
| Maven | -- | Build tool |

### External Services

| Service | Usage |
|---------|-------|
| Redis | Primary data store (orders, locations, queue) |
| OpenStreetMap / Nominatim | Map tiles and geocoding |
| OSRM (router.project-osrm.org) | Road route calculation |
| Google Fonts | Barlow Condensed, Orbitron, Modak fonts |

---

## Project Structure

```
.
├── app/                              # Nuxt 4 frontend
│   ├── app.vue                       # Entry point
│   ├── pages/                        # Route pages
│   │   ├── index.vue                 # Homepage
│   │   ├── UserPage.vue              # Customer interface
│   │   ├── RiderPage.vue             # Courier interface
│   │   ├── TrackPage.vue             # Tracking dashboard
│   │   ├── TestPage.vue              # Geolocation test
│   │   └── License.vue               # License page
│   ├── layouts/
│   │   └── homeLayout.vue            # Layout with NavBar + Footer
│   ├── components/app/               # Vue components
│   │   ├── HomePageComponent.vue
│   │   ├── NavBarComponent.vue
│   │   ├── FooterComponent.vue
│   │   ├── SidebarComponent.vue
│   │   ├── MapComponent.vue
│   │   ├── SearchComponent.vue
│   │   ├── FoodCardComponent.vue
│   │   ├── OrderComponent.vue
│   │   ├── CoordinatesComponent.vue
│   │   ├── StatusModalComponent.vue
│   │   ├── RoutingCardComponent.vue
│   │   ├── RoutingEngineComponent.vue
│   │   └── LoadingComponent.vue
│   ├── composables/                  # API wrappers
│   │   ├── useLocationApi.js
│   │   ├── useLocationWebSocket.js
│   │   ├── useOrdersApi.js
│   │   ├── useOrderDataApi.js
│   │   ├── useRoutingEngineApi.js
│   │   └── singleWebSocket.js
│   ├── stores/                       # Pinia stores
│   │   ├── courierTrackingStore.ts
│   │   ├── orderStore.ts
│   │   └── routingStore.ts
│   ├── plugins/                      # Nuxt plugins
│   │   ├── debug-flag.client.ts
│   │   ├── language-selector.client.ts
│   │   └── store-injector.client.ts
│   ├── middleware/
│   │   └── middleware.global.ts      # Redirect + query param auto-fill
│   └── assets/css/
│       └── main.css                  # Tailwind theme + custom styles
├── deps/backend/                     # Spring Boot backend (git submodule)
│   ├── src/main/java/com/untitleddelivery/
│   │   ├── DeliveryTrackingApplication.java
│   │   ├── controller/
│   │   │   ├── OrderController.java
│   │   │   └── LocationController.java
│   │   ├── service/
│   │   │   ├── LocationService.java
│   │   │   └── OrderQueueService.java
│   │   ├── model/
│   │   │   ├── Order.java
│   │   │   ├── OrderItem.java
│   │   │   ├── Location.java
│   │   │   └── CourierLocation.java
│   │   ├── config/
│   │   │   ├── WebSocketConfig.java
│   │   │   └── LocationWebSocketHandler.java
│   │   └── util/
│   │       └── DistanceCalculator.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── application-dev.yml
│   │   └── application-prod.yml
│   └── pom.xml
├── i18n/locales/                     # Translation files
│   ├── en.json
│   ├── it.json
│   └── es.json
├── nuxt.config.ts                    # Nuxt configuration
├── Caddyfile.template                # Caddy reverse-proxy config
├── package.json
└── eslint.config.ts
```

---

## Backend -- Spring Boot

The backend is a Spring Boot 3.2.1 application that exposes REST APIs and manages WebSocket connections. It does not use a relational database; Redis is the sole data store.

### REST API Endpoints

#### `/api/orders`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/orders` | Creates a new order and attempts automatic courier assignment |
| GET | `/api/orders/{orderId}` | Gets order details by ID |
| PUT | `/api/orders/{orderId}/assign?courierId=xxx` | Manually assigns a courier to an order |
| PUT | `/api/orders/{orderId}/complete?courierId=xxx` | Completes an order |
| GET | `/api/orders/courier/{courierId}/active` | Gets the active order for a courier |
| GET | `/api/orders/queue/status` | Gets queue status (size and order IDs) |
| PUT | `/api/orders/{orderId}/delivering` | Transitions order to DELIVERING status |
| POST | `/api/orders/queue/process` | Manual trigger of queue processing |

#### `/api/locations`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/locations/courier/{courierId}` | Gets the last known location of a courier |

All endpoints have `@CrossOrigin(origins = "*")` enabled.

### Data Models

#### Order

Stored in Redis with key `order:{orderId}` and a TTL of 60 minutes.

| Field | Type | Description |
|-------|------|-------------|
| `orderId` | String | Unique identifier (timestamp-based) |
| `restaurant` | Location | Restaurant (pickup) coordinates |
| `destination` | Location | Delivery coordinates |
| `associatedCourierId` | String | Assigned courier ID |
| `createdAt` | Instant | Creation timestamp |
| `status` | String | `QUEUED` -> `FETCHING` -> `DELIVERING` -> `COMPLETED` |
| `items` | List\<OrderItem\> | Ordered items list |
| `totalPrice` | double | Total price |

#### OrderItem

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Item name |
| `quantity` | int | Quantity |
| `price` | double | Unit price |

#### Location

| Field | Type | Description |
|-------|------|-------------|
| `latitude` | double | Latitude |
| `longitude` | double | Longitude |

#### CourierLocation

Stored in Redis with key `courier:location:{courierId}` and a TTL of 5 minutes.

| Field | Type | Description |
|-------|------|-------------|
| `courierId` | String | Courier identifier |
| `location` | Location | Current GPS coordinates |
| `heading` | double | Compass heading |
| `timestamp` | Instant | Update timestamp |
| `status` | String | `ONLINE` or `IDLE` |
| `associatedOrderId` | String \| null | Associated order ID |

### WebSocket

**Endpoint:** `ws://localhost:8080/ws/locations`

#### Subscription model

The system maintains a bidirectional mapping:
- `SessionID` -> `{courierIDs}` (which couriers a session follows)
- `courierID` -> `{sessionIDs}` (which sessions follow a courier)

When a courier sends an update, it is broadcast only to subscribed sessions (targeted broadcast, not global).

#### Messages

**Sent from client:**

| Type | Fields | Description |
|------|--------|-------------|
| `subscribe` | `courierId` | Subscribe to courier updates |
| `unsubscribe` | `courierId` | Unsubscribe |
| `location_update` | `courierId`, `latitude`, `longitude`, `heading`, `timestamp`, `status` | Send courier GPS position |

#### Connection handling

- `LocationWebSocketHandler` registers and manages WebSocket sessions
- Unauthorized connections (`courier0000`) are blocked
- `location_update` messages are persisted in Redis and broadcast to subscribers

### Services and Business Logic

#### LocationService

Handles all Redis operations for orders and couriers:
- Order and courier CRUD
- Order state transitions (state machine)
- Direct Redis operations (no JPA repository layer)
- Distributed locking via `SETNX` for courier-order assignment

#### OrderQueueService

Manages the FIFO queue of pending orders:
- Runs every 5 seconds (`@Scheduled(fixedRate = 5000)`)
- Calculates Haversine distance between order and available couriers
- Assigns order to the nearest courier
- Maximum queue limit: 1000 pending orders
- Automatic cleanup of stale courier-order associations on startup and during processing

#### DistanceCalculator

Uses the Haversine formula to calculate the distance in kilometers between two GPS coordinates.

---

## Frontend -- Nuxt 4

### Pages

| Page | Route | Description |
|------|-------|-------------|
| `index.vue` | `/` | Homepage with hero, informational sections, and navigation |
| `UserPage.vue` | `/UserPage?orderId=0000` | Customer interface: restaurant search, cart, order placement, tracking |
| `RiderPage.vue` | `/RiderPage?courierId=0000` | Courier interface: order receipt, GPS, navigation |
| `TrackPage.vue` | `/TrackPage` | Tracking dashboard with manual WebSocket controls |
| `TestPage.vue` | `/TestPage` | Geolocation API test (raw coordinates) |
| `License.vue` | `/License` | Full AGPL-3.0 license text |

### Components

| Component | File | Purpose |
|-----------|------|---------|
| `HomePageComponent` | `HomePageComponent.vue` | Hero + 5 informational sections |
| `NavBarComponent` | `NavBarComponent.vue` | Fixed navigation bar with language switcher |
| `FooterComponent` | `FooterComponent.vue` | Footer with copyright and links |
| `SidebarComponent` | `SidebarComponent.vue` | Collapsible side panel |
| `MapComponent` | `MapComponent.vue` | MapLibre GL wrapper with custom markers |
| `SearchComponent` | `SearchComponent.vue` | Nominatim search bar with autocomplete |
| `FoodCardComponent` | `FoodCardComponent.vue` | Food item card |
| `OrderComponent` | `OrderComponent.vue` | Cart line item |
| `CoordinatesComponent` | `CoordinatesComponent.vue` | Mouse coordinate tooltip |
| `StatusModalComponent` | `StatusModalComponent.vue` | Order status modal |
| `RoutingCardComponent` | `RoutingCardComponent.vue` | Turn-by-turn navigation instructions |
| `RoutingEngineComponent` | `RoutingEngineComponent.vue` | Routing engine: OSRM polyline, Turf.js |
| `LoadingComponent` | `LoadingComponent.vue` | Loading video overlay |

### Composables

| Composable | Key Functions | APIs Called |
|------------|---------------|-------------|
| `useLocationApi` | `getLocation(courierId)` | `GET /api/locations/courier/{id}` |
| `useLocationWebSocket` | `connect()`, `disconnect()`, `subscribeToCourier()`, `unsubscribeFromCourier()`, `sendLocationUpdate()` | WebSocket `ws://{api}/ws/locations` |
| `useOrdersApi` | `createOrder()`, `getOrder()`, `fetchActiveOrder()`, `updateOrderToDelivering()`, `completeOrder()` | `/api/orders/*` |
| `useOrderDataApi` | Full CRUD order wrapper + locations | Same as above |
| `useRoutingEngineApi` | `getRoutingData(courierId, restaurant, destination)` | `https://router.project-osrm.org/route/v1/driving/{coords}` |
| `singleWebSocket` | `getLocationWebSocket()` | Singleton WebSocket wrapper |

### Pinia Stores

#### orderStore

**State:** `orderId`, `associatedCourierId`, `restaurant`, `destination`, `items[]`, `totalPrice`, `status`

**Actions:**
- `submitOrder()` -- creates order and starts polling
- `fetchOrder(id)` -- retrieves order
- `fetchAndSetActiveOrder(courierId)` -- retrieves active order
- `changeOrderStatus()` -- transition FETCHING->DELIVERING or DELIVERING->COMPLETED

#### routingStore

**State:** `code`, `routes[]`, `waypoints[]`, `currentGPS[]`, `currentHeading`, `courierId`, `activeOrderId`, `passedPolyline[]`, `orderPollingInterval`, `isStopped`, `currentLegIndex`, `currentStepIndex`

**Getters:** `currentStep`, `allSteps`, `totalStepsCount`

**Actions:**
- `syncRoutingData()` -- calls OSRM, sets route
- `syncGeolocation(coords, heading)` -- sends GPS via WebSocket
- `startOrderPolling()` -- active order polling every 3s
- `stopOrderPolling()` -- stops polling
- `advanceStep()` / `resetStepTracking()` -- step navigation

#### courierTrackingStore

**State:** `associatedCourierId`, `courierLocation`, `isTracking`, `isSubscribed`, `stopLocationWatch`

**Actions:**
- `startTracking(courierId)` -- connects WebSocket, subscribes, watches position
- `stopTracking()` -- unsubscribes, resets

---

## Configuration and Deployment

### Frontend Configuration (nuxt.config.ts)

```typescript
runtimeConfig: {
    public: {
        apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8080/api",
        wsUrl: process.env.NUXT_PUBLIC_WS_URL || "ws://localhost:8080/ws/locations",
    },
};
```

Required environment variables:
- `NUXT_PUBLIC_API_BASE` -- REST API base URL
- `NUXT_PUBLIC_WS_URL` -- WebSocket URL

Development proxy (Nitro):
```typescript
nitro: {
    devProxy: {
        "/api": {
            target: "http://localhost:8080",
            changeOrigin: true,
        },
    },
},
```

### Backend Configuration (application.yml)

```yaml
server:
  port: 8080

spring:
  data:
    redis:
      host: localhost
      port: 6379
```

Available profiles:
- `dev` -- development configuration (DEBUG logging)
- `prod` -- Redis password from environment variable, SSL enabled, INFO logging

Redis environment variables:
- `REDIS_HOST` -- host override
- `REDIS_PORT` -- port override
- `REDIS_PASSWORD` -- Redis password (prod only)

### Deployment with Caddy

The `Caddyfile.template` defines a Caddy reverse-proxy that routes:

| Pattern | Target | Description |
|---------|--------|-------------|
| `/api/*` | `localhost:8080` | REST API |
| `/ws/*` | `localhost:8080` | WebSocket |
| `{catch-all}` | `localhost:3000` | Nuxt frontend |

For deployment:
1. Replace `HOSTNAME` with the actual domain
2. Configure TLS (the template uses `tls internal`)
3. Start frontend on port 3000 and backend on port 8080
4. Start Caddy with the configuration file

---

## WebSocket Protocol

### Connection flow

1. Client establishes a WebSocket connection to `ws://{host}:8080/ws/locations`
2. Client sends a `subscribe` message with `courierId`
3. Server registers the session in the bidirectional mapping
4. Client periodically sends `location_update` with GPS coordinates
5. Server persists the location to Redis and broadcasts to subscribers
6. When done, client sends `unsubscribe` and closes the connection

### Message formats

**Subscribe:**
```json
{ "type": "subscribe", "courierId": "0001" }
```

**Unsubscribe:**
```json
{ "type": "unsubscribe", "courierId": "0001" }
```

**location_update (sent from client):**
```json
{
  "type": "location_update",
  "courierId": "0001",
  "latitude": 41.90278,
  "longitude": 12.49636,
  "heading": 180.5,
  "timestamp": "2026-04-21T10:30:00Z",
  "status": "ONLINE"
}
```

**location_update (received by client -- broadcast):**
Same format, received by subscribers of the `courierId`.

### Auto-reconnection

The `useLocationWebSocket` composable implements automatic reconnection after 3 seconds on disconnection.
