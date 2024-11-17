"use server";

import { createClient } from "@/utils/supabase/server";
import { Document, documentSchema } from "@/schema/documents";

export async function getDocuments(projectId: number): Promise<Document[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("document")
    .select("*")
    .eq("project_id", projectId);
  if (error) {
    throw error;
  }
  return documentSchema.array().parse(data);
}

export async function createDocument({ title, body, url, description, projectId }: { title: string, body: string, url: string, description: string, projectId: number }) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("document").insert({
    title,
    body,
    url,
    description,
    project_id: projectId,
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
    body: JSON.stringify({ document_id: data.id }),
  });

  return data;
}
