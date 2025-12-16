"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";

export default function TrainerCalendarPage() {
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

  async function handleSelect(info: any) {
    await fetch("/api/trainer-schedules", {
      method: "POST",
      body: JSON.stringify({
        start_time: info.startStr,
        end_time: info.endStr,
      }),
    });

    loadSlots();
  }

  return (
    <div className="bg-white p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-4">📅 Мій розклад</h2>

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable
        select={handleSelect}
        events={events}
        allDaySlot={false}
      />
    </div>
  );
}
