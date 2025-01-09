# builtin

# external
from pydantic import BaseModel

# internal
from src.database.tables.document import Document
from src.types.ai import CoreMessage


class GetRelevantDocumentInput(BaseModel):
    messages: list[CoreMessage]


class GetRelevantDocumentOutput(BaseModel):
    document: Document | None
