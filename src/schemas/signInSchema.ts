import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
  remember: z.boolean().default(false),
});
