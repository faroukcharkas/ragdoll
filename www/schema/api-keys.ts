import { z } from "zod";

export const apiKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  preview: z.string(),
});

export type ApiKey = z.infer<typeof apiKeySchema>;
