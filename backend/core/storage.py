import json
import os
from pathlib import Path
from typing import Optional

import pandas as pd

from core.models import NormalizedDataset, DatasetSummary

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "uploads" / "raw"
NORMALIZED_DIR = BASE_DIR / "uploads" / "normalized"

RAW_DIR.mkdir(parents=True, exist_ok=True)
NORMALIZED_DIR.mkdir(parents=True, exist_ok=True)


def save_raw(df: pd.DataFrame, dataset_id: str) -> Path:
    """Save raw DataFrame as CSV to uploads/raw/."""
    path = RAW_DIR / f"{dataset_id}.csv"
    df.to_csv(path, index=False)
    return path


def save_normalized(dataset: NormalizedDataset) -> Path:
    """Save normalized dataset as JSON to uploads/normalized/."""
    path = NORMALIZED_DIR / f"{dataset.meta.dataset_id}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(dataset.model_dump(), f, ensure_ascii=False, indent=2)
    return path


def load_normalized(dataset_id: str) -> Optional[NormalizedDataset]:
    """Load a normalized dataset from disk. Returns None if not found."""
    path = NORMALIZED_DIR / f"{dataset_id}.json"
    if not path.exists():
        return None
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return NormalizedDataset(**data)


def list_datasets() -> list[DatasetSummary]:
    """List all saved datasets from normalized/."""
    summaries = []
    for path in sorted(NORMALIZED_DIR.glob("*.json"), key=os.path.getmtime, reverse=True):
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            meta = data.get("meta", {})
            summaries.append(DatasetSummary(
                dataset_id=meta["dataset_id"],
                connector=meta["connector"],
                source=meta["source"],
                imported_at=meta["imported_at"],
                row_count_stored=meta["row_count_stored"],
                column_count=meta["column_count"],
                truncated=meta["truncated"],
            ))
        except Exception:
            continue  # skip corrupted files silently
    return summaries


def delete_dataset(dataset_id: str) -> bool:
    """Delete raw CSV and normalized JSON. Returns True if anything was deleted."""
    deleted = False
    raw_path = RAW_DIR / f"{dataset_id}.csv"
    norm_path = NORMALIZED_DIR / f"{dataset_id}.json"
    for path in [raw_path, norm_path]:
        if path.exists():
            path.unlink()
            deleted = True
    return deleted


def dataset_exists(dataset_id: str) -> bool:
    return (NORMALIZED_DIR / f"{dataset_id}.json").exists()
