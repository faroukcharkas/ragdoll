# builtin
from typing import Optional

# external
from supabase import AsyncClient
from pydantic import BaseModel

# internal


class Document(BaseModel):
    id: int
    title: str
    body: str
    project_id: int
    metadata_schema_id: int


class DocumentTable:
    def __init__(self, supabase_client: AsyncClient):
        self.supabase_client = supabase_client
        self.table = self.supabase_client.table("document")

    async def read_using_id(self, id: int) -> Document:
        response = await self.table.select("*").eq("id", id).execute()
        return Document(**response.data[0])

    async def read_using_project_id(self, project_id: int) -> list[Document]:
        response = await self.table.select("*").eq("project_id", project_id).execute()
        return [Document(**data) for data in response.data]

    async def delete_using_id(self, id: int) -> None:
        await self.table.delete().eq("id", id).execute()
