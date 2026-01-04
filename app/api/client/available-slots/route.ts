import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const trainerId = url.searchParams.get("trainerId"); // optional

  const where: any = {
    isAvailable: true,
    bookings: { none: {} },
  };

  if (trainerId) {
    where.trainerId = trainerId;
  }

  if (from || to) {
    where.startTime = {};
    if (from) where.startTime.gte = new Date(from);
    if (to) where.startTime.lte = new Date(to);
  }

  const slots = await prisma.trainerSchedule.findMany({
    where,
    orderBy: {
      startTime: "asc",
    },
    select: {
      id: true,
      trainerId: true,
      startTime: true,
      endTime: true,
    },
  });

  return NextResponse.json(slots);
}

