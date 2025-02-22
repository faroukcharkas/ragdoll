# builtin

# external
from pydantic import BaseModel

# internal
from src.enums import SplitType


class DocumentInput(BaseModel):
    document_id: int


class CreateDocumentInput(DocumentInput):
    split_type: SplitType
    metadata_schema_id: int
    schema_payload: dict
