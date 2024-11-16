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
