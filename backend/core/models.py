from pydantic import BaseModel
from typing import Any, Optional
from datetime import datetime


# ─── Connector Metadata ───────────────────────────────────────────────────────

class ConnectorInfo(BaseModel):
    id: str
    label: str
    category: str          # file | database | saas | analytics
    tier: str              # easy | medium | hard
    description: str
    auth_type: str         # file_upload | credentials | api_key | service_account | oauth_note
    available: bool        # False = coming soon


# ─── Ingest Request Models ────────────────────────────────────────────────────

class ValidateRequest(BaseModel):
    connector: str
    credentials: dict[str, Any] = {}
    # file-based connectors send via multipart, not this model


class FetchRequest(BaseModel):
    connector: str
    credentials: dict[str, Any] = {}
    source: str            # table name, sheet tab, airtable table, etc.
    # file-based connectors send via multipart, not this model


# ─── Ingest Response Models ───────────────────────────────────────────────────

class ValidateResponse(BaseModel):
    status: str            # ok | error
    sources: list[dict]    # [{ "id": "public.orders", "label": "orders", "meta": {} }]
    message: str = ""


class ColumnMeta(BaseModel):
    name: str
    dtype: str
    nullable: bool


class DatasetMeta(BaseModel):
    dataset_id: str
    connector: str
    source: str
    imported_at: str
    row_count_total: int
    row_count_stored: int
    column_count: int
    truncated: bool
    truncation_limit: int


class NormalizedDataset(BaseModel):
    meta: DatasetMeta
    columns: list[ColumnMeta]
    rows: list[dict[str, Any]]


class FetchResponse(BaseModel):
    dataset_id: str
    meta: DatasetMeta
    truncated: bool
    truncation_warning: Optional[str] = None


# ─── Dataset List ─────────────────────────────────────────────────────────────

class DatasetSummary(BaseModel):
    dataset_id: str
    connector: str
    source: str
    imported_at: str
    row_count_stored: int
    column_count: int
    truncated: bool
