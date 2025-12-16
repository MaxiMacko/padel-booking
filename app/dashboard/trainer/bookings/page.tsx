import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TrainerBookingsPage() {

  const bookings = await fetch("/api/trainer/bookings").then(res => res.json());

  return (
    <div>
      <h1>Мої бронювання</h1>

      {bookings?.map((b: any) => (
        <div key={b.id}>
          <p>{b.client.email}</p>
          <p>{b.schedule.start_time}</p>
        </div>
      ))}
    </div>
  );
}
