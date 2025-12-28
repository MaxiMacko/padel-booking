import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(req: Request) {
  const supabase = await createSupabaseRouteClient();
  const { bookingId, newScheduleId } = await req.json();

  console.log('booking id', bookingId)
  console.log('new schedule', newScheduleId);

  const { error } = await supabase.rpc("reschedule_booking", {
    p_booking_id: bookingId,
    p_new_schedule_id: newScheduleId,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ success: true });
}
