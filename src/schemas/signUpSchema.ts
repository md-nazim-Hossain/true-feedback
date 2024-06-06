import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, { message: "Please enter a username" })
  .max(20, { message: "Username must be less than 20 characters" })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: "Username can only contain letters and numbers",
  });

export const signUpSchema = z
  .object({
    username: usernameValidation,
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
