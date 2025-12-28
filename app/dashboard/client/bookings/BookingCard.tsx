"use client";

import { Booking, BOOKING_STATUS } from "@/lib/types/types";

interface BookingCardProps {
  booking: Booking;
  handleCancel: (booking: Booking) => void;
  handleReschedule: (booking: Booking) => void
  loading: boolean;
}

export default function BookingCard({ booking, handleCancel, handleReschedule, loading }: BookingCardProps) {
  return (
    <div
      key={booking.id}
      className="border rounded-lg p-4 mb-3 flex justify-between items-center"
    >
      <div>
        <p className="font-medium">
          {new Date(booking.schedule.start_time).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          {booking.status}
        </p>
      </div>

      {booking.status === BOOKING_STATUS.CONFIRMED && (
        <div className="flex gap-2">
          <button
            onClick={() => handleCancel(booking)}
            disabled={loading}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => handleReschedule(booking)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer"
          >
            Reschedule
          </button>
        </div>
      )}
    </div>
  )
}