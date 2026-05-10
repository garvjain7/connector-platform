from typing import Any
import pandas as pd

from connectors.base import BaseConnector


class MySQLConnector(BaseConnector):
    """
    Connects to a MySQL or MariaDB database.
    validate() returns list of tables in the connected database.
    fetch()    runs SELECT * FROM table.
    config keys: { host, port, database, username, password }
    source: "table_name"
    """

    def _get_conn(self, config: dict[str, Any]):
        try:
            import pymysql
        except ImportError:
            raise RuntimeError("pymysql is not installed")

        return pymysql.connect(
            host=config["host"],
            port=int(config.get("port", 3306)),
            db=config["database"],
            user=config["username"],
            password=config["password"],
            connect_timeout=10,
            cursorclass=pymysql.cursors.DictCursor,
        )

    def validate(self, config: dict[str, Any]) -> dict:
        try:
            conn = self._get_conn(config)
            with conn.cursor() as cur:
                cur.execute("SHOW TABLES")
                rows = cur.fetchall()
            conn.close()

            key = list(rows[0].keys())[0] if rows else None
            sources = [
                {
                    "id": row[key],
                    "label": row[key],
                    "meta": {"database": config["database"]},
                }
                for row in rows
            ] if key else []

            return {
                "status": "ok",
                "sources": sources,
                "message": f"Connected. Found {len(sources)} table(s)",
            }
        except Exception as e:
            return {"status": "error", "sources": [], "message": str(e)}

    def fetch(self, config: dict[str, Any], source: str) -> pd.DataFrame:
        conn = self._get_conn(config)
        try:
            df = pd.read_sql(f"SELECT * FROM `{source}`", conn)
        finally:
            conn.close()
        return df
