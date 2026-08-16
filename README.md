# 🐾 PetHub — Pet Ecosystem Platform

An all-in-one pet utility web app built with Vanilla HTML/CSS/JS and Python Serverless Functions, deployed on Vercel.

## Features

- 🏠 **Dashboard** — Central navigation hub
- 🛒 **Pet Shop** — Browse products, filter by category, add to cart
- 📅 **Service Booking** — Schedule grooming, vet, training & boarding
- 🏥 **Health Tracking** — CRUD management of pet medical records
- 🐶 **Rescue & Adoption** — Browse adoptable pets

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Backend | Python 3 — Vercel Serverless Functions |
| Data | Static JSON + LocalStorage / SessionStorage |
| Deployment | [Vercel](https://vercel.com) |

## Quick Start

```bash
# Simple static server
python -m http.server 8000

# Or with Vercel CLI (full stack with APIs)
npm i -g vercel
vercel dev
```

## Project Structure

```
PET/
├── api/               # Python Serverless Functions
├── public/data/       # Static JSON data (products, pets)
├── src/
│   ├── css/           # Design system (global.css)
│   ├── js/            # Shared modules (api.js, cart.js)
│   └── pages/         # HTML pages (dashboard, shop, booking, health, rescue)
├── index.html         # Root redirect
└── vercel.json        # Vercel routing & CORS config
```

## Documentation

See [WIKI.md](WIKI.md) for detailed documentation including architecture, API reference, data schemas, theming, and troubleshooting.

