import { getMockState, updateMockState } from "../store";

export const notificationRepository = {
  async listForCurrentRole() {
    const { session, notifications } = getMockState();
    return notifications.filter((notification) => notification.role === session.role);
  },

  async markRead(id: string) {
    updateMockState((current) => ({
      ...current,
      notifications: current.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    }));
  },
};
