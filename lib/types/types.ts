export type Booking = {
  id: string;
  status: BookingStatus;
  client: { email: string };
  trainerSchedule: {
    startTime: string;
    endTime: string;
  };
};

export const BOOKING_STATUS = {
  CONFIRMED: 'CONFIRMED',
  PENDING: 'PENDING',
  CANCELED: 'CANCELLED',
  RESCHEDULED: 'RESCHEDULED'
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS]

export const USER_TYPE = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
  TRAINER: 'TRAINER'
} as const;

export type UserType = typeof USER_TYPE[keyof typeof USER_TYPE];