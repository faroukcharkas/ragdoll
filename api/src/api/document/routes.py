# builtin

# external
from fastapi import APIRouter, Request, HTTPException
from pinecone import Pinecone, Vector

# internal
from .io import CreateDocumentInput, DocumentInput
from src.modules.chunking.module import ChunkingModule
from src.models import Chunk, ChunkVector
from src.database.client import DatabaseClient
from src.database.tables.document import Document
from src.database.tables.chunk import Chunk
from src.database.tables.project import Project
from src.database.tables.metadata_schema import MetadataSchema, MetadataSchemaFieldType
from src.modules.chunking.module import SplitType
document_router = APIRouter(prefix="/document")

def validate_schema_payload(metadata_schema: MetadataSchema, schema_payload: dict):
    for field in metadata_schema.fields:
        if field.value == MetadataSchemaFieldType.CUSTOM_TEXT:
            if field.name not in schema_payload:
                raise ValueError(f"Missing required field: {field.name}")

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
            metadata=chunk_vector.chunk.metadata,
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
    metadata_schema: MetadataSchema = await database_client.MetadataSchema.read_using_id(
        id=input.metadata_schema_id
    )

    # 2. Validate the schema payload
    try:
        validate_schema_payload(metadata_schema=metadata_schema, schema_payload=input.schema_payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # 3. Create the document in the database
    chunks: list[Chunk] = await chunking_module.split(document=document, text_payload=input.schema_payload, metadata_schema=metadata_schema, split_type=input.split_type)
    vectors: list[ChunkVector] = await chunking_module.embed(chunks=chunks)

    # 4. Create the chunks in the database
    await database_client.Chunk.create_using_vectors(
        chunk_vectors=vectors, document_id=input.document_id
    )

    # 5. Upsert the vectors to Pinecone
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
