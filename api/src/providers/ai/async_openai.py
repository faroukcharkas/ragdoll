# builtin

# external
from openai import AsyncOpenAI

# internal


class AsyncOpenAIProvider:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)

    async def embed(self, texts: list[str]) -> list[list[float]]:
        filtered_texts = [text for text in texts if len(text.strip()) > 0]
        print(f"Embedding {len(filtered_texts)} texts")
        print(filtered_texts)
        response = await self.client.embeddings.create(
            input=filtered_texts, model="text-embedding-ada-002"
        )
        return [embedding.embedding for embedding in response.data]
