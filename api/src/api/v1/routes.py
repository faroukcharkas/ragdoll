# builtin

# external
from fastapi import APIRouter, Request
from pydantic import BaseModel

# internal
from src.database.client import DatabaseClient
from src.api.v1.io import GetRelevantDocumentInput
from src.api.v1.dependencies import RequireValidAPIKey
from src.providers.ai.async_openai import AsyncOpenAIProvider

v1_router = APIRouter(prefix="/v1")


@v1_router.post("/get-relevant-document")
async def get_relevant_document(
    request: Request,
    input: GetRelevantDocumentInput,
    project_id: int = RequireValidAPIKey,
):
    database_client: DatabaseClient = request.app.state.database_client
    ai: AsyncOpenAIProvider = request.app.state.ai
    documents = await database_client.Document.read_using_project_id(project_id)

    # Create enum from document titles
    from enum import Enum

    class DocumentTitles(str, Enum):
        for doc in documents:
            locals()[doc.title.replace(" ", "_")] = doc.title

    class DocumentTitlesResponse(BaseModel):
        titles: DocumentTitles

    return DocumentTitlesResponse(titles=DocumentTitles(documents[0].title))
