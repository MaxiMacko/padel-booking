"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  slot: any;
  onDeleted: () => void;
}

export function DeleteScheduleModal({
  onClose,
  slot,
  onDeleted,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function deactivate() {
    if (!confirm("Deactivate this slot?")) return;

    setLoading(true);

    await fetch(`/api/trainer/schedules/${slot.id}`, {
      method: "DELETE",
    });

    setLoading(false);
    onDeleted();
    onClose();
  }


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 space-y-4">
        <h2 className="text-xl font-bold">Schedule</h2>

        <p>
          🕒 {new Date(slot.startTime).toLocaleString()} –{" "}
          {new Date(slot.endTime).toLocaleTimeString()}
        </p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100"
          >
            Close
          </button>

          <button
            onClick={deactivate}
            disabled={loading}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}
