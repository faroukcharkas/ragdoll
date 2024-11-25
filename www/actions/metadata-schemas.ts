"use server";

import {
  MetadataSchema,
  MetadataSchemaField,
  metadataSchemaSchema,
} from "@/schema/metadata-schemas";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

export async function createMetadataSchema(
  projectId: number,
  fields: MetadataSchemaField[],
  name: string,
) {
  console.log(fields);
  console.log(name);
  console.log(projectId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("metadata_schema")
    .insert({ project_id: projectId, name, schema: fields });
  if (error) {
    throw error;
  }
}

export async function createMetadataSchemaAndRedirect(
  projectId: number,
  fields: MetadataSchemaField[],
  name: string,
) {
  await createMetadataSchema(projectId, fields, name);
  redirect(`/dashboard/projects/${projectId}/metadata-schemas`);
}
