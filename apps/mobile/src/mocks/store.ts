import type { Booking, Notification, Studio, UserRole } from "@funni/domain";
import { bookingsFixture } from "./fixtures/bookings";
import { notificationsFixture } from "./fixtures/notifications";
import { studiosFixture } from "./fixtures/studios";

type SessionState = {
  role: UserRole;
  userName: string;
};

type MockState = {
  session: SessionState;
  studios: Studio[];
  myStudioIds: string[];
  bookings: Booking[];
  notifications: Notification[];
};

let state: MockState = {
  session: {
    role: "consumer",
    userName: "김포토",
  },
  studios: studiosFixture,
  myStudioIds: ["studio-lumiere", "studio-sunset"],
  bookings: bookingsFixture,
  notifications: notificationsFixture,
};

const listeners = new Set<() => void>();

export function getMockState() {
  return state;
}

export function subscribeMockState(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateMockState(updater: (current: MockState) => MockState) {
  state = updater(state);
  listeners.forEach((listener) => listener());
}
