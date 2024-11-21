"use server";

import { Project, projectSchema } from "@/schema/projects";
import { createClient } from "@/utils/supabase/server";

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const currentUser = await supabase.auth.getUser();
  if (!currentUser) {
    throw new Error("User not found");
  }
  const { data, error } = await supabase.from("project").select("*").eq("user_id", currentUser.data.user?.id);
  if (error) {
    throw error;
  }
  console.log(data);
  return projectSchema.array().parse(data);
}

export async function createProject({ name, pineconeApiKey, pineconeIndexName }: { name: string, pineconeApiKey: string, pineconeIndexName: string }) {
  const supabase = await createClient();
  const currentUser = await supabase.auth.getUser();
  if (!currentUser) {
    throw new Error("User not found");
  }
  const { data, error } = await supabase.from("project").insert({
    name,
    pinecone_api_key: pineconeApiKey,
    index_name: pineconeIndexName,
  });
  
  if (error) {
    throw error;
  }
  return data;
}
