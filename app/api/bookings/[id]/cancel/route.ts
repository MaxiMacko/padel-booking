import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseRouteClient();

  const { error } = await supabase.rpc("cancel_booking", {
    p_booking_id: params.id,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
