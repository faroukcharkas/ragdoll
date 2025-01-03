"use server";

import { apiKeySchema, ApiKey } from "@/schema/api-keys";
import { createClient } from "@/utils/supabase/server";
import sha256 from "sha256";
import { randomBytes } from "crypto";

export async function getApiKeys(projectId: number): Promise<ApiKey[]> {
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

export async function createApiKeyAndReturnKey(
  projectId: number,
  name: string
): Promise<string> {
  const supabase = await createClient();

  // 1. Generate a random key
  const key = randomBytes(32).toString("hex");

  // 2. Create a preview key
  const previewKey = `${key.slice(0, 4)}...${key.slice(-4)}`;

  // 3. Hash the key
  const hashedKey = sha256(key);

  const { data, error } = await supabase
    .from("api_key")
    .insert({
      project_id: projectId,
      name,
      hash: hashedKey,
      preview: previewKey,
    });
  if (error) {
    throw error;
  }
  return key;
}
