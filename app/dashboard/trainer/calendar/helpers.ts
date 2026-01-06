export const calculateSlotTitle = (slot: any) => {
  if (slot.isAvailable) {
    return "Available"
  }
  if (slot.deletedAt !== null) {
    return "Deactivated"
  }
  return "Booked";
}