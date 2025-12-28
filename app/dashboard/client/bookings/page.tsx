"use client";

import { Booking, BOOKING_STATUS, BookingStatus } from "@/lib/types/types";
import { useEffect, useState } from "react";
import BookingCard from "./BookingCard";
import RescheduleModal from "./RescheduleModal";

export default function ClientBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [rescheduleBooking, setRescheduleBooking] =
    useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    const res = await fetch("/api/bookings");
    const data = await res.json();

    setBookings(data || []);
  }

  async function handleCancel(booking: Booking) {
    if (!confirm("Скасувати бронювання?")) return;

    const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
      method: "POST",
    });

    if (res.ok) {
      setBookings(prev =>
        prev.map(b =>
          b.id === booking.id ? { ...b, status: BOOKING_STATUS.CANCELED } : b
        )
      );
    } else {
      alert("Не вдалося скасувати бронювання");
    }
  }

  function handleReschedule(booking: Booking) {
    setRescheduleBooking(booking);
    // alert("Reschedule UI — наступний крок");
  }

  return (
    <div className="bg-white p-6 rounded-xl">
      <h1 className="text-xl font-bold mb-4">📅 Мої бронювання</h1>

      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          handleCancel={handleCancel}
          handleReschedule={handleReschedule}
          loading={loading}
        />
      ))}

      {rescheduleBooking && (
        <RescheduleModal
          booking={rescheduleBooking}
          onClose={() => setRescheduleBooking(null)}
          onSuccess={() => {
            loadBookings();
            setRescheduleBooking(null)
          }}
        />
      )}

    </div>
  );
}
