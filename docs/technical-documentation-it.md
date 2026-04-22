# Documentazione Tecnica

## Indice

1. [Panoramica dell'architettura](#panoramica-dellarchitettura)
2. [Tecnologie utilizzate](#tecnologie-utilizzate)
3. [Struttura del progetto](#struttura-del-progetto)
4. [Backend -- Spring Boot](#backend--spring-boot)
   - [Endpoint REST API](#endpoint-rest-api)
   - [Modello dati](#modello-dati)
   - [WebSocket](#websocket)
   - [Servizi e logica di business](#servizi-e-logica-di-business)
5. [Frontend -- Nuxt 4](#frontend--nuxt-4)
   - [Pagine](#pagine)
   - [Componenti](#componenti)
   - [Composables](#composables)
   - [Pinia Stores](#pinia-stores)
6. [Configurazione e distribuzione](#configurazione-e-distribuzione)
7. [Protocollo WebSocket](#protocollo-websocket)

---

## Panoramica dell'architettura

Il sistema è un'applicazione full-stack client-server per la gestione di consegne a domicilio in tempo reale. L'architettura segue il pattern MVC:

- Il **frontend** (Nuxt 4) gestisce l'interfaccia utente, la mappa interattiva e la comunicazione in tempo reale
- Il **backend** (Spring Boot) espone API REST e gestisce la connessione WebSocket per lo streaming delle posizioni GPS
- **Redis** funge da unico datastore, Memorizzando ordini, posizioni dei corrieri e la coda degli ordini in attesa

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

## Tecnologie utilizzate

### Frontend

| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| Nuxt | 4.1.3 | Framework Vue.js full-stack |
| Vue | 3.5.32 | Framework UI |
| Tailwind CSS | 4.2.3 | Framework CSS utility-first |
| MapLibre GL (vue-maplibre-gl) | 8.4.2 | Rendering mappa interattiva |
| nuxt-maplibre | 1.2.2 | Modulo Nuxt per MapLibre |
| Pinia (@pinia/nuxt) | 0.11.3 | State management |
| @nuxtjs/i18n | 10.2.4 | Internazionalizzazione |
| @vueuse/nuxt | 14.2.1 | Composables utility |
| @turf/turf | 7.3.5 | Geocalcolo spaziale |
| ESLint (@nuxt/eslint) | 10.2.1 | Linting |

### Backend

| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| Spring Boot | 3.2.1 | Framework Java |
| spring-boot-starter-web | 3.2.1 | REST API |
| spring-boot-starter-websocket | 3.2.1 | WebSocket |
| spring-boot-starter-data-redis | 3.2.1 | Redis client |
| Lombok | Compilazione | Riduzione boilerplate |
| Jackson JSR310 | Compilazione | Supporto date Java 8+ |
| Maven | -- | Build tool |

### Servizi esterni

| Servizio | Utilizzo |
|----------|----------|
| Redis | Datastore principale (ordini, posizioni, coda) |
| OpenStreetMap / Nominatim | Tile della mappa e geocoding |
| OSRM (router.project-osrm.org) | Calcolo percorsi stradali |
| Google Fonts | Font Barlow Condensed, Orbitron, Modak |

---

## Struttura del progetto

```
.
├── app/                              # Frontend Nuxt 4
│   ├── app.vue                       # Entry point
│   ├── pages/                        # Route pages
│   │   ├── index.vue                 # Homepage
│   │   ├── UserPage.vue              # Interfaccia cliente
│   │   ├── RiderPage.vue             # Interfaccia corriere
│   │   ├── TrackPage.vue             # Dashboard tracciamento
│   │   ├── TestPage.vue              # Test geolocalizzazione
│   │   └── License.vue               # Pagina licenza
│   ├── layouts/
│   │   └── homeLayout.vue            # Layout con NavBar + Footer
│   ├── components/app/               # Componenti Vue
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
│   ├── composables/                  # Wrapper API
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
│   ├── plugins/                      # Plugin Nuxt
│   │   ├── debug-flag.client.ts
│   │   ├── language-selector.client.ts
│   │   └── store-injector.client.ts
│   ├── middleware/
│   │   └── middleware.global.ts      # Redirect + query param auto-fill
│   └── assets/css/
│       └── main.css                  # Theme Tailwind + custom styles
├── deps/backend/                     # Backend Spring Boot (submodule git)
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
├── i18n/locales/                     # File traduzione
│   ├── en.json
│   ├── it.json
│   └── es.json
├── nuxt.config.ts                    # Configurazione Nuxt
├── Caddyfile.template                # Config reverse-proxy Caddy
├── package.json
└── eslint.config.ts
```

---

## Backend -- Spring Boot

Il backend è un'applicazione Spring Boot 3.2.1 che espone API REST e gestisce connessioni WebSocket. Non utilizza un database relazionale: Redis è l'unico datastore.

### Endpoint REST API

#### `/api/orders`

| Metodo | Path | Descrizione |
|--------|------|-------------|
| POST | `/api/orders` | Crea un nuovo ordine e tenta l'assegnazione automatica |
| GET | `/api/orders/{orderId}` | Ottiene i dettagli di un ordine |
| PUT | `/api/orders/{orderId}/assign?courierId=xxx` | Assegna manualmente un corriere a un ordine |
| PUT | `/api/orders/{orderId}/complete?courierId=xxx` | Completa un ordine |
| GET | `/api/orders/courier/{courierId}/active` | Ottiene l'ordine attivo di un corriere |
| GET | `/api/orders/queue/status` | Ottiene lo stato della coda (dimensione e ID) |
| PUT | `/api/orders/{orderId}/delivering` | Transizione ordine a stato DELIVERING |
| POST | `/api/orders/queue/process` | Trigger manuale della coda |

#### `/api/locations`

| Metodo | Path | Descrizione |
|--------|------|-------------|
| GET | `/api/locations/courier/{courierId}` | Ottiene l'ultima posizione nota di un corriere |

Tutti gli endpoint hanno `@CrossOrigin(origins = "*")` abilitato.

### Modello dati

#### Order

Memorizzato in Redis con chiave `order:{orderId}` e TTL di 60 minuti.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `orderId` | String | Identificativo univoco (timestamp-based) |
| `restaurant` | Location | Coordinate del ristorante (pickup) |
| `destination` | Location | Coordinate di consegna |
| `associatedCourierId` | String | ID del corriere assegnato |
| `createdAt` | Instant | Timestamp di creazione |
| `status` | String | `QUEUED` → `FETCHING` → `DELIVERING` → `COMPLETED` |
| `items` | List\<OrderItem\> | Lista degli articoli ordinati |
| `totalPrice` | double | Prezzo totale |

#### OrderItem

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `name` | String | Nome dell'articolo |
| `quantity` | int | Quantità |
| `price` | double | Prezzo unitario |

#### Location

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `latitude` | double | Latitudine |
| `longitude` | double | Longitudine |

#### CourierLocation

Memorizzato in Redis con chiave `courier:location:{courierId}` e TTL di 5 minuti.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `courierId` | String | Identificativo del corriere |
| `location` | Location | Coordinate GPS correnti |
| `heading` | double | Direzione (bussola) |
| `timestamp` | Instant | Timestamp dell'aggiornamento |
| `status` | String | `ONLINE` o `IDLE` |
| `associatedOrderId` | String \| null | ID dell'ordine associato |

### WebSocket

**Endpoint:** `ws://localhost:8080/ws/locations`

#### Sottoscrizione

Il sistema mantiene un mapping bidirezionale:
- `SessionID` → `{courierIDs}` (quali corriere segue una sessione)
- `courierID` → `{sessionIDs}` (quali sessioni seguono un corriere)

Quando un corriere invia un aggiornamento, questo viene inviato solo alle sessioni sottoscritte (broadcast mirato, non globale).

#### Messaggi

**Inviati dal client:**

| Tipo | Campi | Descrizione |
|------|-------|-------------|
| `subscribe` | `courierId` | Sottoscrivi agli aggiornamenti di un corriere |
| `unsubscribe` | `courierId` | Annulla sottoscrizione |
| `location_update` | `courierId`, `latitude`, `longitude`, `heading`, `timestamp`, `status` | Invia posizione GPS del corriere |

#### Gestione connessioni

- `LocationWebSocketHandler` registra e gestisce le sessioni WebSocket
- Connessioni non autorizzate (`courier0000`) sono bloccate
- I messaggi `location_update` vengono persistiti in Redis e diffusi ai sottoscrittori

### Servizi e logica di business

#### LocationService

Gestisce tutte le operazioni Redis per ordini e corrieri:
- CRUD ordini e posizioni corrieri
- Transizioni di stato dell'ordine (macchina a stati)
- Operazioni Redis dirette (senza repository JPA)
- Lock distribuiti tramite `SETNX` per assegnazione corriere-ordine

#### OrderQueueService

Gestisce la coda FIFO degli ordini in attesa:
- Eseguito ogni 5 secondi (`@Scheduled(fixedRate = 5000)`)
- Calcola la distanza Haversine tra l'ordine e i corrieri disponibili
- Assegna l'ordine al corriere più vicino
- Limite massimo: 1000 ordini in coda
- Pulizia automatica degli ordini associati a corrieri obsoleti allo start e durante il processing

#### DistanceCalculator

Utilizza la formula Haversine per calcolare la distanza in chilometri tra due coordinate GPS.

---

## Frontend -- Nuxt 4

### Pagine

| Pagina | Route | Descrizione |
|--------|-------|-------------|
| `index.vue` | `/` | Homepage con hero, sezioni informative e navigazione |
| `UserPage.vue` | `/UserPage?orderId=0000` | Interfaccia cliente: ricerca ristorante, carrello, ordine, tracking |
| `RiderPage.vue` | `/RiderPage?courierId=0000` | Interfaccia corriere: ricezione ordini, GPS, navigazione |
| `TrackPage.vue` | `/TrackPage` | Dashboard tracciamento con controlli WebSocket manuali |
| `TestPage.vue` | `/TestPage` | Test API geolocalizzazione (coordinate grete) |
| `License.vue` | `/License` | Testo completo licenza AGPL-3.0 |

### Componenti

| Componente | File | Scopo |
|------------|------|-------|
| `HomePageComponent` | `HomePageComponent.vue` | Hero + 5 sezioni informative |
| `NavBarComponent` | `NavBarComponent.vue` | Barra navigazione fissa con switch lingua |
| `FooterComponent` | `FooterComponent.vue` | Footer con copyright e link |
| `SidebarComponent` | `SidebarComponent.vue` | Pannello laterale collassabile |
| `MapComponent` | `MapComponent.vue` | Wrapper MapLibre GL con marker personalizzati |
| `SearchComponent` | `SearchComponent.vue` | Barra di ricerca Nominatim con autocomplete |
| `FoodCardComponent` | `FoodCardComponent.vue` | Card articolo alimentare |
| `OrderComponent` | `OrderComponent.vue` | Item del carrello |
| `CoordinatesComponent` | `CoordinatesComponent.vue` | Tooltip coordinate mouse |
| `StatusModalComponent` | `StatusModalComponent.vue` | Modal stato ordine |
| `RoutingCardComponent` | `RoutingCardComponent.vue` | Istruzioni di navigazione passo-passo |
| `RoutingEngineComponent` | `RoutingEngineComponent.vue` | Motore routing: polyline OSRM, Turf.js |
| `LoadingComponent` | `LoadingComponent.vue` | Overlay video di caricamento |

### Composables

| Composable | Funzioni principali | API richiamate |
|------------|---------------------|----------------|
| `useLocationApi` | `getLocation(courierId)` | `GET /api/locations/courier/{id}` |
| `useLocationWebSocket` | `connect()`, `disconnect()`, `subscribeToCourier()`, `unsubscribeFromCourier()`, `sendLocationUpdate()` | WebSocket `ws://{api}/ws/locations` |
| `useOrdersApi` | `createOrder()`, `getOrder()`, `fetchActiveOrder()`, `updateOrderToDelivering()`, `completeOrder()` | `/api/orders/*` |
| `useOrderDataApi` | Wrapper completo CRUD ordini + posizioni | Come sopra |
| `useRoutingEngineApi` | `getRoutingData(courierId, restaurant, destination)` | `https://router.project-osrm.org/route/v1/driving/{coords}` |
| `singleWebSocket` | `getLocationWebSocket()` | Singleton WebSocket |

### Pinia Stores

#### orderStore

**State:** `orderId`, `associatedCourierId`, `restaurant`, `destination`, `items[]`, `totalPrice`, `status`

**Azioni:**
- `submitOrder()` -- crea ordine e avvia polling
- `fetchOrder(id)` -- recupera ordine
- `fetchAndSetActiveOrder(courierId)` -- recupera ordine attivo
- `changeOrderStatus()` -- transizione FETCHING→DELIVERING o DELIVERING→COMPLETED

#### routingStore

**State:** `code`, `routes[]`, `waypoints[]`, `currentGPS[]`, `currentHeading`, `courierId`, `activeOrderId`, `passedPolyline[]`, `orderPollingInterval`, `isStopped`, `currentLegIndex`, `currentStepIndex`

**Getters:** `currentStep`, `allSteps`, `totalStepsCount`

**Azioni:**
- `syncRoutingData()` -- chiama OSRM, imposta rotta
- `syncGeolocation(coords, heading)` -- invia GPS via WebSocket
- `startOrderPolling()` -- polling ordine attivo ogni 3s
- `stopOrderPolling()` -- ferma polling
- `advanceStep()` / `resetStepTracking()` -- navigazione step

#### courierTrackingStore

**State:** `associatedCourierId`, `courierLocation`, `isTracking`, `isSubscribed`, `stopLocationWatch`

**Azioni:**
- `startTracking(courierId)` -- connette WebSocket, sottoscrive, watch posizione
- `stopTracking()` -- annulla sottoscrizione, reset

---

## Configurazione e distribuzione

### Configurazione frontend (nuxt.config.ts)

```typescript
runtimeConfig: {
    public: {
        apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8080/api",
        wsUrl: process.env.NUXT_PUBLIC_WS_URL || "ws://localhost:8080/ws/locations",
    },
};
```

Variabili d'ambiente richieste:
- `NUXT_PUBLIC_API_BASE` -- URL base API REST
- `NUXT_PUBLIC_WS_URL` -- URL WebSocket

Proxy sviluppo (Nitro):
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

### Configurazione backend (application.yml)

```yaml
server:
  port: 8080

spring:
  data:
    redis:
      host: localhost
      port: 6379
```

Profile disponibili:
- `dev` -- configurazione di sviluppo (logging DEBUG)
- `prod` -- password Redis da variabile d'ambiente, SSL abilitato, logging INFO

Variabili d'ambiente Redis:
- `REDIS_HOST` -- override host
- `REDIS_PORT` -- override porta
- `REDIS_PASSWORD` -- password Redis (solo prod)

### Distribuzione con Caddy

Il file `Caddyfile.template` definisce un reverse-proxy Caddy che instrada:

| Pattern | Target | Descrizione |
|---------|--------|-------------|
| `/api/*` | `localhost:8080` | API REST |
| `/ws/*` | `localhost:8080` | WebSocket |
| `{catch-all}` | `localhost:3000` | Frontend Nuxt |

Per il deployment:
1. Sostituisci `HOSTNAME` con il dominio effettivo
2. Configura TLS (il template usa `tls internal`)
3. Avvia frontend su porta 3000 e backend su porta 8080
4. Avvia Caddy con il file di configurazione

---

## Protocollo WebSocket

### Flusso di connessione

1. Il client stabilisce una connessione WebSocket a `ws://{host}:8080/ws/locations`
2. Il client invia un messaggio `subscribe` con `courierId`
3. Il server registra la sessione nel mapping bidirezionale
4. Il client invia periodicamente `location_update` con coordinate GPS
5. Il server persiste la posizione in Redis e la diffonde ai sottoscrittori
6. Al termine, il client invia `unsubscribe` e chiude la connessione

### Formato messaggi

**Subscribe:**
```json
{ "type": "subscribe", "courierId": "0001" }
```

**Unsubscribe:**
```json
{ "type": "unsubscribe", "courierId": "0001" }
```

**location_update (inviato dal client):**
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

**location_update (ricevuto dal client -- broadcast):**
Stesso formato, ricevuto dai sottoscrittori del `courierId`.

### Riconnessione automatica

Il composable `useLocationWebSocket` implementa un'autoriconnessione dopo 3 secondi in caso di disconnzione.
