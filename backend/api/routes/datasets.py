from fastapi import APIRouter, HTTPException
from core import storage

router = APIRouter(prefix="/api/datasets", tags=["datasets"])

PREVIEW_ROW_LIMIT = 100


@router.get("")
def list_datasets():
    """List all saved datasets."""
    return storage.list_datasets()


@router.get("/{dataset_id}")
def get_dataset(dataset_id: str):
    """
    Return normalized dataset for preview.
    Returns all stored rows (up to 10k) for frontend pagination.
    """
    dataset = storage.load_normalized(dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")

    return dataset.model_dump()


@router.get("/{dataset_id}/download")
def download_dataset(dataset_id: str):
    """Return full normalized dataset (up to 10k rows)."""
    dataset = storage.load_normalized(dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")
    return dataset.model_dump()


@router.delete("/{dataset_id}")
def delete_dataset(dataset_id: str):
    """Delete raw CSV and normalized JSON."""
    deleted = storage.delete_dataset(dataset_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")
    return {"status": "deleted", "dataset_id": dataset_id}
