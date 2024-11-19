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


@app.get("/")
async def root():
    return {"message": "Leave me alone!"}


app.include_router(document_router)
