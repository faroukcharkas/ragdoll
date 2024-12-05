"use server";

import { createClient } from "@/utils/supabase/server";
import { Document, documentSchema } from "@/schema/documents";
import { redirect } from "next/navigation";

export async function getDocuments(projectId: number): Promise<Document[]> {
  const supabase = await createClient();
  const currentUser = await supabase.auth.getUser();
  if (!currentUser) {
    throw new Error("User not found");
  }
  const { data, error } = await supabase
    .from("document")
    .select("*")
    .eq("project_id", projectId)
  if (error) {
    throw error;
  }
  return documentSchema.array().parse(data);
}

export async function getDocument(documentId: number, projectId: number): Promise<Document> {
  const supabase = await createClient();
  const currentUser = await supabase.auth.getUser();
  if (!currentUser || !currentUser.data.user) {
    throw new Error("User not found");
  }
  const { data, error } = await supabase.from("project").select("*").eq("id", projectId).eq("user_id", currentUser.data.user.id).single();
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("Project user not found");
  }
  const { data: documentData, error: documentError } = await supabase.from("document").select("*").eq("id", documentId).eq("project_id", projectId).single();
  if (documentError) {
    throw error;
  }
  console.log(documentData);
  return documentSchema.parse(documentData);
}

export async function createDocument({ title, body, projectId, splitType, text_payload, metadata_schema_id }: { title: string, body: string, projectId: number, splitType: string, text_payload: Record<string, string>, metadata_schema_id: number }) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("document").insert({
    title,
    body,
    project_id: projectId,
    metadata_schema_id,
  }).select().single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Failed to create document");
  }

  await fetch(`${process.env.BACKEND_URL}/document/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ document_id: data.id, split_type: splitType, text_payload: JSON.stringify(text_payload), metadata_schema_id }),
  });

  return data;
}

export async function createDocumentAndRedirect({ body, projectId, splitType, title, text_payload, metadata_schema_id }: { body: string, projectId: number, splitType: string, title: string, text_payload: Record<string, string>, metadata_schema_id: number }) {
  const document = await createDocument({ body, projectId, splitType, title, text_payload, metadata_schema_id });
  redirect(`/dashboard/projects/${projectId}/documents/${document.id}`);
}

export async function deleteDocument(documentId: number, projectId: number) {
  await fetch(`${process.env.BACKEND_URL}/document/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ document_id: documentId }),
  }).then(({}) => {
  
    redirect(`/dashboard/projects/${projectId}/documents`);
  });
}
