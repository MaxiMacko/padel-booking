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
    const res = await fetch("/api/trainer/schedules");
    const data = await res.json();

    setEvents(
      data.map((slot: any) => ({
        id: slot.id,
        start: slot.start_time,
        end: slot.end_time,
        title: slot.is_available ? "Available" : "Booked",
        color: slot.is_available ? "#16a34a" : "#dc2626",
        // Custom props
        extendedProps: {
          editable: slot.is_available,
        },
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

  async function handleEventClick(event: any) {
    if (!event.extendedProps.editable) {
      alert("Цей слот уже заброньований");
      return;
    }

    if (!confirm("Видалити цей слот?")) return;

    const res = await fetch(
      `/api/trainer-schedules/${event.id}`,
      { method: "DELETE" }
    );

    const data = await res.json();

    if (res.ok) {
      event.remove(); // миттєво з календаря
    } else {
      alert(data.error || "Не вдалося видалити слот");
    }
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
        eventClick={(info) => handleEventClick(info.event)}
      />
    </div>
  );
}
