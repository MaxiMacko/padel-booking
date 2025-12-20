import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { schedule_id } = await req.json();
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.rpc("book_schedule", {
    p_schedule_id: schedule_id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const supabase = await createSupabaseServerClient();

  // const { data, error } = await supabase
  //   .from("bookings")
  //   .select(`
  //     id,
  //     status,
  //     created_at,
  //     client:profiles(email),
  //     schedule:trainer_schedules(start_time, end_time)
  //   `);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("bookings")
    .select(`
   id,
  status,
  schedule:trainer_schedules (
    start_time,
    end_time
  )
  `)
    .eq("client_id", user?.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
