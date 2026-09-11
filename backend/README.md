# OSPREY Backend — FastAPI Service

FastAPI intelligence backend for OSPREY (Ocean Spill Prediction, Reconstruction & Explainable Vessel Attribution).

---

## 1. Prerequisites

- **Python**: 3.11+ / 3.12+
- **Database**: Neon Serverless PostgreSQL with PostGIS extension
- **Shell**: Windows PowerShell or Command Prompt

---

## 2. Windows PowerShell Setup Guide

Follow these steps from within the `backend/` directory:

### Step 1: Open PowerShell in the Backend Directory

```powershell
cd C:\Users\mddan\OSPREY\backend
```

### Step 2: Create the Python Virtual Environment

```powershell
python -m venv .venv
```

### Step 3: Activate the Virtual Environment

```powershell
.\.venv\Scripts\Activate.ps1
```

### Step 4: Install Dependencies

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Step 5: Configure Environment Variables

Create `backend/.env` with your Neon connection string:
```ini
DATABASE_URL=postgresql://user:password@ep-sample.neon.tech/neondb?sslmode=require
COPERNICUS_CATALOG_URL=https://catalogue.dataspace.copernicus.eu/odata/v1/Products
```

---

## 3. Running the FastAPI Server

Start the development server with auto-reload:

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Access:
- **Service Health Check**: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
- **Database Health Check**: [http://127.0.0.1:8000/api/v1/health/db](http://127.0.0.1:8000/api/v1/health/db)
- **OpenAPI Swagger Docs**: [http://127.0.0.1:8000/api/v1/docs](http://127.0.0.1:8000/api/v1/docs)

---

## 4. Running the Test Suite

Run pytest:

```powershell
pytest -q
```

---

## 5. API Endpoints Overview

### Health & Connectivity
- `GET /` — Service reachability
- `GET /api/v1/health` — Basic service health status
- `GET /api/v1/health/db` — Neon PostgreSQL & PostGIS extension connectivity status

### Investigations
- `POST /api/v1/investigations` — Create an investigation record with PostGIS AOI Polygon
- `GET /api/v1/investigations` — Paginated list of investigations
- `GET /api/v1/investigations/{id}` — Retrieve an investigation by UUID

### Copernicus Data Space (CDSE) Sentinel-1 Integration (Step 10A)
- `POST /api/v1/investigations/{id}/satellite-scenes/search` — Search official CDSE OData catalog for real Sentinel-1 products intersecting the investigation PostGIS AOI
- `POST /api/v1/investigations/{id}/satellite-scenes/import` — Authoritatively revalidate and persist Sentinel-1 metadata and GeoFootprint into Neon/PostGIS (`METADATA_IMPORTED` state)
- `GET /api/v1/investigations/{id}/satellite-scenes` — List ingested scenes for an investigation
- `GET /api/v1/satellite-scenes/{id}` — Retrieve ingested scene details

> **Note on Step 10A Scope**: Step 10A performs **metadata-only discovery and ingestion**. Raw SAR raster file downloading (`.SAFE` / `.ZIP`) and authenticated token flows are deferred to **Step 10B**.
