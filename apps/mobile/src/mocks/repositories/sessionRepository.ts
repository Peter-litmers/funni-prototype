import type { UserRole } from "@funni/domain";
import { getMockState, updateMockState } from "../store";

export const sessionRepository = {
  async getRole() {
    return getMockState().session.role;
  },

  async setRole(role: UserRole) {
    updateMockState((current) => ({
      ...current,
      session: { ...current.session, role },
    }));
  },
};
