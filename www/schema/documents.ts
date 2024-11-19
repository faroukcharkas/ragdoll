import { z } from "zod";

export const documentSchema = z.object({
  id: z.number(),
  title: z.string(),
  created_at: z.string(),
  body: z.string(),
  project_id: z.number(),
  description: z.string(),
  url: z.string(),
});

export type Document = z.infer<typeof documentSchema>;
