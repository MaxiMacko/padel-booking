"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { DeleteScheduleModal } from "@/app/commonComponents/trainer/DeleteScheduleModal";
import { calculateSlotTitle } from "./helpers";

export default function TrainerCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(
    null
  );

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    const res = await fetch("/api/trainer/schedules");
    const data = await res.json();

    setEvents(
      data.map((slot: any) => ({
        id: slot.id,
        start: slot.startTime,
        end: slot.endTime,
        title: calculateSlotTitle(slot),
        color: slot.isAvailable ? "#16a34a" : "#dc2626",
        // Custom props
        extendedProps: {
          editable: slot.isAvailable,
          slot,
        },
      }))
    );
  }

  async function handleSelect(info: any) {
    await fetch("/api/trainer/schedules", {
      method: "POST",
      body: JSON.stringify({
        startTime: info.startStr,
        endTime: info.endStr,
      }),
    });

    loadSlots();
  }

  async function loadSchedules() {
    const res = await fetch("/api/trainer/schedules");
    const data = await res.json();

    setEvents(
      data.map((s: any) => ({
        id: s.id,
        start: s.startTime,
        end: s.endTime,
        title: s.isAvailable ? "Available" : "Booked",
      }))
    );
  }

  async function handleEventClick(event: any) {
    console.log('handle event click', event.extendedProps.slot);
    setSelectedSlot(event.extendedProps.slot);
    // setSelectedScheduleId(event.id); 
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

      {
        selectedSlot && (
          <DeleteScheduleModal
            slot={selectedSlot}
            onClose={() => setSelectedSlot(null)}
            onDeleted={loadSchedules}
          />
        )
      }

    </div>
  );
}
