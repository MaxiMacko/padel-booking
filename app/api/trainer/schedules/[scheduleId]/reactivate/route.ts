// app/api/trainer/schedules/[scheduleId]/reactivate/route.ts
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  const { scheduleId } = await params;
  const user = await requireAuth();

  // Отримуємо слот
  const schedule = await prisma.trainerSchedule.findUnique({
    where: { id: scheduleId },
    include: {
      bookings: true,
    },
  });

  if (!schedule) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (schedule.trainerId !== user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ❌ Якщо є CONFIRMED booking — не дозволяємо
  const hasConfirmed = schedule.bookings.some(
    (b) => b.status === "CONFIRMED"
  );

  if (hasConfirmed) {
    return NextResponse.json(
      { error: "Cannot reactivate slot with confirmed booking" },
      { status: 400 }
    );
  }

  await prisma.trainerSchedule.update({
    where: { id: scheduleId },
    data: {
      deletedAt: null,
      isAvailable: true,
    },
  });

  return NextResponse.json({ ok: true });
}
