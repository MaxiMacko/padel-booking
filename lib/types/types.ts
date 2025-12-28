

export type Booking = {
  id: string;
  status: BookingStatus;
  schedule: {
    start_time: string;
    end_time: string;
  };
};

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  BOOKED: 'booked',
  CANCELED: 'canceled',
  RESCHEDULED: 'rescheduled'
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS] 