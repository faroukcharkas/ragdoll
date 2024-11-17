# builtin
from contextlib import asynccontextmanager
from asyncio import create_task

# external
from fastapi import FastAPI, Request
from pydantic import BaseModel
from semantic_text_splitter import TextSplitter
from supabase import AsyncClient
from tokenizers import Tokenizer

# internal
from api.src.globals.environment import Environment
from api.src.api.document.routes import document_router
from api.src.modules.chunking.module import ChunkingModule
from api.src.providers.ai.async_openai import AsyncOpenAIProvider
from api.src.database.client import DatabaseClient


def setup_globals(app: FastAPI):
    environment = Environment()
    app.state.environment = environment


def setup_database(app: FastAPI):
    environment: Environment = app.state.environment
    database_client = DatabaseClient(
        url=environment.SUPABASE_URL, key=environment.SUPABASE_KEY
    )
    app.state.database_client = database_client


def setup_providers(app: FastAPI):
    environment: Environment = app.state.environment
    async_openai: AsyncOpenAIProvider = AsyncOpenAIProvider(
        api_key=environment.OPENAI_API_KEY
    )
    app.state.async_openai = async_openai


def setup_modules(app: FastAPI):
    async_openai: AsyncOpenAIProvider = app.state.async_openai
    chunking_module: ChunkingModule = ChunkingModule(async_openai=async_openai)
    app.state.chunking_module = chunking_module


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_globals(app=app)
    setup_database(app=app)
    setup_providers(app=app)
    setup_modules(app=app)
    yield


app: FastAPI = FastAPI(lifespan=lifespan)


class Document(BaseModel):
    id: int
    title: str
    body: str


async def get_document(supabase_client: AsyncClient, document_id: int) -> Document:
    assert isinstance(document_id, int), "document_id must be an integer"

    document = (
        await supabase_client.table("document")
        .select("*")
        .eq("id", document_id)
        .execute()
    )
    return Document(
        id=document.data[0]["id"],
        title=document.data[0]["title"],
        body=document.data[0]["body"],
    )


async def split_document(document_text: str):
    assert isinstance(document_text, str), "document_text must be a string"
    tokenizer = Tokenizer.from_pretrained("bert-base-uncased")
    splitter = TextSplitter.from_huggingface_tokenizer(tokenizer, 200)
    chunks: list[str] = splitter.chunks(document_text)
    return chunks


async def handle_document_chunking(supabase_client: AsyncClient, document_id: int):
    assert isinstance(document_id, int), "document_id must be an integer"
    document: Document = await get_document(supabase_client, document_id)
    chunks: list[str] = await split_document(document.body)
    for chunk in chunks:
        await (
            supabase_client.table("chunk")
            .insert({"document_id": document_id, "content": chunk, "metadata": {}})
            .execute()
        )
    return chunks


app.include_router(document_router)
