import { useSyncExternalStore } from "react";
import { bookingRepository } from "@/mocks/repositories/bookingRepository";
import { getMockState, subscribeMockState } from "@/mocks/store";

export function useBookings() {
  const state = useSyncExternalStore(subscribeMockState, getMockState, getMockState);
  const currentRoleBookings =
    state.session.role === "business"
      ? state.bookings
      : state.bookings.filter((booking) => booking.userName === state.session.userName);

  return {
    bookings: state.bookings,
    currentRoleBookings,
    listForCurrentRole: bookingRepository.listForCurrentRole,
    getById: bookingRepository.getById,
    createBooking: bookingRepository.create,
    requestCancel: bookingRepository.requestCancel,
    markCompleted: bookingRepository.markCompleted,
    confirmBooking: bookingRepository.confirmBooking,
  };
}
