# builtin

# external
from pydantic import BaseModel
from typing import Optional
# internal


class ChunkMetadata(BaseModel):
    pre_context: str
    text: str
    post_context: str
    source_url: Optional[str]
    source_description: Optional[str]
    order: int


class ChunkVector(BaseModel):
    id: str
    metadata: ChunkMetadata
    vector: list
