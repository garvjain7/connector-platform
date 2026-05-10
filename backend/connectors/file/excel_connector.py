from typing import Any
import pandas as pd
from io import BytesIO

from connectors.base import BaseConnector


class ExcelConnector(BaseConnector):
    """
    Accepts an Excel file as raw bytes.
    validate() returns list of sheet names as sources.
    fetch()    reads the selected sheet.
    config keys: { "file_bytes": bytes, "filename": str }
    source: sheet name
    """

    def validate(self, config: dict[str, Any]) -> dict:
        try:
            file_bytes: bytes = config["file_bytes"]
            xl = pd.ExcelFile(BytesIO(file_bytes))
            sources = [
                {
                    "id": sheet,
                    "label": sheet,
                    "meta": {},
                }
                for sheet in xl.sheet_names
            ]
            return {
                "status": "ok",
                "sources": sources,
                "message": f"Found {len(sources)} sheet(s)",
            }
        except Exception as e:
            return {"status": "error", "sources": [], "message": str(e)}

    def fetch(self, config: dict[str, Any], source: str) -> pd.DataFrame:
        file_bytes: bytes = config["file_bytes"]
        return pd.read_excel(BytesIO(file_bytes), sheet_name=source)
