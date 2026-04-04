"use client";

import { Booking, BOOKING_STATUS, BookingStatus } from "@/lib/types/types";
import { useEffect, useState, useCallback } from "react";
import BookingCard from "./BookingCard";
import RescheduleModal from "./RescheduleModal";
import { toast } from "sonner";

export default function ClientBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancel = useCallback(
    async (booking: Booking) => {
      if (!confirm("Скасувати бронювання?")) return;

      try {
        const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
          method: "POST",
        });

        if (res.ok) {
          setBookings((prev) =>
            prev.map((b) =>
              b.id === booking.id ? { ...b, status: BOOKING_STATUS.CANCELED } : b
            )
          );
          toast.success("Бронювання скасовано");
        } else {
          toast.error("Не вдалося скасувати бронювання");
        }
      } catch (error) {
        console.error(error);
        toast.error("Помилка при скасуванні бронювання");
      }
    },
    []
  );

  const handleReschedule = useCallback((booking: Booking) => {
    setRescheduleBooking(booking);
  }, []);

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
            setRescheduleBooking(null);
          }}
        />
      )}
    </div>
  );
}
