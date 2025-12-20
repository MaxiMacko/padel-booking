import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

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
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Якщо залогінений тренер — показуємо тільки його слоти
  if (user) {
    const { data, error } = await supabase
      .from("trainer_schedules")
      .select("*")
      .order("start_time");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  }

  // Публічний доступ (клієнти)
  const { data, error } = await supabase
    .from("trainer_schedules")
    .select("*")
    .eq("is_available", true)
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
  const supabase = await createSupabaseServerClient();

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
