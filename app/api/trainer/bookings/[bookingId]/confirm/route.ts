import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { BookingStatus } from "@/lib/generated/prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  const user = await requireAuth();

  if (user.role !== "TRAINER") {
    return NextResponse.json(
      { error: "Only trainers can confirm bookings" },
      { status: 403 }
    );
  }

  const { bookingId } = await params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trainerSchedule: true,
      },
    });

    console.log('booking to update', booking);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Перевірка ownership
    if (booking.trainerSchedule.trainerId !== user.userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    if (booking.status !== BookingStatus.PENDING) {
      return NextResponse.json(
        { error: "Booking is not pending" },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
      },
    });

    return NextResponse.json({ ok: true, booking: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to confirm booking" },
      { status: 500 }
    );
  }
}
