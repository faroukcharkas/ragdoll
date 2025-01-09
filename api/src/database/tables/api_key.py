# builtin
from datetime import datetime

# external
from pydantic import BaseModel
from supabase import AsyncClient

# internal


class ApiKey(BaseModel):
    id: str
    created_at: datetime
    hash: str
    project_id: int
    preview: str
    name: str


class ApiKeyTable:
    def __init__(self, supabase_client: AsyncClient):
        self.supabase_client = supabase_client
        self.table = self.supabase_client.table("api_key")

    async def read_project_id_using_hash(self, hash: str) -> int | None:
        assert isinstance(hash, str), "Hash must be a string"

        response = await self.table.select("project_id").eq("hash", hash).execute()
        if len(response.data) == 0:
            return None
        return int(response.data[0]["project_id"])
