import { useSyncExternalStore } from "react";
import { notificationRepository } from "@/mocks/repositories/notificationRepository";
import { getMockState, subscribeMockState } from "@/mocks/store";

export function useNotifications() {
  const state = useSyncExternalStore(subscribeMockState, getMockState, getMockState);
  const currentRoleNotifications = state.notifications.filter(
    (notification) => notification.role === state.session.role,
  );

  return {
    notifications: state.notifications,
    currentRoleNotifications,
    listForCurrentRole: notificationRepository.listForCurrentRole,
    markRead: notificationRepository.markRead,
  };
}
