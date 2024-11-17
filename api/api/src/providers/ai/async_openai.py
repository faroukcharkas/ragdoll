# builtin

# external
from openai import AsyncOpenAI

# internal


class AsyncOpenAIProvider:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)

    async def embed(self, texts: list[str]) -> list[list[float]]:
        response = await self.client.embeddings.create(input=texts)
        return [embedding.embedding for embedding in response.data]
