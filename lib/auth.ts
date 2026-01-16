import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserType } from "./types/types";

export type AuthUser = {
  userId: string;
  role: UserType;
  name?: string;
};

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Отримати юзера з cookie (або null)
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: AuthUser["role"];
    };

    return {
      userId: payload.userId,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

/**
 * Обовʼязкова авторизація
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/**
 * Обовʼязкова роль
 */
export async function requireRole(
  role: AuthUser["role"]
): Promise<AuthUser> {

  const user = await requireAuth();

  if (user.role !== role) {
    throw new Error("FORBIDDEN");
  }
  return user;
}