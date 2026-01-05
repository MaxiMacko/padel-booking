import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const user = await requireAuth();

  if (user.role !== "TRAINER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      trainerSchedule: {
        trainerId: user.userId,
      },
    },
    include: {
      client: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      trainerSchedule: {
        select: {
          startTime: true,
          endTime: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(bookings);
}
