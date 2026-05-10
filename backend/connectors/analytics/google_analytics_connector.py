from typing import Any
import pandas as pd

from connectors.base import BaseConnector

# Preset GA4 report definitions exposed to the user
GA4_REPORTS = [
    {
        "id": "sessions_by_date",
        "label": "Sessions by Date",
        "dimensions": ["date"],
        "metrics": ["sessions", "totalUsers", "newUsers"],
    },
    {
        "id": "traffic_by_source",
        "label": "Traffic by Source / Medium",
        "dimensions": ["sessionSource", "sessionMedium"],
        "metrics": ["sessions", "totalUsers", "bounceRate"],
    },
    {
        "id": "top_pages",
        "label": "Top Pages",
        "dimensions": ["pagePath", "pageTitle"],
        "metrics": ["screenPageViews", "averageSessionDuration"],
    },
    {
        "id": "conversions_by_event",
        "label": "Conversions by Event",
        "dimensions": ["eventName"],
        "metrics": ["eventCount", "conversions"],
    },
    {
        "id": "users_by_country",
        "label": "Users by Country",
        "dimensions": ["country"],
        "metrics": ["totalUsers", "sessions"],
    },
]


class GoogleAnalyticsConnector(BaseConnector):
    """
    Connects to Google Analytics 4 via a Service Account.
    validate() returns list of preset report types.
    fetch()    runs the selected report for the last 90 days.
    config keys: {
        "property_id": str,               e.g. "properties/123456789"
        "service_account_json": dict      parsed JSON from uploaded .json file
    }
    source: report id string
    """

    def _get_client(self, service_account_json: dict):
        try:
            from google.analytics.data_v1beta import BetaAnalyticsDataClient
            from google.oauth2.service_account import Credentials
        except ImportError:
            raise RuntimeError("google-analytics-data and google-auth are not installed")

        creds = Credentials.from_service_account_info(
            service_account_json,
            scopes=["https://www.googleapis.com/auth/analytics.readonly"],
        )
        return BetaAnalyticsDataClient(credentials=creds)

    def validate(self, config: dict[str, Any]) -> dict:
        try:
            client = self._get_client(config["service_account_json"])
            property_id = config["property_id"]

            # Light ping — run a minimal request to confirm access
            from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Metric
            req = RunReportRequest(
                property=property_id,
                date_ranges=[DateRange(start_date="yesterday", end_date="yesterday")],
                metrics=[Metric(name="sessions")],
            )
            client.run_report(req)

            sources = [
                {
                    "id": r["id"],
                    "label": r["label"],
                    "meta": {
                        "dimensions": r["dimensions"],
                        "metrics": r["metrics"],
                    },
                }
                for r in GA4_REPORTS
            ]
            return {
                "status": "ok",
                "sources": sources,
                "message": f"Connected to {property_id}. {len(sources)} preset reports available",
            }
        except Exception as e:
            return {"status": "error", "sources": [], "message": str(e)}

    def fetch(self, config: dict[str, Any], source: str) -> pd.DataFrame:
        from google.analytics.data_v1beta.types import (
            RunReportRequest, DateRange, Dimension, Metric
        )

        report_def = next((r for r in GA4_REPORTS if r["id"] == source), None)
        if not report_def:
            raise ValueError(f"Unknown GA4 report: {source}")

        client = self._get_client(config["service_account_json"])
        property_id = config["property_id"]

        req = RunReportRequest(
            property=property_id,
            date_ranges=[DateRange(start_date="90daysAgo", end_date="today")],
            dimensions=[Dimension(name=d) for d in report_def["dimensions"]],
            metrics=[Metric(name=m) for m in report_def["metrics"]],
            limit=10000,
        )
        response = client.run_report(req)

        rows = []
        for row in response.rows:
            record = {}
            for i, dim in enumerate(report_def["dimensions"]):
                record[dim] = row.dimension_values[i].value
            for i, met in enumerate(report_def["metrics"]):
                record[met] = row.metric_values[i].value
            rows.append(record)

        return pd.DataFrame(rows)
