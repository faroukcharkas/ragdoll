"use server";

import { Project, projectSchema } from "@/schema/projects";
import { createClient } from "@/utils/supabase/server";

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("project").select("*");
  if (error) {
    throw error;
  }
  return projectSchema.array().parse(data);
}

export async function createProject({ name }: { name: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("project").insert({
    name,
  });
  
  if (error) {
    throw error;
  }
  return data;
}
