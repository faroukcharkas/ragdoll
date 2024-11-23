# builtin
from uuid import uuid4

# external
from tokenizers import Tokenizer
from semantic_text_splitter import TextSplitter

# internal
from src.models import ChunkMetadata, ChunkVector
from src.providers.ai.async_openai import AsyncOpenAIProvider
from src.database.tables.document import Document
from src.enums import SplitType


class ChunkingModule:
    def __init__(self, async_openai: AsyncOpenAIProvider):
        self.async_openai = async_openai

    async def split(
        self, document: Document, split_type: SplitType
    ) -> list[ChunkMetadata]:
        # 1. Split the document into chunks
        tokenizer = Tokenizer.from_pretrained("bert-base-uncased")
        splitter = TextSplitter.from_huggingface_tokenizer(tokenizer, 200)
        chunks: list[str]
        if split_type == SplitType.SENTENCE:
            chunks: list[str] = document.body.split(".")
        else:
            # Semantic splitting is the default
            chunks: list[str] = splitter.chunks(document.body)
        # 2. Create metadata for each chunk
        split_result: list[ChunkMetadata] = []
        chunk: str
        for i, chunk in enumerate(chunks):
            before: str = chunks[i - 1] if i > 0 else ""
            after: str = chunks[i + 1] if i < len(chunks) - 1 else ""
            metadata: ChunkMetadata = ChunkMetadata(
                pre_context=before,
                text=chunk,
                post_context=after,
                source_url=document.url,
                source_description=document.description,
                order=i,
            )
            split_result.append(metadata)
        # 3. Return the metadata
        return split_result

    async def embed(self, chunks: list[ChunkMetadata]) -> list[ChunkVector]:
        # 1. Prepare bulk embedding
        texts_to_embed: list[str] = [chunk.text for chunk in chunks]
        # 2. Embed the texts
        embeddings: list[list[float]] = await self.async_openai.embed(texts_to_embed)
        # 3. Return the vectors
        chunk_vectors: list[ChunkVector] = []
        for chunk, embedding in zip(chunks, embeddings):
            chunk_id: str = str(uuid4())
            chunk_vector: ChunkVector = ChunkVector(
                id=chunk_id, metadata=chunk, vector=embedding
            )
            chunk_vectors.append(chunk_vector)
        return chunk_vectors
