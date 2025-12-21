import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const supabase = await createSupabaseRouteClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }

  // 🎯 Supabase сам ставить cookies
  return NextResponse.json({ success: true });
}
