import { z } from "zod";

export const documentSplitTypeSchema = z.enum(["SEMANTIC", "SENTENCE"]);

export const documentSchema = z.object({
  id: z.number(),
  title: z.string(),
  created_at: z.string(),
  body: z.string(),
  project_id: z.number(),
});

export type Document = z.infer<typeof documentSchema>;
