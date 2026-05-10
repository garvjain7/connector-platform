import json
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from connectors.manager import get_connector
from core import normalizer, storage

router = APIRouter(prefix="/api/ingest", tags=["ingest"])

# File-based connectors that receive files via multipart
FILE_CONNECTORS = {"csv", "excel", "google_sheets", "google_analytics"}


def _build_dataset_id(connector: str, source: str) -> str:
    """Generate dataset ID: connector_source_YYYYMMDD_HHMM"""
    ts = datetime.now().strftime("%Y%m%d_%H%M")
    safe_source = source.replace(".", "_").replace("/", "_").replace(" ", "_")
    return f"{connector}_{safe_source}_{ts}"


# ─── Validate ─────────────────────────────────────────────────────────────────

@router.post("/validate")
async def validate_connection(
    connector: str = Form(...),
    credentials: str = Form("{}"),       # JSON string for credential connectors
    file: Optional[UploadFile] = File(None),
    service_account_file: Optional[UploadFile] = File(None),
):
    """
    Step 1 of ingestion: test connection and return available sources.
    Handles both file-upload and credential-based connectors.
    """
    try:
        creds = json.loads(credentials)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid credentials JSON")

    # Attach file bytes to config for file-based connectors
    if file is not None:
        creds["file_bytes"] = await file.read()
        creds["filename"] = file.filename

    # Attach parsed service account JSON for Google connectors
    if service_account_file is not None:
        sa_bytes = await service_account_file.read()
        try:
            creds["service_account_json"] = json.loads(sa_bytes)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid service account JSON file")

    try:
        conn = get_connector(connector)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    result = conn.validate(creds)
    return result


# ─── Fetch ────────────────────────────────────────────────────────────────────

@router.post("/fetch")
async def fetch_data(
    connector: str = Form(...),
    credentials: str = Form("{}"),
    source: str = Form(...),
    file: Optional[UploadFile] = File(None),
    service_account_file: Optional[UploadFile] = File(None),
):
    """
    Step 2 of ingestion: fetch data, normalize, persist.
    Returns dataset_id and meta. Frontend navigates to preview using dataset_id.
    """
    try:
        creds = json.loads(credentials)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid credentials JSON")

    if file is not None:
        creds["file_bytes"] = await file.read()
        creds["filename"] = file.filename

    if service_account_file is not None:
        sa_bytes = await service_account_file.read()
        try:
            creds["service_account_json"] = json.loads(sa_bytes)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid service account JSON file")

    try:
        conn = get_connector(connector)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # ── Fetch raw DataFrame ──
    try:
        df = conn.fetch(creds, source)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Connector fetch failed: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=422, detail="Connector returned an empty dataset")

    # ── Normalize ──
    dataset_id = _build_dataset_id(connector, source)
    dataset = normalizer.normalize(df, connector=connector, source=source, dataset_id=dataset_id)

    # ── Persist ──
    storage.save_raw(df, dataset_id)
    storage.save_normalized(dataset)

    # ── Response ──
    warning = None
    if dataset.meta.truncated:
        warning = (
            f"Dataset has {dataset.meta.row_count_total:,} rows. "
            f"Stored first {dataset.meta.row_count_stored:,} rows."
        )

    return {
        "dataset_id": dataset_id,
        "meta": dataset.meta.model_dump(),
        "truncated": dataset.meta.truncated,
        "truncation_warning": warning,
    }
