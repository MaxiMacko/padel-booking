"use client";

import { useState } from "react";
import { ConfirmDialog } from "../ui/ConfirmDialog/ConfirmDialog";
import { sl } from "zod/v4/locales";

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

  async function reactivate() {
    setLoading(true);

    await fetch(
      `/api/trainer/schedules/${slot.id}/reactivate`,
      { method: "POST" }
    );

    setLoading(false);
    onDeleted(); // reload
    onClose();
  }

  async function deactivate() {
    setLoading(true);

    await fetch(`/api/trainer/schedules/${slot.id}/deactivate`,
      { method: "POST" }
    );

    setLoading(false);
    onDeleted();
    onClose();
  }

  const confirmHandler = slot.deletedAt ? reactivate : deactivate;


  return (
    <ConfirmDialog
      title="Deactivate slot"
      open
      description={`${new Date(slot.startTime).toLocaleString()} - ${new Date(slot.endTime.toLocaleString())}`}
      onConfirm={confirmHandler}
      onCancel={onClose}
    />
  );
}
