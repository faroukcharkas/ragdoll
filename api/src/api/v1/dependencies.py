# builtin
import hashlib

# external
from fastapi import Depends, Request, HTTPException

# internal
from src.database.client import DatabaseClient


async def require_valid_api_key(request: Request):
    database_client: DatabaseClient = request.app.state.database_client

    if "x-api-key" not in request.headers:
        raise HTTPException(status_code=401, detail="No API key in header")

    api_key: str = request.headers.get("x-api-key")
    project_id: int | None = await database_client.ApiKey.read_project_id_using_hash(
        hashlib.sha256(api_key.encode()).hexdigest()
    )
    if project_id is None:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return project_id


RequireValidAPIKey = Depends(require_valid_api_key)
