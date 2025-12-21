import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseRouteClient();
  const { id } = params;

  const body = await req.json();
  const { action, new_time } = body; // action: 'cancel' | 'reschedule'

  if (!["cancel", "reschedule"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // отримуємо поточну бронь
  const { data: booking, error: getError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (getError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  let update: any = {};
  if (action === "cancel") update.status = "canceled";
  if (action === "reschedule") update = { status: "rescheduled", rescheduled_to: new_time };

  const { error: updateError } = await supabase
    .from("bookings")
    .update(update)
    .eq("id", id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
