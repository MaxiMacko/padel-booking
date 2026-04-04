"use client";

import { useEffect, useState, useCallback } from "react";
import { TrainerBookingCard } from "./TrainerBookingCard";
import { Booking } from "@/lib/types/types";

export default function TrainerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/trainer/bookings");
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data || []);
    } catch (error) {
      console.error(error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

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
