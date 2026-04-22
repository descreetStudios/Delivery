# User Documentation

## Overview

Untitled Delivery Project is a food delivery platform that connects customers with couriers through live GPS tracking, automatic order assignment, and turn-by-turn navigation.

### Available roles

The system supports two distinct roles:

- **Customer** -- places orders at restaurants and tracks delivery in real time
- **Courier** -- receives assigned orders, navigates to the restaurant and destination, and completes delivery

---

## Getting started

### Requirements

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Allow GPS location access in your browser
- An active internet connection

### Accessing the platform

1. Open your browser and navigate to the platform URL
2. You will be directed to the Homepage
3. Use the top navigation bar to access different sections

---

## Customer Interface

### Homepage

The homepage presents an introductory view with informational sections:

- **Hero section** -- title and service description with animated arrows
- **Restaurants** -- overview of the delivery service
- **How it works** -- a 4-step procedure
- **Become a rider** -- link to the dedicated courier page

### Placing an Order

1. Click **"Order now"** to access the order page
2. The interactive map shows your current location and available options
3. Use the **search bar** to find a restaurant:
   - Type the name or address
   - Results appear with autocomplete (250ms debounce)
   - Navigate results using Up/Down arrows and confirm with Enter
   - Selected results highlight the OSM geometry on the map
4. Select dishes from the restaurant menu (cards display name, image, and price)
5. Added items appear in the **cart** (icon in the navigation bar)
6. Click **"Submit your order"** to confirm

### Order Status

After submitting an order, the status updates in real time:

| Status | Description |
|--------|-------------|
| **Queued** | The order is waiting to be assigned to a courier |
| **Assigned** | A courier has been assigned to the order |
| **Delivering** | The courier is en route with the order |
| **Completed** | The order has been successfully delivered |

Status is displayed in a modal popup and updated via API polling every 3 seconds.

### Courier Tracking

When a courier is assigned:
1. A popup shows the "Courier assigned" status with the courier ID
2. The map begins showing the courier's real-time position
3. The courier is displayed with a custom icon on the map
4. Position updates flow in real time through WebSocket

### Switching Roles

On both the Customer and Courier pages, there is a link to switch to the other role in case you want to test both interfaces.

---

## Courier Interface

### Access

1. Click **"Rider"** in the navigation bar, or
2. Use the "Become a rider" link from the homepage
3. The URL requires a `courierId` parameter (e.g., `RiderPage?courierId=0000`)
4. If not specified, a default value is used automatically

### Receiving an Order

1. The system periodically checks (every 3 seconds) for new assigned orders
2. When an order arrives, a sidebar panel displays the details:
   - **Order ID** -- unique identifier
   - **Items** -- list of ordered items
   - **Total price** -- total order amount
   - **Restaurant address** -- pickup location
   - **Destination address** -- delivery location

### Navigation

The system provides integrated GPS navigation:

1. **Route calculation** -- the route is automatically drawn on the map from the courier to the restaurant, then to the destination
2. **Turn-by-turn instructions** -- a card displays navigation instructions including:
   - Distance to the next maneuver
   - Maneuver type (turn right/left, go straight, roundabout, etc.)
3. **Context prompts** -- proximity-based messages:
   - "Reach the restaurant"
   - "Pickup the order"
   - "Reach the destination"
   - "Complete the order"
4. **Auto-recalculation** -- if the courier deviates more than 25 meters from the route, the system automatically recalculates the path

### Completing an Order

1. When the courier reaches the destination, click **"Complete order"**
2. The order transitions to "Completed" status
3. The courier returns to waiting for new orders

---

## Map Features

### Map components

- **Interactive map** -- powered by MapLibre GL with OpenStreetMap tiles
- **Custom markers** -- distinct icons for restaurant (pickup) and moving courier
- **Geolocation control** -- button to center the map on your current position
- **Coordinate tooltip** -- displays mouse pointer lat/lng coordinates (5 decimal places)
- **OSM geometry highlight** -- clicking a search result highlights its geometry on the map

### Search

The search function uses Nominatim (OpenStreetMap geocoding):

- Autocomplete with 250ms debounce
- Keyboard navigation (Up/Down/Enter/Esc)
- Automatic result type detection (civic address or generic point of interest)
- Automatic zoom to results using bounding-box

---

## Settings

### Language

The system supports three languages:

| Language | Code |
|----------|------|
| Italiano | it |
| English | en |
| Español | es |

To change language:
1. Click the language icon in the navigation bar
2. Select the desired language from the dropdown with country flags
3. The choice is saved in a cookie and persists across sessions

### Debug mode

A debug mode is accessible through the test pages:
- **TestPage** -- displays raw GPS coordinates for testing geolocation functionality
- **TrackPage** -- WebSocket tracking test dashboard with manual controls

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Map does not load | Check your internet connection and reload the page |
| Geolocation not working | Ensure you have granted location access in your browser |
| Order not being assigned | Verify there are couriers online; the order is queued until one becomes available |
| Courier not appearing on map | Check that GPS is active and the WebSocket is connected |
| Search returns no results | Try a different address or name; Nominatim may have incomplete data for some areas |
| Application is slow | Check your connection speed; polling is set to 3 seconds |

---

## Privacy notes

- GPS coordinates are transmitted only during active use of the service
- Data is stored in Redis with automatic expiration (TTL)
- Courier locations expire after 5 minutes if not updated
- Orders expire after 60 minutes if not completed
