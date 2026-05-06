import type { NotificationType, UserRole } from "./enums";

export type Notification = {
  id: string;
  role: UserRole;
  type: NotificationType;
  title: string;
  body: string;
  timeLabel: string;
  read: boolean;
  route?: string;
  bookingId?: string;
};
