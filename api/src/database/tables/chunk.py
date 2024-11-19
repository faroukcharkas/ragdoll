# builtin
from datetime import datetime

# external
from pydantic import BaseModel
from supabase import AsyncClient

# internal
from api.src.models import ChunkVector


class Chunk(BaseModel):
    id: str
    created_at: datetime
    document_id: int
    content: str
    metadata: dict


class CreateChunkInput(BaseModel):
    id: str
    document_id: int
    content: str
    metadata: dict


class ChunkTable:
    def __init__(self, supabase_client: AsyncClient):
        self.supabase_client = supabase_client
        self.table = self.supabase_client.table("chunk")

    async def create_using_vectors(
        self, chunk_vectors: list[ChunkVector], document_id: int
    ) -> None:
        assert len(chunk_vectors) > 0, "Chunk vectors must not be empty"
        assert isinstance(document_id, int), "Document ID must be an integer"
        chunks_to_insert: list[dict] = []
        for chunk_vector in chunk_vectors:
            chunks_to_insert.append(
                CreateChunkInput(
                    id=chunk_vector.id,
                    document_id=document_id,
                    content=chunk_vector.metadata.text,
                    metadata=chunk_vector.metadata.model_dump(),
                ).model_dump()
            )
        await self.table.insert(chunks_to_insert).execute()

    async def read_using_document_id(self, document_id: int) -> list[Chunk]:
        response = await self.table.select("*").eq("document_id", document_id).execute()
        return [Chunk(**chunk) for chunk in response.data]

    async def delete_using_document_id(self, document_id: int) -> None:
        await self.table.delete().eq("document_id", document_id).execute()
