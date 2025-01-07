import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export type User = z.infer<typeof userSchema>;

