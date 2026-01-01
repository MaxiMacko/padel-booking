import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/passwords";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone, role } = body;

    // 1. Валідація
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Перевірка на існування
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // 3. Створення користувача
    const user = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
        role: role ?? "CLIENT",
      },
    });

    // 4. Відповідь (НЕ повертаємо пароль)
    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
