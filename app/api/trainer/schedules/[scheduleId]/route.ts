import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  const user = await requireAuth();
  if (user.role !== "TRAINER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { scheduleId } = await params;

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

  const hasActiveBooking = schedule.bookings.some(
    (b) => b.status === "PENDING" || b.status === "CONFIRMED"
  );

  if (hasActiveBooking) {
    return NextResponse.json(
      { error: "Cannot delete slot with active bookings" },
      { status: 400 }
    );
  }

  await prisma.trainerSchedule.delete({
    where: { id: scheduleId },
  });

  return NextResponse.json({ ok: true });
}
