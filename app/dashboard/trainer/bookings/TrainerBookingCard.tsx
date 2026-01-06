"use client";

import { BookingStatus } from "@/lib/generated/prisma/enums";
import { Booking } from "@/lib/types/types";
import { useState } from "react";

export function TrainerBookingCard({ booking }: { booking: Booking }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<BookingStatus>(booking.status);

  async function confirmBooking() {
    setLoading(true);

    const res = await fetch(
      `/api/trainer/bookings/${booking.id}/confirm`,
      { method: "POST" }
    );

    if (res.ok) {
      setStatus("CONFIRMED");
    } else {
      alert("Failed to confirm booking");
    }

    setLoading(false);
  }

  async function rejectBooking() {
    setLoading(true);

    const res = await fetch(
      `/api/trainer/bookings/${booking.id}/reject`,
      { method: "POST" }
    );

    if (res.ok) {
      setStatus("CANCELLED");
    } else {
      alert("Failed to confirm booking");
    }

    setLoading(false);
  }

  return (
    <div className="border rounded-xl p-4 space-y-2 bg-white">
      <div className="text-sm text-gray-600">
        Client: {booking.client.email}
      </div>

      <div>
        {new Date(booking.trainerSchedule.startTime).toLocaleString()} –{" "}
        {new Date(booking.trainerSchedule.endTime).toLocaleTimeString()}
      </div>

      <div className="font-semibold">
        Status:{" "}
        <span
          className={
            status === "PENDING"
              ? "text-yellow-600"
              : status === "CONFIRMED"
                ? "text-green-600"
                : "text-gray-400"
          }
        >
          {status}
        </span>
      </div>

      {status === "PENDING" && (
        <div className="flex gap-2 pt-2">
          <button
            className="px-4 py-2 rounded-lg border text-gray-600"
            onClick={rejectBooking}
            disabled={loading}
          >
            Reject
          </button>

          <button
            onClick={confirmBooking}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50"
          >
            {loading ? "Confirming…" : "Confirm"}
          </button>
        </div>
      )}
    </div>
  );
}
