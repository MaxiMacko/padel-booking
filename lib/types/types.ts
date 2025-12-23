

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  BOOKED: 'booked',
  CANCELED: 'canceled'
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS] 