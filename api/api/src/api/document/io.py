# builtin

# external
from pydantic import BaseModel

# internal


class DocumentInput(BaseModel):
    document_id: int
