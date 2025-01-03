import { z } from "zod";

export const authFormInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AuthFormInput = z.infer<typeof authFormInputSchema>;
