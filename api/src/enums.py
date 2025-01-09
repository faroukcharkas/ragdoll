# builtin
from enum import Enum

# external

# internal


class CoreMessageRole(str, Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class SplitType(str, Enum):
    SEMANTIC = "semantic"
    SENTENCE = "sentence"


class MetadataSchemaFieldType(str, Enum):
    CUSTOM_TEXT = "CUSTOM_TEXT"
    ORDER_IN_DOCUMENT = "ORDER_IN_DOCUMENT"
    PREVIOUS_CHUNK_TEXT = "PREVIOUS_CHUNK_TEXT"
    NEXT_CHUNK_TEXT = "NEXT_CHUNK_TEXT"
    CURRENT_CHUNK_TEXT = "CURRENT_CHUNK_TEXT"
