import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserType } from "./types/types";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function requireApiAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: UserType;
    };
  } catch {
    throw new Error("INVALID_TOKEN");
  }
}
