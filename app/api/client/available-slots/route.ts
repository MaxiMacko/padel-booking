import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  from: z.string().optional().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    "Invalid 'from' date"
  ),
  to: z.string().optional().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    "Invalid 'to' date"
  ),
  trainerId: z.string().optional(),
  limit: z.string().optional().transform((v) => v ? Math.min(parseInt(v, 10), 100) : 50),
  offset: z.string().optional().transform((v) => v ? parseInt(v, 10) : 0),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams);

    const parsed = querySchema.safeParse(query);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { from, to, trainerId, limit, offset } = parsed.data;

    const where: any = {
      isAvailable: true,
      deletedAt: null,
      bookings: {
        none: {
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
      },
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
      take: limit,
      skip: offset,
    });

    const total = await prisma.trainerSchedule.count({ where });

    return NextResponse.json({
      slots,
      pagination: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}

