from typing import Any
import pandas as pd

from connectors.base import BaseConnector


class PostgreSQLConnector(BaseConnector):
    """
    Connects to a PostgreSQL database.
    validate() returns list of schema.table as sources.
    fetch()    runs SELECT * FROM schema.table.
    config keys: { host, port, database, username, password }
    source: "schema.table"
    """

    def _get_engine(self, config: dict[str, Any]):
        try:
            import psycopg2
        except ImportError:
            raise RuntimeError("psycopg2-binary is not installed")

        return psycopg2.connect(
            host=config["host"],
            port=int(config.get("port", 5432)),
            dbname=config["database"],
            user=config["username"],
            password=config["password"],
            connect_timeout=10,
        )

    def validate(self, config: dict[str, Any]) -> dict:
        try:
            conn = self._get_engine(config)
            cur = conn.cursor()
            cur.execute("""
                SELECT table_schema, table_name
                FROM information_schema.tables
                WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
                  AND table_type = 'BASE TABLE'
                ORDER BY table_schema, table_name
            """)
            rows = cur.fetchall()
            cur.close()
            conn.close()

            sources = [
                {
                    "id": f"{schema}.{table}",
                    "label": table,
                    "meta": {"schema": schema},
                }
                for schema, table in rows
            ]
            return {
                "status": "ok",
                "sources": sources,
                "message": f"Connected. Found {len(sources)} table(s)",
            }
        except Exception as e:
            return {"status": "error", "sources": [], "message": str(e)}

    def fetch(self, config: dict[str, Any], source: str) -> pd.DataFrame:
        conn = self._get_engine(config)
        try:
            # source is "schema.table" — safe identifier, not user SQL input
            safe_source = source.replace(".", '"."')
            df = pd.read_sql(f'SELECT * FROM "{safe_source}"', conn)
        finally:
            conn.close()
        return df
