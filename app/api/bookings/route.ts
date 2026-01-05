import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { BookingStatus } from "@/lib/generated/prisma/client";

export async function POST(req: Request) {
  const user = await requireAuth();

  if (user.role !== "CLIENT") {
    return NextResponse.json(
      { error: "Only clients can book slots" },
      { status: 403 }
    );
  }

  const { trainerScheduleId } = await req.json();

  if (!trainerScheduleId) {
    return NextResponse.json(
      { error: "trainerScheduleId is required" },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Перевіряємо слот
      const slot = await tx.trainerSchedule.findUnique({
        where: { id: trainerScheduleId },
        include: {
          bookings: true,
        },
      });

      if (!slot || !slot.isAvailable) {
        throw new Error("SLOT_NOT_AVAILABLE");
      }

      if (slot.bookings.length > 0) {
        throw new Error("ALREADY_BOOKED");
      }

      // 2️⃣ Створюємо booking
      const booking = await tx.booking.create({
        data: {
          trainerScheduleId,
          clientId: user.userId,
          status: BookingStatus.PENDING,
        },
      });

      // 3️⃣ Блокуємо слот
      await tx.trainerSchedule.update({
        where: { id: trainerScheduleId },
        data: { isAvailable: false },
      });

      return booking;
    });

    return NextResponse.json({ ok: true, booking: result });
  } catch (err: any) {
    const message =
      err.message === "SLOT_NOT_AVAILABLE"
        ? "Slot is not available"
        : err.message === "ALREADY_BOOKED"
          ? "Slot already booked"
          : "Booking failed";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
