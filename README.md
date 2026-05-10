# Connector Ingestion Platform

A full-stack standalone system to ingest, normalize, and preview data from various sources.

## Project Structure
- `backend/`: FastAPI server handling data connectors and storage.
- `frontend/`: React + Vite application for the ingestion UI.

## Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env` (if provided) to customize ports or credentials.

### 3. Run Development Servers
```bash
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

## Features
- **Multi-Source Support**: CSV, Excel, SQL (Postgres/MySQL), SaaS (Notion, Airtable), and Analytics (GA4, HubSpot).
- **Automated Normalization**: Consistent JSON output for all data sources.
- **Data Preview**: Interactive tables to inspect data before processing.
- **Standalone Storage**: Local filesystem storage in `backend/uploads/`.
