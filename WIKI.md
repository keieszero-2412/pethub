# 📚 PetHub Wiki

> Comprehensive developer & user documentation for the PetHub Pet Ecosystem Platform.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Architecture Overview](#2-architecture-overview)
3. [Module Deep Dive](#3-module-deep-dive)
   - [3.1 Dashboard](#31-dashboard)
   - [3.2 Pet Shop](#32-pet-shop--e-commerce)
   - [3.3 Service Booking](#33-service-booking)
   - [3.4 Health Tracking](#34-health-tracking)
   - [3.5 Rescue & Adoption](#35-rescue--adoption)
4. [Frontend Architecture](#4-frontend-architecture)
   - [4.1 Design System (global.css)](#41-design-system-globalcss)
   - [4.2 Shared JavaScript (api.js)](#42-shared-javascript-apijs)
   - [4.3 Cart Module (cart.js)](#43-cart-module-cartjs)
5. [Backend Architecture](#5-backend-architecture)
   - [5.1 Serverless Functions](#51-serverless-functions)
   - [5.2 API Reference](#52-api-reference)
6. [Data Schemas](#6-data-schemas)
   - [6.1 Product Schema](#61-product-schema)
   - [6.2 Pet Schema](#62-pet-schema)
   - [6.3 Health Record Schema](#63-health-record-schema)
   - [6.4 Booking Schema](#64-booking-schema)
   - [6.5 Cart Item Schema](#65-cart-item-schema)
7. [Routing & URL Configuration](#7-routing--url-configuration)
8. [Theming](#8-theming)
9. [Common Components](#9-common-components)
10. [Local Development Guide](#10-local-development-guide)
11. [Deployment Guide](#11-deployment-guide)
12. [Troubleshooting & FAQ](#12-troubleshooting--faq)

---

## 1. Introduction

**PetHub** is a multi-module pet utility web application built as a programming practice project. It demonstrates a modern, full-stack web architecture using only vanilla technologies on the frontend (no React, Vue, or Angular) paired with Python serverless functions on the backend.

### Goals

- Practice full-stack web development without relying on frontend frameworks
- Learn serverless deployment with Vercel
- Implement client-side data persistence with Web Storage APIs
- Build a polished, responsive UI with CSS custom properties and animations

### Target Audience

This wiki is intended for developers who want to understand, modify, or extend the PetHub codebase.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │Dashboard │  │  Shop    │  │ Booking  │  │  Health    │  │
│  │index.html│  │shop.html │  │booking   │  │ health    │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       │              │             │               │        │
│       └──────┬───────┴─────┬───────┴───────┬───────┘        │
│              │             │               │                │
│         ┌────┴────┐  ┌─────┴─────┐  ┌──────┴──────┐        │
│         │ api.js  │  │  cart.js  │  │ global.css  │        │
│         └────┬────┘  └─────┬─────┘  └─────────────┘        │
│              │             │                                │
│    ┌─────────┴──────┐  ┌───┴────────────┐                   │
│    │ SessionStorage │  │  LocalStorage  │                   │
│    │  (bookings)    │  │ (cart, health, │                   │
│    └────────────────┘  │  theme)        │                   │
│                        └────────────────┘                   │
└────────────────────────────┬────────────────────────────────┘
                             │ fetch()
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL PLATFORM                         │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │ /api/store  │  │ /api/booking │  │  /api/health    │    │
│  │  store.py   │  │  booking.py  │  │   health.py     │    │
│  └─────────────┘  └──────────────┘  └─────────────────┘    │
│                                                             │
│  ┌──────────────────────────────────────────┐               │
│  │  Static Assets                           │               │
│  │  /public/data/products.json              │               │
│  │  /public/data/pets.json                  │               │
│  └──────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

- **No build step** — All HTML/CSS/JS files are served as-is.
- **Progressive enhancement** — The app works without the Python APIs; APIs provide optional server-side processing.
- **Client-side persistence** — `LocalStorage` for long-term data (cart, health records, theme), `SessionStorage` for session-scoped data (bookings).
- **Clean URLs** — Vercel rewrites map `/shop` → `/src/pages/shop.html`, etc.

---

## 3. Module Deep Dive

### 3.1 Dashboard

**File:** `src/pages/index.html`  
**Route:** `/dashboard` (or root `/`)

The landing page serves as the central navigation hub. It includes:

- A **hero section** with animated gradient background and call-to-action buttons
- **Feature cards** linking to each module (Shop, Booking, Health, Rescue)
- Scroll-reveal animations powered by `IntersectionObserver`
- Responsive grid layout that adapts from 1 to 4 columns

### 3.2 Pet Shop (E-Commerce)

**File:** `src/pages/shop.html`  
**Route:** `/shop`

The shop module loads product data from `public/data/products.json` and renders a filterable product grid.

**Features:**

- Category filter tabs: All, Food, Toys, Accessories, Health
- Text search across product names and descriptions
- Product cards showing image, name, price, rating, and stock status
- "Add to Cart" button that integrates with the Cart module
- Cart drawer with quantity controls and checkout placeholder

**Data flow:**

```
products.json → fetch() → API.fetchProducts() → render cards → Cart.addItem() → LocalStorage
```

### 3.3 Service Booking

**File:** `src/pages/booking.html`  
**Route:** `/booking`

A service booking form where users can schedule pet care appointments.

**Available Services:**

| Service | Description |
|---|---|
| Grooming | Bath, haircut, nail trimming |
| Veterinary | Health checkup, vaccination |
| Training | Obedience, agility, behavioral |
| Boarding | Overnight and extended stay care |

**Form Fields:**

- Service type (dropdown)
- Pet name (text)
- Date (date picker)
- Time (time picker)
- Owner name (text)
- Phone number (tel)
- Special notes (textarea, optional)

**Data flow:**

```
Form submit → API.submitBooking() → SessionStorage ('pethub_bookings') → confirmation toast
```

In a production Vercel environment, the form data would be `POST`ed to `/api/booking` instead.

### 3.4 Health Tracking

**File:** `src/pages/health.html`  
**Route:** `/health`

A full CRUD interface for managing pet health/medical records.

**Operations:**

| Action | Method | Description |
|---|---|---|
| **Create** | `API.healthRecords.create(data)` | Add a new health record |
| **Read** | `API.healthRecords.getAll()` / `getById(id)` | List all or fetch one record |
| **Update** | `API.healthRecords.update(id, data)` | Modify an existing record |
| **Delete** | `API.healthRecords.delete(id)` | Remove a record |

**Record Fields:**

- Pet name
- Pet type (dog, cat, bird, rabbit, other)
- Visit date
- Veterinarian name
- Diagnosis
- Treatment / medication
- Next appointment date
- Notes

All records are stored in `LocalStorage` under the key `pethub_health_records`.

### 3.5 Rescue & Adoption

**File:** `src/pages/rescue.html`  
**Route:** `/rescue`

Displays a catalog of rescue pets available for adoption.

**Features:**

- Filter by animal type: All, Dogs, Cats, Birds, Rabbits
- Filter by status: All, Available, Pending, Adopted
- Pet cards showing image, name, breed, age, temperament tags, vaccination/neuter status
- Status badges with color coding (green = available, yellow = pending, gray = adopted)
- Adoption interest button (opens a prompt/form)

**Data source:** `public/data/pets.json` containing 8 pet profiles.

---

## 4. Frontend Architecture

### 4.1 Design System (global.css)

**File:** `src/css/global.css` (~32KB)

The CSS design system is built entirely with **CSS custom properties** (variables) for easy theming and consistency.

#### CSS Custom Properties (Tokens)

```css
/* Example color tokens */
--color-primary: #FF6B6B;
--color-secondary: #4ECDC4;
--color-accent: #FFE66D;

/* Spacing scale */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 48px;

/* Typography */
--font-heading: 'Outfit', sans-serif;
--font-body: 'Inter', sans-serif;
```

#### Component Classes

| Class | Purpose |
|---|---|
| `.navbar` | Fixed top navigation bar with glassmorphism effect |
| `.btn`, `.btn-primary`, `.btn-secondary` | Button variants |
| `.card` | Base card component with hover elevation |
| `.toast-container`, `.toast` | Toast notification stack |
| `.cart-drawer` | Slide-in cart panel |
| `.form-group`, `.form-input` | Form styling |
| `.badge` | Small label/tag component |

#### Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 768px) { ... }

/* Mobile */
@media (max-width: 480px) { ... }
```

### 4.2 Shared JavaScript (api.js)

**File:** `src/js/api.js` (~8KB)

This module provides shared utilities used by all pages:

| Function / Object | Purpose |
|---|---|
| `API.fetchProducts(category, search)` | Load & filter products from JSON |
| `API.fetchPets(type, status)` | Load & filter rescue pets from JSON |
| `API.submitBooking(data)` | Save booking to SessionStorage |
| `API.getBookings()` | Retrieve all bookings |
| `API.healthRecords.*` | CRUD operations for health records |
| `showToast(message, type, duration)` | Display toast notifications |
| `initTheme()` / `toggleTheme()` | Dark/light mode management |
| `initNavbarScroll()` | Add `.scrolled` class on scroll |
| `initMobileMenu()` | Hamburger menu toggle |
| `initScrollReveal()` | IntersectionObserver-based reveal |

### 4.3 Cart Module (cart.js)

**File:** `src/js/cart.js` (~5KB)

A self-contained cart system:

| Method | Description |
|---|---|
| `Cart.getItems()` | Returns the current cart array |
| `Cart.addItem(product, qty)` | Add a product (or increment quantity) |
| `Cart.removeItem(id)` | Remove a product by ID |
| `Cart.updateQty(id, qty)` | Set quantity (removes if ≤ 0) |
| `Cart.getCount()` | Total item count |
| `Cart.getTotal()` | Total price |
| `Cart.clear()` | Empty the cart |
| `Cart.toggleDrawer()` | Open/close the cart drawer |
| `Cart.renderDrawer()` | Re-render cart drawer HTML |
| `Cart.updateBadge()` | Update the navbar cart count badge |
| `Cart.init()` | Initialize on page load |

---

## 5. Backend Architecture

### 5.1 Serverless Functions

All backend code lives in the `api/` directory. Vercel automatically deploys any Python file in this folder as a serverless function.

Each function follows this pattern:

```python
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Handle GET requests
        ...
    def do_POST(self):
        # Handle POST requests
        ...
    def do_OPTIONS(self):
        # Handle CORS preflight
        ...
```

**Dependencies:** None beyond the Python standard library (`json`, `uuid`, `datetime`, `os`).

### 5.2 API Reference

| Method | Endpoint | Handler | Description |
|---|---|---|---|
| `GET` | `/api/store` | `store.py` | Store API health check |
| `GET` | `/api/booking` | `booking.py` | Booking API health check |
| `POST` | `/api/booking` | `booking.py` | Submit a new booking |
| `GET` | `/api/health` | `health.py` | Health API health check |

> **Note:** In the current demo implementation, the frontend does not call the Python APIs for data operations. Products and pets are loaded from static JSON, and booking/health data is managed entirely on the client side. The APIs exist to demonstrate the serverless architecture and can be extended for server-side processing.

---

## 6. Data Schemas

### 6.1 Product Schema

**Location:** `public/data/products.json`

```json
{
  "id": 1,
  "name": "Premium Dry Dog Food",
  "category": "food | toys | accessories | health",
  "price": 45.99,
  "image": "https://images.unsplash.com/...",
  "description": "Product description text",
  "rating": 4.8,
  "stock": 50
}
```

**Categories:** `food`, `toys`, `accessories`, `health`

### 6.2 Pet Schema

**Location:** `public/data/pets.json`

```json
{
  "id": 1,
  "name": "Buddy",
  "type": "dog | cat | bird | rabbit",
  "breed": "Golden Retriever",
  "age": "2 years",
  "gender": "Male | Female",
  "description": "Detailed pet description",
  "image": "https://images.unsplash.com/...",
  "vaccinated": true,
  "neutered": true,
  "temperament": ["Friendly", "Playful", "Loyal"],
  "status": "available | pending | adopted"
}
```

### 6.3 Health Record Schema

**Location:** `LocalStorage` → `pethub_health_records`

```json
{
  "id": "HR-LK8F4G2M",
  "petName": "Buddy",
  "petType": "dog",
  "visitDate": "2026-08-15",
  "vetName": "Dr. Smith",
  "diagnosis": "Annual checkup",
  "treatment": "Vaccination booster",
  "nextAppointment": "2027-02-15",
  "notes": "All vitals normal",
  "createdAt": "2026-08-15T10:30:00.000Z",
  "updatedAt": "2026-08-15T10:30:00.000Z"
}
```

### 6.4 Booking Schema

**Location:** `SessionStorage` → `pethub_bookings`

```json
{
  "id": "BK-LK8F4G2M",
  "service": "grooming",
  "petName": "Buddy",
  "date": "2026-09-01",
  "time": "10:00",
  "ownerName": "John Doe",
  "phone": "0123456789",
  "notes": "Please use hypoallergenic shampoo",
  "status": "confirmed",
  "createdAt": "2026-08-16T06:00:00.000Z"
}
```

### 6.5 Cart Item Schema

**Location:** `LocalStorage` → `pethub_cart`

```json
{
  "id": 1,
  "name": "Premium Dry Dog Food",
  "price": 45.99,
  "image": "https://images.unsplash.com/...",
  "qty": 2
}
```

---

## 7. Routing & URL Configuration

Clean URLs are configured in `vercel.json` using Vercel's rewrite rules:

| Clean URL | Actual File |
|---|---|
| `/` | `index.html` → redirects to `/src/pages/index.html` |
| `/dashboard` | `/src/pages/index.html` |
| `/shop` | `/src/pages/shop.html` |
| `/booking` | `/src/pages/booking.html` |
| `/health` | `/src/pages/health.html` |
| `/rescue` | `/src/pages/rescue.html` |
| `/api/store` | `api/store.py` (auto-detected by Vercel) |
| `/api/booking` | `api/booking.py` (auto-detected by Vercel) |
| `/api/health` | `api/health.py` (auto-detected by Vercel) |

CORS headers are applied to all `/api/*` routes, allowing:

- **Origins:** `*` (all origins)
- **Methods:** `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **Headers:** `Content-Type`

---

## 8. Theming

PetHub supports **light** and **dark** themes via the `data-theme` attribute on `<html>`.

### How It Works

1. On page load, `initTheme()` checks `LocalStorage` for `pethub_theme`
2. If `'dark'`, the attribute `data-theme="dark"` is set on `<html>`
3. CSS uses attribute selectors to override custom properties:

```css
[data-theme="dark"] {
  --bg-primary: #0F0F1A;
  --text-primary: #E8E8F0;
  /* ... other dark overrides */
}
```

4. The theme toggle button (🌙 / ☀️) calls `toggleTheme()` which flips the attribute and saves the preference

### Extending the Theme

To add new theme-aware colors, define both light and dark variants in `global.css`:

```css
:root {
  --my-color: #FFFFFF;
}

[data-theme="dark"] {
  --my-color: #1A1A2E;
}
```

---

## 9. Common Components

### Navbar

Every page includes a shared navigation bar with:

- PetHub logo and brand name (🐾)
- Navigation links: Dashboard, Shop, Booking, Health, Rescue
- Theme toggle button
- Cart icon with badge (showing item count)
- Hamburger menu for mobile
- Glassmorphism blur effect on scroll (`.scrolled` class)

### Toast Notifications

Usage in JavaScript:

```javascript
showToast('Item added to cart!', 'success');   // ✓ Green
showToast('Something went wrong', 'error');     // ✕ Red
showToast('Did you know...', 'info');           // ℹ Blue
showToast('Check your input', 'warning');       // ⚠ Yellow
```

### Scroll Reveal

Add the `.reveal` class to any element to make it fade in when scrolled into view:

```html
<div class="reveal">This content will animate in</div>
```

The `IntersectionObserver` in `api.js` adds the `.visible` class when the element enters the viewport.

---

## 10. Local Development Guide

### Option 1: Simple Static Server

Best for frontend-only development.

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → "Open with Live Server"
```

### Option 2: Vercel CLI (Full Stack)

Required for testing serverless Python APIs.

```bash
# Install
npm i -g vercel

# Start dev server
vercel dev

# Access at http://localhost:3000
```

### File Watching

Since there's no build step, changes to HTML/CSS/JS are reflected immediately on page refresh. No hot module replacement is needed.

---

## 11. Deployment Guide

### Vercel (Recommended)

1. **Connect repository** — Link your GitHub/GitLab/Bitbucket repo to Vercel
2. **Auto-detect** — Vercel reads `vercel.json` for routing config
3. **Python runtime** — Vercel auto-detects `api/*.py` as serverless functions
4. **Deploy** — Every push to `main` triggers a new deployment

### Manual Deploy

```bash
# From the project root
vercel --prod
```

### Environment Variables

No environment variables are required for the current setup. If you extend the APIs to use external services (databases, email, etc.), add them in:

- **Vercel Dashboard** → Project Settings → Environment Variables
- **Local `.env`** file (auto-loaded by `vercel dev`)

---

## 12. Troubleshooting & FAQ

### Products/pets not loading?

- **Check the browser console** for fetch errors
- Ensure you're serving from the project root (not from `src/pages/`)
- The `API.getBasePath()` function handles path resolution — it detects whether you're in `/src/pages/` or at the root

### Cart data disappeared?

- Cart uses `LocalStorage` — clearing browser data will erase it
- Try `localStorage.getItem('pethub_cart')` in the console to inspect

### Bookings disappeared after closing the tab?

- This is expected. Bookings use `SessionStorage`, which is cleared when the browser tab is closed
- To persist bookings, change the storage to `LocalStorage` in `api.js`

### CORS errors when calling APIs?

- CORS headers are configured in `vercel.json` for the Vercel environment
- For local development with `vercel dev`, CORS is handled automatically
- If using a simple HTTP server, APIs won't work (they require Vercel's Python runtime)

### Dark mode not persisting?

- Check that `LocalStorage` is not disabled in your browser
- Verify the key: `localStorage.getItem('pethub_theme')` should return `'dark'` or `'light'`

### How to add a new page?

1. Create the HTML file in `src/pages/newpage.html`
2. Include `global.css`, `api.js`, and optionally `cart.js`
3. Add a rewrite rule in `vercel.json`:
   ```json
   { "source": "/newpage", "destination": "/src/pages/newpage.html" }
   ```
4. Add a navigation link in the navbar of existing pages

### How to add a new API endpoint?

1. Create a Python file in `api/` (e.g., `api/newroute.py`)
2. Define a `handler` class extending `BaseHTTPRequestHandler`
3. Implement `do_GET`, `do_POST`, etc.
4. The endpoint is automatically available at `/api/newroute`

---

<p align="center">
  <strong>PetHub Wiki</strong> — Last updated: August 2026
</p>
