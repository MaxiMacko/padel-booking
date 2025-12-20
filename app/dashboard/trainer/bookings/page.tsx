"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  status: string;
  trainer_schedules: {
    start_time: string;
    end_time: string;
  };
  client: {
    full_name: string | null;
  };
};

export default function TrainerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
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
        {bookings.map((b) => (
          <div
            key={b.id}
            className="border rounded-lg p-4 flex justify-between"
          >
            <div>
              <p className="font-medium">
                {new Date(
                  b.trainer_schedules.start_time
                ).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Client: {b.client?.full_name || "—"}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded text-sm ${b.status === "booked"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
                }`}
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
