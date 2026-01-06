import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  const { scheduleId } = await params;
  const user = await requireAuth();

  const schedule = await prisma.trainerSchedule.findUnique({
    where: { id: scheduleId },
    include: { bookings: true },
  });

  if (!schedule || schedule.trainerId !== user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ⛔ Забороняємо delete, якщо є активні bookings
  const hasActiveBookings = schedule.bookings.some(
    (b) => b.status === "PENDING" || b.status === "CONFIRMED"
  );

  if (hasActiveBookings) {
    return NextResponse.json(
      { error: "Schedule has active bookings" },
      { status: 400 }
    );
  }

  // // ✅ Видаляємо тільки cancelled / rescheduled bookings
  // await prisma.booking.deleteMany({
  //   where: {
  //     trainerScheduleId: scheduleId,
  //     status: {
  //       in: ["CANCELLED", "RESCHEDULED"],
  //     },
  //   },
  // });

  // ✅ Тепер можна видаляти schedule
  await prisma.trainerSchedule.update({
    where: { id: scheduleId },
    data: {
      deletedAt: new Date(),
      isAvailable: false,
    },
  });

  return NextResponse.json({ ok: true });
}
