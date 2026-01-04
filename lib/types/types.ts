

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

export const USER_TYPE = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
  TRAINER: 'TRAINER'
} as const;

export type UserType = typeof USER_TYPE[keyof typeof USER_TYPE];