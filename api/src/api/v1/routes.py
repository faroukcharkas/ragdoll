# builtin
from datetime import datetime

# external
from fastapi import APIRouter, Request

# internal
from src.database.tables.document import Document
from src.database.client import DatabaseClient
from src.api.v1.io import GetRelevantDocumentInput, GetRelevantDocumentOutput
from src.api.v1.dependencies import RequireValidAPIKey
from src.providers.ai.async_openai import (
    AsyncOpenAIProvider,
    SelectFromStringOptionsParams,
)
from src.types.ai import CoreMessage

v1_router = APIRouter(prefix="/v1")


@v1_router.post("/get-relevant-document")
async def get_relevant_document(
    request: Request,
    input: GetRelevantDocumentInput,
    project_id: int = RequireValidAPIKey,
):
    database_client: DatabaseClient = request.app.state.database_client
    ai: AsyncOpenAIProvider = request.app.state.ai

    documents: list[Document] = await database_client.Document.read_using_project_id(
        project_id
    )
    document_titles: list[str] = [doc.title for doc in documents]
    document_name: str = await ai.select_from_enum_options(
        SelectFromStringOptionsParams(
            llm_model_name="gpt-4o",
            messages=[
                CoreMessage(
                    role="system",
                    content=f"Select the most relevant document related to the user's question. Keep in mind that today is {datetime.now().strftime('%B %d, %Y')}",
                ),
                CoreMessage(role="user", content=input.user_prompt),
            ],
            options=document_titles,
        )
    )

    document: Document = next(
        (doc for doc in documents if doc.title == document_name), None
    )
    return GetRelevantDocumentOutput(document=document)
