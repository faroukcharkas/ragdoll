# builtin

# external
from fastapi import APIRouter, Request
from pinecone import Pinecone, Vector

# internal
from .io import CreateDocumentInput, DocumentInput
from src.modules.chunking.module import ChunkingModule
from src.models import ChunkMetadata, ChunkVector
from src.database.client import DatabaseClient
from src.database.tables.document import Document
from src.database.tables.chunk import Chunk
from src.database.tables.project import Project

document_router = APIRouter(prefix="/document")


# TODO: This is a temporary function
def upsert_chunk_vectors(
    chunk_vectors: list[ChunkVector], pinecone_api_key: str, index_name: str
):
    # 1. Create a new Pinecone client
    pinecone_client = Pinecone(api_key=pinecone_api_key)
    # 2. Connect to the index
    index = pinecone_client.Index(name=index_name)
    # 3. Create the vectors
    vectors_to_upsert: list[Vector] = [
        Vector(
            id=chunk_vector.id,
            values=chunk_vector.vector,
            metadata=chunk_vector.metadata.model_dump(),
        )
        for chunk_vector in chunk_vectors
    ]
    index.upsert(vectors_to_upsert)


def delete_chunk_vectors(
    chunks: list[Chunk],
    pinecone_api_key: str,
    index_name: str,
):
    ids_to_delete: list[str] = [chunk.id for chunk in chunks]
    if len(ids_to_delete) > 0:
        pinecone_client: Pinecone = Pinecone(api_key=pinecone_api_key)
        index = pinecone_client.Index(name=index_name)
        index.delete(ids=ids_to_delete)


@document_router.post("/create")
async def create(request: Request, input: CreateDocumentInput):
    database_client: DatabaseClient = request.app.state.database_client
    chunking_module: ChunkingModule = request.app.state.chunking_module

    # 1. Read the document and project
    document: Document = await database_client.Document.read_using_id(
        id=input.document_id
    )
    project: Project = await database_client.Project.read_using_id(
        id=document.project_id
    )

    # 2. Chunk the document
    chunks: list[ChunkMetadata] = await chunking_module.split(document=document)
    vectors: list[ChunkVector] = await chunking_module.embed(chunks=chunks)

    # 3. Create the chunks in the database
    await database_client.Chunk.create_using_vectors(
        chunk_vectors=vectors, document_id=input.document_id
    )

    # 4. Upsert the vectors to Pinecone
    upsert_chunk_vectors(
        chunk_vectors=vectors,
        pinecone_api_key=project.pinecone_api_key,
        index_name=project.index_name,
    )

    # TODO: Stream progress
    return {"success": True}


@document_router.post("/delete")
async def delete(request: Request, input: DocumentInput):
    database_client: DatabaseClient = request.app.state.database_client

    # 1. Read the document and project
    document: Document = await database_client.Document.read_using_id(
        id=input.document_id
    )
    project: Project = await database_client.Project.read_using_id(
        id=document.project_id
    )

    # 2. Read the chunks
    chunks: list[Chunk] = await database_client.Chunk.read_using_document_id(
        document_id=input.document_id
    )

    # 3. Delete the document and chunks
    await database_client.Document.delete_using_id(id=input.document_id)
    await database_client.Chunk.delete_using_document_id(document_id=input.document_id)

    # 4. Delete the vectors
    delete_chunk_vectors(
        chunks=chunks,
        pinecone_api_key=project.pinecone_api_key,
        index_name=project.index_name,
    )

    # TODO: Stream progress
    return {"success": True}
