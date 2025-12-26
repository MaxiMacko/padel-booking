import { NextResponse } from "next/server";

import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(req: Request) {
  const supabase = await createSupabaseRouteClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { start_time, end_time } = await req.json();

  const { error } = await supabase.from("trainer_schedules").insert({
    start_time,
    end_time,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}


export async function GET() {
  const supabase = await createSupabaseRouteClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // перевіряємо роль
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "trainer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Якщо залогінений тренер — показуємо тільки його слоти

  const { data, error } = await supabase
    .from("trainer_schedules")
    .select("*")
    .eq('trainer_id', user.id)
    .order("start_time");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseRouteClient();

  const { error } = await supabase
    .from("trainer_schedules")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
