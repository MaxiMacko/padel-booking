import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createSupabaseRouteClient();

  const { data, error } = await supabase
    .from("trainer_schedules")
    .select(`
      id,
      start_time,
      end_time,
      trainer_id,
      profiles (
        name
      )
    `)
    .eq("is_available", true)
    .order("start_time");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
