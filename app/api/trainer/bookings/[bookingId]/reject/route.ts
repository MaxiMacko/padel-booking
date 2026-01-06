import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const user = await requireAuth();

  if (user.role !== "TRAINER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      trainerSchedule: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Перевірка, що це booking цього тренера
  if (booking.trainerSchedule.trainerId !== user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (booking.status !== "PENDING") {
    return NextResponse.json(
      { error: "Only pending bookings can be rejected" },
      { status: 400 }
    );
  }

  // 🔐 Атомарна операція
  await prisma.$transaction([
    prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
      },
    }),
    prisma.trainerSchedule.update({
      where: { id: booking.trainerScheduleId },
      data: {
        isAvailable: true,
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
