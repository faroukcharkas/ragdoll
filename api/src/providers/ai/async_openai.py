# builtin
from enum import Enum

# external
from openai import AsyncOpenAI
from pydantic import BaseModel, Field

# internal
from src.types.ai import CoreMessage


class SelectFromStringOptionsParams(BaseModel):
    llm_model_name: str
    messages: list[CoreMessage]
    options: list[str]


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

    async def select_from_enum_options(
        self, params: SelectFromStringOptionsParams
    ) -> Enum:
        # Sort options shortest to longest while making a copy
        sorted_options: list[str] = sorted(params.options, key=lambda x: len(x))

        # Create a dynamic Enum from the options
        OptionsEnum = Enum(
            "OptionsEnum",
            {option: option for option in sorted_options},
            type=str,
        )

        # Create a Pydantic model using the Enum
        class EnumSelectionResponseFormat(BaseModel):
            selected_option: OptionsEnum = Field(alias="selectedOption")  # type: ignore

        response = await self.client.beta.chat.completions.parse(
            model=params.llm_model_name,
            messages=params.messages,
            response_format=EnumSelectionResponseFormat,
        )
        return response.choices[0].message.parsed.selected_option
