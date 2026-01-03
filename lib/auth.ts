import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export type CurrentUser = {
  userId: string;
  role: "CLIENT" | "TRAINER" | "ADMIN";
  name: string;
};

/**
 * Повертає поточного користувача із JWT cookie або null
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies(); // <- тепер асинхронно
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as CurrentUser;
    return payload;
  } catch {
    return null;
  }
}
