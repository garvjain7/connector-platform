from fastapi import APIRouter
from connectors.manager import get_catalog

router = APIRouter(prefix="/api/connectors", tags=["connectors"])


@router.get("")
def list_connectors():
    """Return full connector catalog for the frontend gallery."""
    return get_catalog()
