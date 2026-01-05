"use client";

import { useEffect, useState } from "react";
import { TrainerBookingCard } from "./TrainerBookingCard";
import { Booking } from "@/lib/types/types";

export default function TrainerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    const res = await fetch("/api/trainer/bookings");
    const data = await res.json();
    setBookings(data || []);
    setLoading(false);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-xl">
      <h1 className="text-xl font-bold mb-4">📖 Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-500">No bookings yet</p>
      )}

      <div className="space-y-3">
        {bookings.map((booking) => (
          <TrainerBookingCard booking={booking} key={booking.id} />
        ))}
      </div>
    </div>
  );
}
