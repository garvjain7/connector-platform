from abc import ABC, abstractmethod
from typing import Any
import pandas as pd


class BaseConnector(ABC):
    """
    Every connector must implement validate() and fetch().

    validate() — cheap operation: test credentials, return available sources.
    fetch()    — heavier operation: pull data, return raw DataFrame.

    The connector is ONLY responsible for authentication and data retrieval.
    Normalization and storage happen outside the connector in the ingest pipeline.
    """

    @abstractmethod
    def validate(self, config: dict[str, Any]) -> dict:
        """
        Test the connection and return available sources.

        Returns:
            {
                "status": "ok" | "error",
                "sources": [
                    { "id": "public.orders", "label": "orders", "meta": {} }
                ],
                "message": ""
            }
        """
        pass

    @abstractmethod
    def fetch(self, config: dict[str, Any], source: str) -> pd.DataFrame:
        """
        Fetch data from the source and return a raw pandas DataFrame.

        Args:
            config: connector-specific credentials/config
            source: the source identifier returned by validate()

        Returns:
            pd.DataFrame with the raw data
        """
        pass

    @property
    def connector_id(self) -> str:
        return self.__class__.__name__.lower().replace("connector", "")
