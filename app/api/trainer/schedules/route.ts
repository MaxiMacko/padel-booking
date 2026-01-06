import { NextResponse } from "next/server";

import { createSupabaseRouteClient } from "@/lib/supabase/route";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createTrainerScheduleSchema } from "@/lib/validators/trainerSchedule.schema";
import { USER_TYPE } from "@/lib/types/types";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();

    if (user.role !== USER_TYPE.TRAINER) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const parsed = createTrainerScheduleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { startTime, endTime } = parsed.data;

    // базова логіка
    if (new Date(startTime) >= new Date(endTime)) {
      return NextResponse.json(
        { error: "Invalid time range" },
        { status: 400 }
      );
    }

    const schedule = await prisma.trainerSchedule.create({
      data: {
        trainerId: user.userId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json({ ok: true, schedule });

  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const user = await requireAuth();

  if (user.role !== USER_TYPE.TRAINER) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const schedules = await prisma.trainerSchedule.findMany({
    where: {
      trainerId: user.userId,
    },
    orderBy: {
      startTime: "asc",
    },
    include: {
      bookings: true,
    },
  });

  return NextResponse.json(schedules);
}

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const supabase = await createSupabaseRouteClient();

//   const { error } = await supabase
//     .from("trainer_schedules")
//     .delete()
//     .eq("id", params.id);

//   if (error) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 400 }
//     );
//   }

//   return NextResponse.json({ success: true });
// }
