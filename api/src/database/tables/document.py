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
    url: Optional[str] = ""
    project_id: int
    description: Optional[str] = ""


class CreateDocumentInput(BaseModel):
    title: str
    body: str
    url: Optional[str] = ""
    description: Optional[str] = ""


class DocumentTable:
    def __init__(self, supabase_client: AsyncClient):
        self.supabase_client = supabase_client
        self.table = self.supabase_client.table("document")

    async def create(self, document: CreateDocumentInput) -> Document:
        response = await self.table.insert(document.model_dump()).execute()
        return Document(**response.data[0])

    async def read_using_id(self, id: int) -> Document:
        response = await self.table.select("*").eq("id", id).execute()
        return Document(**response.data[0])

    async def delete_using_id(self, id: int) -> None:
        await self.table.delete().eq("id", id).execute()
