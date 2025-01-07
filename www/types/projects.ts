import { z } from "zod";

export const projectSchema = z.object({
    id: z.number(),
    name: z.string(),
    index_name: z.string(),
  });
  
export type Project = z.infer<typeof projectSchema>;

export const projectMapSchema = z.record(z.string(), projectSchema);

export type ProjectMap = z.infer<typeof projectMapSchema>;