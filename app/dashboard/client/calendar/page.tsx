"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";

export default function ClientCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    const res = await fetch("/api/trainer-schedules");
    const data = await res.json();
    setEvents(
      (data || []).map((slot: any) => ({
        id: slot.id,
        start: slot.start_time,
        end: slot.end_time,
        title: "Available",
      }))
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-4">🎾 Доступні тренування</h2>

      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        events={events}
        allDaySlot={false}
      />
    </div>
  );
}
