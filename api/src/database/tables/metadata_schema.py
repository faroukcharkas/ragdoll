# builtin
from enum import Enum

# external
from pydantic import BaseModel
from supabase import AsyncClient

# internal

class MetadataSchemaFieldType(str, Enum):
    CUSTOM_TEXT = "CUSTOM_TEXT"
    ORDER_IN_DOCUMENT = "ORDER_IN_DOCUMENT"
    PREVIOUS_CHUNK_TEXT = "PREVIOUS_CHUNK_TEXT"
    NEXT_CHUNK_TEXT = "NEXT_CHUNK_TEXT"
    CURRENT_CHUNK_TEXT = "CURRENT_CHUNK_TEXT"

class MetadataSchemaField(BaseModel):
    name: str
    value: MetadataSchemaFieldType

class MetadataSchema(BaseModel):
    id: int
    name: str
    fields: list[MetadataSchemaField]

class MetadataSchemaTable:
    def __init__(self, supabase_client: AsyncClient):
        self.supabase_client = supabase_client
        self.table = self.supabase_client.table("metadata_schema")

    async def read_using_id(self, id: int) -> MetadataSchema:
        print(f"Reading metadata schema with id {id}")
        response = await self.table.select("id, name, fields").eq("id", id).execute()
        return MetadataSchema(
            id=response.data[0]["id"],
            name=response.data[0]["name"],
            fields=[
                MetadataSchemaField(**field)
                for field in response.data[0]["fields"]
            ],
        )
