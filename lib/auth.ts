import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set in environment");

export interface AuthUser {
  id: string;
  email: string;
  role: "CLIENT" | "TRAINER" | "ADMIN";
  name?: string | null;
  phone?: string | null;
}

/**
 * Перевіряє токен у cookie та повертає користувача.
 * Якщо токен відсутній або недійсний — редіректить на /login
 */
export async function requireAuth(): Promise<AuthUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      phone: true,
    },
  });

  if (!user) redirect("/login");

  return user;
}

/**
 * Повертає користувача, якщо токен валідний.
 * Не робить редірект, а повертає null, якщо немає користувача.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      phone: true,
    },
  });

  return user;
}

/**
 * Генерує JWT та записує cookie для логіну
 */
export function createAuthToken(userId: string) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
  return token;
}
