# builtin

# external
from pydantic import BaseModel

# internal
from src.types.ai import CoreMessage


class GetRelevantDocumentInput(BaseModel):
    messages: list[CoreMessage]
