"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const FullCalendar = dynamic(
  () => import("@fullcalendar/react"),
  { ssr: false }
);

export default function RescheduleModal({
  booking,
  onClose,
  onSuccess,
}: {
  booking: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailableSlots();
  }, []);

  async function loadAvailableSlots() {
    const res = await fetch(
      `/api/client/available-slots?trainer_id=${booking.trainer_id}`
    );
    const data = await res.json();

    setEvents(
      data.map((slot: any) => ({
        id: slot.id,
        start: slot.start_time,
        end: slot.end_time,
        title: "Available",
      }))
    );
  }

  async function handleSlotClick(info: any) {
    if (!confirm("Reschedule to this slot?")) return;

    setLoading(true);

    const res = await fetch("/api/bookings/reschedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: booking.id,
        newScheduleId: info.event.id,
      }),
    });

    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      alert("Failed to reschedule");
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[900px]">
        <h2 className="text-xl font-bold mb-4">🔄 Reschedule training</h2>

        {loading && <p>Processing...</p>}

        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={events}
          eventClick={handleSlotClick}
          allDaySlot={false}
        />

        <button
          onClick={onClose}
          className="mt-4 text-gray-500 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
