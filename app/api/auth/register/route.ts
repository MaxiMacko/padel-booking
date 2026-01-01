import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/passwords";
import { registerSchema } from "@/lib/validators/register";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Валідуємо через Zod
    const parsed = registerSchema.parse(body);

    // Перевірка чи email вже зайнятий
    const existing = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already used" },
        { status: 409 }
      );
    }

    // Створюємо користувача
    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        password: await hashPassword(parsed.password),
        phone: parsed.phone,
        role: parsed.role,
      },
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
