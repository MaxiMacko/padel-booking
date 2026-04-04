"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { DeleteScheduleModal } from "@/app/commonComponents/trainer/DeleteScheduleModal";
import { calculateSlotTitle } from "./helpers";

export default function TrainerCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const loadSlots = useCallback(async () => {
    try {
      const res = await fetch("/api/trainer/schedules");
      if (!res.ok) throw new Error("Failed to load schedules");
      const data = await res.json();

      setEvents(
        data.map((slot: any) => ({
          id: slot.id,
          start: slot.startTime,
          end: slot.endTime,
          title: calculateSlotTitle(slot),
          color: slot.isAvailable ? "#16a34a" : "#dc2626",
          extendedProps: {
            editable: slot.isAvailable,
            slot,
          },
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load schedules");
    }
  }, []);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleSelect = useCallback(
    async (info: any) => {
      try {
        const res = await fetch("/api/trainer/schedules", {
          method: "POST",
          body: JSON.stringify({
            startTime: info.startStr,
            endTime: info.endStr,
          }),
        });
        if (!res.ok) throw new Error("Failed to create slot");
        loadSlots();
        toast.success("Slot is created");
      } catch (e) {
        toast.error("Something went wrong");
      }
    },
    [loadSlots]
  );

  const handleEventClick = useCallback((event: any) => {
    setSelectedSlot(event.extendedProps.slot);
  }, []);

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

      {selectedSlot && (
        <DeleteScheduleModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onDeleted={loadSlots}
        />
      )}
    </div>
  );
}
