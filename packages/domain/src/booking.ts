import type { BookingStatus } from "./enums";

export type Booking = {
  id: string;
  studioId: string;
  studioName: string;
  userName: string;
  category: string;
  date: string;
  time: string;
  amount: number;
  depositAmount: number;
  balanceAmount: number;
  status: BookingStatus;
};
