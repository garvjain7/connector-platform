# Technical Report: Connector Ingestion Platform

## 1. Executive Summary
The **Connector Ingestion Platform** is a decoupled, full-stack application designed to bridge the gap between disparate data sources (SaaS, Databases, Files) and a unified data preview environment. It utilizes a **FastAPI** backend for high-performance data processing and a **React** frontend for a streamlined user experience.

---

## 2. System Architecture

### 2.1 Backend Architecture (Python/FastAPI)
The backend is organized into three primary layers:
- **API Layer (`/api/routes`)**: Handles HTTP requests, input validation (using Pydantic), and routing.
- **Connector Layer (`/connectors`)**: A modular plugin system where each data source is encapsulated in a class inheriting from `BaseConnector`.
- **Core Engine (`/core`)**: Handles the "Heavy Lifting" — normalization, type inference, and filesystem persistence.

### 2.2 Frontend Architecture (React/Vite)
- **State Management**: Zustand is used for lightweight, reactive state.
- **Routing**: React Router DOM handles the multi-step ingestion wizard.
- **API Client**: A centralized Axios instance with pre-configured interceptors and base URLs.

---

## 3. Data Flow & Life Cycle

### 3.1 The Ingestion Handshake
1. **Request Connection**: Frontend sends credentials (JSON or Multipart for files).
2. **Connector Validation**: Backend instantiates the specific connector; `connector.validate(config)` is called.
3. **Source Discovery**: Backend returns a list of available sub-sources (e.g., specific database tables).
4. **Data Fetching**: User selects a source; `connector.fetch(config, source)` retrieves a `pandas.DataFrame`.
5. **Normalization**: `normalizer.normalize(df)` maps types and converts the DataFrame into a JSON-serializable structure.
6. **Persistence**: Raw data is saved as `.csv`, and normalized data as `.json` in the `uploads/` directory.

---

## 4. Key Technical Components

### 4.1 The Normalizer Engine
The normalizer ensures that regardless of the source, the frontend receives a predictable JSON object:
```json
{
  "meta": { "dataset_id": "...", "row_count_total": 5000 },
  "columns": [ { "name": "email", "dtype": "string" } ],
  "rows": [ { "email": "user@example.com" } ]
}
```

### 4.2 Error Handling Strategy
- **Backend**: Uses custom `HTTPException` wrappers to pass detailed connector errors (e.g., "Invalid API Key") back to the UI.
- **Frontend**: Global error boundaries and try/catch blocks in the API client prevent UI crashes during network or connector failures.

---

## 5. Extensibility Guide (For Developers/AIs)

To add a new connector (e.g., `SlackConnector`):
1. Create a new file in `backend/connectors/saas/slack_connector.py`.
2. Inherit from `BaseConnector`.
3. Implement `validate()` to check the API token and return a list of channels.
4. Implement `fetch()` to pull message history into a DataFrame.
5. Register the class in `backend/connectors/manager.py`.

---

## 6. Security & Performance
- **CORS Policy**: Restrictive origin checking via environment variables.
- **Data Truncation**: Large datasets are truncated to 10,000 rows for storage and 100 rows for UI previews to ensure memory safety.
- **Async I/O**: FastAPI handles multiple ingestion requests concurrently without blocking the event loop.
