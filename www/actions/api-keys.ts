"use server";

import { apiKeySchema, ApiKey } from "@/schema/api-keys";
import { createClient } from "@/utils/supabase/server";

export async function getApiKeys(projectId: string): Promise<ApiKey[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("api_key")
    .select("*")
    .eq("project_id", projectId);
  if (error) {
    throw error;
  }
  return apiKeySchema.array().parse(data);
}
