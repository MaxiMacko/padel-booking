import { z } from "zod";

enum UserRole {
  CLIENT = "CLIENT",
  TRAINER = "TRAINER",
}

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password too short"),
  confirmPassword: z.string(),
  role: z.enum(UserRole),
  phone: z.string().optional(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);
export type RegisterInput = z.infer<typeof registerSchema>;
