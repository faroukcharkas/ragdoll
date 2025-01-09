"use server";

import { redirectSafely } from "@/lib/redirect";
import { Project, ProjectMap, projectSchema } from "@/types/projects";
import { createClient } from "@/utils/supabase/server";
import { permanentRedirect, redirect } from "next/navigation";

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
  return projectSchema.array().parse(data);
}

export async function getProjectMap(): Promise<ProjectMap> {
  const projects = await getProjects();
  return projects.reduce((acc, project) => {
    acc[project.id] = project;
    return acc;
  }, {} as ProjectMap);
}

export async function getProject(projectId: string): Promise<Project> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("project").select("*").eq("id", projectId).single();
  if (error) {
    throw error;
  }
  return projectSchema.parse(data);
}

export async function createProject({ name, pineconeApiKey, pineconeIndexName, redirectToProject = true }: { name: string, pineconeApiKey: string, pineconeIndexName: string, redirectToProject?: boolean }) {
  const supabase = await createClient();
  const currentUser = await supabase.auth.getUser();
  if (!currentUser) {
    throw new Error("User not found");
  }
  const { data, error } = await supabase.from("project").insert({
    name,
    pinecone_api_key: pineconeApiKey, 
    index_name: pineconeIndexName,
  }).select().single();
  
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("Project not found");
  }
  if (redirectToProject) {
    permanentRedirect(`/dashboard/projects/${data.id}`);
  }
  return data;
}

export async function updateProjectName(projectId: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("project").update({ name }).eq("id", projectId);
  if (error) {
    throw error;
  }
}