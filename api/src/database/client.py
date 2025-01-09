# builtin

# external
from supabase import AsyncClient

# internal
from .tables.document import DocumentTable
from .tables.chunk import ChunkTable
from .tables.project import ProjectTable
from .tables.metadata_schema import MetadataSchemaTable
from .tables.api_key import ApiKeyTable


class DatabaseClient:
    def __init__(self, url: str, key: str):
        self.supabase_client = AsyncClient(url, key)
        self.Document = DocumentTable(supabase_client=self.supabase_client)
        self.Chunk = ChunkTable(supabase_client=self.supabase_client)
        self.Project = ProjectTable(supabase_client=self.supabase_client)
        self.MetadataSchema = MetadataSchemaTable(supabase_client=self.supabase_client)
        self.ApiKey = ApiKeyTable(supabase_client=self.supabase_client)
