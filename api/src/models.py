# builtin

# external
from pydantic import BaseModel
from typing import Optional

# internal

class Chunk(BaseModel):
    metadata: dict
    text: str

class ChunkVector(BaseModel):
    id: str
    chunk: Chunk
    vector: list
