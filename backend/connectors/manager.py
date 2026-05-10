from connectors.base import BaseConnector

# ─── Connector imports ────────────────────────────────────────────────────────
from connectors.file.csv_connector import CSVConnector
from connectors.file.excel_connector import ExcelConnector
from connectors.file.json_connector import JSONConnector
from connectors.database.postgresql_connector import PostgreSQLConnector
from connectors.database.mysql_connector import MySQLConnector
from connectors.saas.google_sheets_connector import GoogleSheetsConnector
from connectors.saas.airtable_connector import AirtableConnector
from connectors.saas.notion_connector import NotionConnector
from connectors.analytics.hubspot_connector import HubSpotConnector
from connectors.analytics.google_analytics_connector import GoogleAnalyticsConnector

# ─── Registry ─────────────────────────────────────────────────────────────────
# Maps connector ID string → connector class
# Adding a new connector = one line here + one new file. Nothing else changes.

REGISTRY: dict[str, type[BaseConnector]] = {
    "csv":               CSVConnector,
    "excel":             ExcelConnector,
    "json_api":          JSONConnector,
    "postgresql":        PostgreSQLConnector,
    "mysql":             MySQLConnector,
    "google_sheets":     GoogleSheetsConnector,
    "airtable":          AirtableConnector,
    "notion":            NotionConnector,
    "hubspot":           HubSpotConnector,
    "google_analytics":  GoogleAnalyticsConnector,
}

# ─── Connector metadata (drives frontend gallery) ─────────────────────────────
CONNECTOR_CATALOG = [
    {
        "id": "csv",
        "label": "CSV File",
        "category": "file",
        "tier": "easy",
        "description": "Upload a comma-separated values file",
        "auth_type": "file_upload",
        "available": True,
    },
    {
        "id": "excel",
        "label": "Excel",
        "category": "file",
        "tier": "easy",
        "description": "Upload an .xlsx or .xls spreadsheet",
        "auth_type": "file_upload",
        "available": True,
    },
    {
        "id": "json_api",
        "label": "JSON / REST API",
        "category": "file",
        "tier": "easy",
        "description": "Fetch data from any public JSON endpoint",
        "auth_type": "url",
        "available": True,
    },
    {
        "id": "postgresql",
        "label": "PostgreSQL",
        "category": "database",
        "tier": "easy",
        "description": "Connect to a PostgreSQL database",
        "auth_type": "credentials",
        "available": True,
    },
    {
        "id": "mysql",
        "label": "MySQL",
        "category": "database",
        "tier": "easy",
        "description": "Connect to a MySQL or MariaDB database",
        "auth_type": "credentials",
        "available": True,
    },
    {
        "id": "google_sheets",
        "label": "Google Sheets",
        "category": "saas",
        "tier": "medium",
        "description": "Import data from a Google Sheets spreadsheet",
        "auth_type": "service_account",
        "available": True,
    },
    {
        "id": "airtable",
        "label": "Airtable",
        "category": "saas",
        "tier": "medium",
        "description": "Pull records from an Airtable base",
        "auth_type": "api_key",
        "available": True,
    },
    {
        "id": "notion",
        "label": "Notion",
        "category": "saas",
        "tier": "medium",
        "description": "Import data from a Notion database",
        "auth_type": "api_key",
        "available": True,
    },
    {
        "id": "hubspot",
        "label": "HubSpot",
        "category": "analytics",
        "tier": "hard",
        "description": "Import CRM objects from HubSpot",
        "auth_type": "api_key",
        "available": True,
    },
    {
        "id": "google_analytics",
        "label": "Google Analytics 4",
        "category": "analytics",
        "tier": "hard",
        "description": "Pull reports from a GA4 property",
        "auth_type": "service_account",
        "available": True,
    },
]


def get_connector(name: str) -> BaseConnector:
    """Instantiate and return a connector by ID."""
    if name not in REGISTRY:
        raise ValueError(f"Unknown connector: '{name}'. Available: {list(REGISTRY.keys())}")
    return REGISTRY[name]()


def get_catalog() -> list[dict]:
    return CONNECTOR_CATALOG
