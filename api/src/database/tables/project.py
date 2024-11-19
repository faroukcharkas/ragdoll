# builtin

# external
from pydantic import BaseModel
from supabase import AsyncClient

# internal


class Project(BaseModel):
    id: int
    name: str
    user_id: str
    pinecone_api_key: str
    index_name: str


class ProjectTable:
    def __init__(self, supabase_client: AsyncClient):
        self.supabase_client = supabase_client
        self.table = self.supabase_client.table("project")

    async def read_using_id(self, id: int) -> Project:
        response = (
            await self.table.select("*").eq("id", id).execute()
        )  # TODO: select specific columns
        return Project(**response.data[0])
