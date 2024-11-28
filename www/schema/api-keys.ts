import { z } from "zod";

export const apiKeySchema = z.object({
  id: z.number(),
  name: z.string(),
  preview: z.string(),
});

export type ApiKey = z.infer<typeof apiKeySchema>;
