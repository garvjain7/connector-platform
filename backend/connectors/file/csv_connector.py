from typing import Any
import pandas as pd
from io import BytesIO

from connectors.base import BaseConnector


class CSVConnector(BaseConnector):
    """
    Accepts a CSV file as raw bytes.
    validate() previews columns.
    fetch()    returns full DataFrame.
    config keys: { "file_bytes": bytes, "filename": str }
    source: "default" (CSV has no sub-source selection)
    """

    def validate(self, config: dict[str, Any]) -> dict:
        try:
            file_bytes: bytes = config["file_bytes"]
            df = pd.read_csv(BytesIO(file_bytes), nrows=5)
            return {
                "status": "ok",
                "sources": [
                    {
                        "id": "default",
                        "label": config.get("filename", "file.csv"),
                        "meta": {
                            "preview_columns": list(df.columns),
                            "preview_rows": len(df),
                        },
                    }
                ],
                "message": f"Found {len(df.columns)} columns",
            }
        except Exception as e:
            return {"status": "error", "sources": [], "message": str(e)}

    def fetch(self, config: dict[str, Any], source: str) -> pd.DataFrame:
        file_bytes: bytes = config["file_bytes"]
        return pd.read_csv(BytesIO(file_bytes))
