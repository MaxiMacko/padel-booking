import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { BookingStatus } from "@/lib/generated/prisma/client";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();

    if (user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Only clients can book slots" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { trainerScheduleId } = body;

    if (!trainerScheduleId || typeof trainerScheduleId !== "string") {
      return NextResponse.json(
        { error: "Valid trainerScheduleId is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Verify slot availability and check for existing bookings
      const slot = await tx.trainerSchedule.findUnique({
        where: { id: trainerScheduleId },
        select: {
          id: true,
          isAvailable: true,
          _count: {
            select: {
              bookings: {
                where: {
                  status: {
                    in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
                  },
                },
              },
            },
          },
        },
      });

      if (!slot) {
        throw new Error("SLOT_NOT_FOUND");
      }

      if (!slot.isAvailable || slot._count.bookings > 0) {
        throw new Error("SLOT_NOT_AVAILABLE");
      }

      // 2️⃣ Check for duplicate booking by same client
      const existingBooking = await tx.booking.findFirst({
        where: {
          trainerScheduleId,
          clientId: user.userId,
          status: {
            in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
          },
        },
      });

      if (existingBooking) {
        throw new Error("ALREADY_BOOKED");
      }

      // 3️⃣ Create booking
      const booking = await tx.booking.create({
        data: {
          trainerScheduleId,
          clientId: user.userId,
          status: BookingStatus.PENDING,
        },
      });

      // 4️⃣ Mark slot as unavailable
      await tx.trainerSchedule.update({
        where: { id: trainerScheduleId },
        data: { isAvailable: false },
      });

      return booking;
    }, {
      maxWait: 5000,
      timeout: 10000,
    });

    return NextResponse.json({ ok: true, booking: result });
  } catch (err: any) {
    const message =
      err.message === "SLOT_NOT_FOUND"
        ? "Slot not found"
        : err.message === "SLOT_NOT_AVAILABLE"
          ? "Slot is not available"
          : err.message === "ALREADY_BOOKED"
            ? "You have already booked this slot"
            : "Booking failed";

    const status =
      err.message === "UNAUTHORIZED" ? 401 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
