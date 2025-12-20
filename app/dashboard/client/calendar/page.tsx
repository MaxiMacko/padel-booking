"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from "react";

export default function ClientCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    const res = await fetch("/api/trainer-schedules");
    const data = await res.json();
    setEvents(
      (data || []).filter((slot: any) => slot.is_available).map((slot: any) => ({
        id: slot.id,
        start: slot.start_time,
        end: slot.end_time,
        title: "Available",
      }))
    );
  }

  async function handleEventClick(event: any) {
    if (!confirm("Бронювати цей слот?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule_id: event.id }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Слот заброньовано!");
        // Оновлюємо локальний state, видаляючи заброньований слот
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
      } else {
        alert("❌ Не вдалося забронювати: " + data.error);
      }
    } catch (err) {
      alert("❌ Помилка сервера");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-4">🎾 Доступні тренування</h2>
      {loading && <p>Loading...</p>}

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        eventClick={(info) => handleEventClick(info.event)}
        dateClick={handleEventClick}
        allDaySlot={false}
      />
    </div>
  );
}
