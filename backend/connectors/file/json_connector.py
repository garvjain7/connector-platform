from typing import Any
import pandas as pd
import requests

from connectors.base import BaseConnector


class JSONConnector(BaseConnector):
    """
    Fetches JSON from a public URL and normalizes to DataFrame.
    Handles: array of objects, { "data": [...] }, { "results": [...] }
    config keys: { "url": str, "json_path": str (optional) }
    source: "default"
    """

    def _fetch_json(self, url: str) -> Any:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        return resp.json()

    def _json_to_df(self, data: Any, json_path: str = "") -> pd.DataFrame:
        # If user specified a dot-path like "data.records", traverse it
        if json_path:
            for key in json_path.split("."):
                if isinstance(data, dict):
                    data = data[key]

        # Auto-detect common wrapper keys
        if isinstance(data, dict):
            for key in ["data", "results", "items", "records", "rows", "values"]:
                if key in data and isinstance(data[key], list):
                    data = data[key]
                    break

        if isinstance(data, list):
            return pd.DataFrame(data)

        # Single object — wrap in list
        if isinstance(data, dict):
            return pd.DataFrame([data])

        raise ValueError(f"Cannot convert JSON structure to tabular data. Got type: {type(data)}")

    def validate(self, config: dict[str, Any]) -> dict:
        try:
            url = config["url"]
            json_path = config.get("json_path", "")
            data = self._fetch_json(url)
            df = self._json_to_df(data, json_path)
            return {
                "status": "ok",
                "sources": [
                    {
                        "id": "default",
                        "label": url,
                        "meta": {
                            "preview_columns": list(df.columns),
                            "estimated_rows": len(df),
                        },
                    }
                ],
                "message": f"Endpoint reachable. Found {len(df.columns)} columns, {len(df)} rows",
            }
        except Exception as e:
            return {"status": "error", "sources": [], "message": str(e)}

    def fetch(self, config: dict[str, Any], source: str) -> pd.DataFrame:
        url = config["url"]
        json_path = config.get("json_path", "")
        data = self._fetch_json(url)
        return self._json_to_df(data, json_path)
