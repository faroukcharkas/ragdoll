# builtin

# external
from pydantic import BaseModel

# internal
from src.enums import CoreMessageRole


class CoreMessage(BaseModel):
    role: CoreMessageRole
    content: str
