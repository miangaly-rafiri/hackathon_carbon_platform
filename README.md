
# Carbon Site Footprint – Hackathon 2026

Fullstack platform to calculate the **carbon footprint of a physical site**.

Stack required by the specification:

- Backend: **Java Spring Boot**
- Frontend: **Angular**
- Mobile: **React Native**
- Database: **PostgreSQL**
- Auth: **JWT**
- Deployment: **Docker Compose**

## Features

- Create a site
- Calculate carbon footprint:
  - Construction (materials)
  - Exploitation (energy)
- KPIs:
  - Total CO2
  - CO2 / m²
  - CO2 / employee
- Dashboard
- Compare sites
- API ready for mobile

---

# Quick Start

Install:

- Docker
- Docker Compose

Run:

```
docker compose up --build
```

Services:

Backend  
http://localhost:8080

Database  
localhost:5432

---

# API Example

Create site

POST `/api/sites`

```
{
 "name":"Campus Rennes",
 "surface":11771,
 "parkingSpaces":300,
 "energyMWh":1840,
 "employees":1800
}
```

---

# Carbon Calculation

Energy factor:
0.05 kgCO2 / kWh

Materials (simplified):

| Material | kgCO2 / kg |
|--------|--------|
| concrete | 0.13 |
| steel | 1.9 |
| glass | 1.0 |
| wood | 0.04 |

---

# Angular Dashboard

Displays

- KPI cards
- chart data
- site comparison

---

# Mobile App

React Native app to

- Login
- Create site
- View CO2 result

---

# Hackathon Deliverables

Included:

✔ Backend API  
✔ PostgreSQL schema  
✔ Angular dashboard  
✔ React Native app  
✔ Docker deployment  
✔ Product documentation  

