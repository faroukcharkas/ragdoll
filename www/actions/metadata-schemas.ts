"use server";

import { MetadataSchema, metadataSchemaSchema } from "@/schema/metadata-schemas";
import { createClient } from "@/utils/supabase/server";

export async function getMetadataSchemas(projectId: number): Promise<MetadataSchema[]> {
  const supabase = await createClient();
  const currentUser = await supabase.auth.getUser();
  if (!currentUser) {
    throw new Error("User not found");
  }
  const { data, error } = await supabase
    .from("metadata_schema")
    .select("*")
    .eq("project_id", projectId);
  if (error) {
    throw error;
  }
  console.log(data);
  return metadataSchemaSchema.array().parse(data);
}