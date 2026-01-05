"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const FullCalendar = dynamic(
  () => import("@fullcalendar/react"),
  { ssr: false }
);

export default function ClientCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    const res = await fetch("/api/client/available-slots");
    const data = await res.json();

    setEvents(
      (data || [])
        .map((slot: any) => ({
          id: slot.id,
          start: slot.startTime,
          end: slot.endTime,
          title: "Available",
        }))
    );
  }

  async function handleEventClick(info: any) {
    const event = info.event;

    if (!confirm("Бронювати цей слот?")) return;

    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainerScheduleId: event.id }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Слот заброньовано!");
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
      } else {
        alert("❌ Не вдалося забронювати: " + data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        🎾 Доступні тренування
      </h2>

      {loading && <p>Loading...</p>}

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        eventClick={handleEventClick}
        allDaySlot={false}
      />
    </div>
  );
}
