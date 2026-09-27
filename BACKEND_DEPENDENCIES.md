# Backend Dependencies & Architecture: Property Valuation (Valua)

This document provides a comprehensive audit and technical specification of all backend dependencies, external services, data schemas, and deployment configurations used in the **Property Valuation (`Valua`)** project.

---

## 1. Executive Summary

| Service / Dependency | Provider / Tech | Role / Purpose | Cost / License |
| :--- | :--- | :--- | :--- |
| **Database** | Google Cloud Firestore (Firebase) | Persistent NoSQL store for appraisal submissions | Free tier / Pay-as-you-go |
| **Hosting** | Firebase Hosting | Static asset CDN for compiled Webpack bundle (`dist/`) | Free tier / Pay-as-you-go |
| **Map Rendering** | Leaflet + OpenStreetMap | Interactive client-side map visualization & pins | 100% Free & Open-Source |
| **Geocoding & Search** | OpenStreetMap Nominatim | Forward address search & reverse coordinate lookup | 100% Free & Open-Source (ODbL) |
| **Storage (Historical)** | Firebase Storage | Previously stored marker assets (now replaced by SVG) | Free tier / Legacy |
| **Google Maps API** | *Removed* | Formerly used for Maps JS, Places, and Geocoding | Replaced (Zero Google Maps billing) |

---

## 2. Firebase Cloud Firestore (Primary Database)

### 2.1 Configuration
The client application connects directly to Firestore via the Firebase JavaScript SDK (`firebase` v8.x) initialized in [`src/firebase.js`](file:///c:/Users/CarlosDonatoAlvarezF/Proyects/property_valuation/src/firebase.js):

```javascript
var firebaseConfig = {
    apiKey: "AIzaSyDybE0bEen3CV5lzqVbT3ZRl73ZKu-AQcM",
    authDomain: "property-valuator.firebaseapp.com",
    projectId: "property-valuator",
    storageBucket: "property-valuator.appspot.com",
    messagingSenderId: "360449449280",
    appId: "1:360449449280:web:a64721a1197e9a592d2ea5"
};
```

> **Note on Firebase Web API Keys:** The `apiKey` shown in `firebaseConfig` is a client identifier used to route requests to the Google Cloud project. It does **not** grant administrative access; access controls are enforced via Firestore Security Rules.

### 2.2 Collections and Data Schema

The application operates on a single primary collection named **`Properties`**.

#### Document Schema (`Properties` Collection)

| Field Name | Data Type | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `address` | `string` | `"Av. Paseo de los Héroes 95, Tijuana, B.C."` | Resolved street address from user input or geocoding |
| `name` | `string` | `"Carlos Alvarez"` | Full name of the user requesting valuation |
| `email` | `string` | `"carlos@example.com"` | Requester's contact email |
| `phone` | `string` | `"(664) 555-0199"` | Requester's phone number |
| `condition` | `string` | `"Brand new" \| "Very good" \| "Good" \| "Need work"` | Structural condition assessed by owner |
| `urgency` | `string` | `"Immediately" \| "Soon" \| "I can wait" \| "Only curious"` | Selling or appraisal timeline |
| `coments` | `string` | `"Corner lot, updated kitchen, 3 bedrooms."` | Free-form notes and property characteristics |
| `lat` | `number` | `32.51495` | WGS84 geographic latitude coordinate |
| `lng` | `number` | `-117.03825` | WGS84 geographic longitude coordinate |
| `createdAt` | `string` (ISO 8601) | `"2026-09-26T19:14:00.000Z"` | Creation timestamp |

### 2.3 Data Access Patterns

- **Create Appraisal Request (Write):**
  - Invoked from `PopertyService.addProperty()` in [`src/Services/property.service.js`](file:///c:/Users/CarlosDonatoAlvarezF/Proyects/property_valuation/src/Services/property.service.js).
  - Method: `db.collection("Properties").add(newProperty)`.
- **List All Appraisals (Read):**
  - Invoked in [`src/Components/PropertyList.jsx`](file:///c:/Users/CarlosDonatoAlvarezF/Proyects/property_valuation/src/Components/PropertyList.jsx).
  - Method: `db.collection('Properties').get()`.
- **Retrieve Single Appraisal (Read):**
  - Invoked in [`src/Components/PropertyDetails.jsx`](file:///c:/Users/CarlosDonatoAlvarezF/Proyects/property_valuation/src/Components/PropertyDetails.jsx).
  - Method: `db.collection('Properties').doc(id).get()`.

### 2.4 Recommended Firestore Security Rules
To ensure secure production operation, configure your Firebase console security rules as follows:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Properties/{documentId} {
      // Allow reading for logged appraisals
      allow read: if true;
      
      // Allow creation with validation of required fields
      allow create: if request.resource.data.address is string
                    && request.resource.data.name is string
                    && request.resource.data.email is string
                    && request.resource.data.lat is number
                    && request.resource.data.lng is number;
                    
      // Prevent unauthorized modification or deletion from client
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## 3. Hosting & Deployment

The project is configured for **Firebase Hosting**:

- **`.firebaserc`**:
  ```json
  {
    "projects": {
      "default": "property-valuator"
    }
  }
  ```
- **`firebase.json`**:
  ```json
  {
    "hosting": {
      "public": "dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  }
  ```
- **Deployment command:**
  ```bash
  npm run build
  firebase deploy --only hosting
  ```

---

## 4. Geospatial & Mapping Services (Transition from Google Maps to Open Source)

### 4.1 Previous Architecture (Google Maps - Deprecated)
- **Services Used:** Google Maps JavaScript API, Google Places Autocomplete API, Google Geocoding API.
- **Drawbacks:** Required active Google Cloud billing, restricted API keys, recurring usage charges per 1,000 requests, vendor lock-in.

### 4.2 Current Architecture (Leaflet + OpenStreetMap + Nominatim)
- **Map Library:** [`leaflet`](https://leafletjs.com/) (v1.9.4) - Pure open-source client JavaScript library.
- **Map Tile Provider:**
  - **OpenStreetMap Standard Tile Server:**
    `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  - Zero API key required, zero monthly cost, open attribution (`&copy; OpenStreetMap contributors`).
- **Geocoding & Autocomplete Provider:**
  - **Nominatim Search API:**
    `https://nominatim.openstreetmap.org/search?format=json&q={query}&addressdetails=1&limit=5`
  - **Nominatim Reverse Geocoding API:**
    `https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}&zoom=18&addressdetails=1`
  - Features: Automatic address resolution on map click, debounced live autocomplete search in the control panel.

---

## 5. Potential Future Backend Migrations

If you choose to migrate away from Firebase in the future, the following alternatives can replace Firestore with minimal effort:

1. **Supabase (Recommended Open-Source Backend):**
   - Direct PostgreSQL database with built-in PostGIS support for spatial distance calculations (e.g. *"find valuations within 5km"*).
   - Generates instant RESTful and GraphQL APIs with Row Level Security (RLS).
2. **Node.js / Express + PostgreSQL:**
   - Dedicated REST API (`/api/properties`, `/api/valuation`).
   - Full control over valuation calculation algorithms, email alerts, and administrative authentication.
3. **PocketBase:**
   - Single-file lightweight backend (SQLite + real-time subscriptions) that can be self-hosted on any $5/month VPS.

---

*Document compiled for the Valua Property Valuation platform.*
