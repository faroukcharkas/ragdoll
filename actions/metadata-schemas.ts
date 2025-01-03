"use server";

import {
  MetadataSchema,
  MetadataSchemaField,
  metadataSchemaSchema,
} from "@/schema/metadata-schemas";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getMetadataSchemas(
  projectId: number,
): Promise<MetadataSchema[]> {
  console.log("Getting metadata schemas for project", projectId);
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("metadata_schema")
    .insert({ project_id: projectId, name, fields });
  if (error) {
    throw error;
  }
}

export async function createMetadataSchemaAndRedirect(
  projectId: number,
  fields: MetadataSchemaField[],
  name: string,
) {
  let redirectPath = `/dashboard/projects/${projectId}/metadata-schemas`;
  try {
    await createMetadataSchema(projectId, fields, name);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    redirect(redirectPath);
  }
}
