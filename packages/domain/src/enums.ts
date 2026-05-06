export type UserRole = "consumer" | "business";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelRequested"
  | "cancelled"
  | "completed";

export type NotificationType =
  | "booking"
  | "cancel"
  | "review"
  | "settlement"
  | "system";
