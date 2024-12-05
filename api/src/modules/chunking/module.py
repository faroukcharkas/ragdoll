# builtin
from uuid import uuid4

# external
from tokenizers import Tokenizer
from semantic_text_splitter import TextSplitter

# internal
from src.models import ChunkVector, Chunk
from src.providers.ai.async_openai import AsyncOpenAIProvider
from src.database.tables.document import Document
from src.database.tables.metadata_schema import MetadataSchema, MetadataSchemaFieldType
from src.enums import SplitType


class ChunkingModule:
    def __init__(self, async_openai: AsyncOpenAIProvider):
        self.async_openai = async_openai

    def build_metadata(self, metadata_schema: MetadataSchema, text_payload: dict[str, str], order: int, previous_chunk: str, next_chunk: str, current_chunk: str) -> dict:
        metadata: dict = {}
        print("Building metadata")
        print(metadata_schema.fields)
        for field in metadata_schema.fields:
            if field.value == MetadataSchemaFieldType.CUSTOM_TEXT:
                metadata[field.name] = text_payload[field.name]
            elif field.value == MetadataSchemaFieldType.ORDER_IN_DOCUMENT:
                metadata[field.name] = order
            elif field.value == MetadataSchemaFieldType.PREVIOUS_CHUNK_TEXT:
                metadata[field.name] = previous_chunk
            elif field.value == MetadataSchemaFieldType.NEXT_CHUNK_TEXT:
                metadata[field.name] = next_chunk
            elif field.value == MetadataSchemaFieldType.CURRENT_CHUNK_TEXT:
                metadata[field.name] = current_chunk
        return metadata

    # TODO: I don't like how I'm doing text_payload. It's a bit of a hack.
    async def split(
        self, document: Document, split_type: SplitType, metadata_schema: MetadataSchema, text_payload: dict[str, str]
    ) -> list[Chunk]:
        # 1. Initialize the tokenizer and splitter
        tokenizer = Tokenizer.from_pretrained("bert-base-uncased")
        splitter = TextSplitter.from_huggingface_tokenizer(tokenizer, 200)

        # 2. Split the document into chunks
        chunks: list[str]
        if split_type == SplitType.SENTENCE:
            chunks: list[str] = document.body.split(".")
        else:
            # Semantic splitting is the default
            chunks: list[str] = splitter.chunks(document.body)

        # 3. Build the metadata
        split_result: list[Chunk] = []

        # 4. Create metadata for each chunk
        chunk: str
        for i, chunk in enumerate(chunks):
            before: str = chunks[i - 1] if i > 0 else ""
            after: str = chunks[i + 1] if i < len(chunks) - 1 else ""
            metadata: dict = self.build_metadata(
                metadata_schema=metadata_schema,
                text_payload=text_payload,
                order=i,
                previous_chunk=before,
                next_chunk=after,
                current_chunk=chunk,
            )
            split_result.append(Chunk(metadata=metadata, text=chunk))

        # 5. Return the metadata
        return split_result

    async def embed(self, chunks: list[Chunk]) -> list[ChunkVector]:
        # 1. Prepare bulk embedding
        texts_to_embed: list[str] = [chunk.text for chunk in chunks]

        # 2. Embed the texts
        embeddings: list[list[float]] = await self.async_openai.embed(texts_to_embed)

        # 3. Return the vectors
        chunk_vectors: list[ChunkVector] = []
        for chunk, embedding in zip(chunks, embeddings):
            chunk_id: str = str(uuid4())
            chunk_vector: ChunkVector = ChunkVector(
                id=chunk_id, chunk=chunk, vector=embedding
            )
            chunk_vectors.append(chunk_vector)
        return chunk_vectors
