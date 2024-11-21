import { z } from "zod";

export const projectSchema = z.object({
  id: z.number(),
  name: z.string(),
  index_name: z.string(),
});

export type Project = z.infer<typeof projectSchema>;