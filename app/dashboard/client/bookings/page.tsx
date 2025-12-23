"use client";

import { BOOKING_STATUS, BookingStatus } from "@/lib/types/types";
import { useEffect, useState } from "react";

type Booking = {
  id: string;
  status: BookingStatus;
  schedule: {
    start_time: string;
    end_time: string;
  };
};

export default function ClientBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    const res = await fetch("/api/bookings");
    const data = await res.json();

    setBookings(data || []);
  }

  async function handleCancel(id: string) {
    if (!confirm("Скасувати бронювання?")) return;

    const res = await fetch(`/api/bookings/${id}/cancel`, {
      method: "POST",
    });

    if (res.ok) {
      setBookings(prev =>
        prev.map(b =>
          b.id === id ? { ...b, status: BOOKING_STATUS.CANCELED } : b
        )
      );
    } else {
      alert("Не вдалося скасувати бронювання");
    }
  }


  function handleReschedule(id: string) {
    alert("Reschedule UI — наступний крок");
  }


  return (
    <div className="bg-white p-6 rounded-xl">
      <h1 className="text-xl font-bold mb-4">📅 Мої бронювання</h1>

      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="border rounded-lg p-4 mb-3 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">
              {new Date(booking.schedule.start_time).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              {booking.status}
            </p>
          </div>

          {booking.status === BOOKING_STATUS.CONFIRMED && (
            <div className="flex gap-2">
              <button
                onClick={() => handleCancel(booking.id)}
                disabled={loading}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReschedule(booking.id)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer"
              >
                Reschedule
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
