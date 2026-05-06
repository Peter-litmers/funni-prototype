import { type UserRole } from "@funni/domain";
import { useSyncExternalStore } from "react";
import { sessionRepository } from "@/mocks/repositories/sessionRepository";
import { getMockState, subscribeMockState } from "@/mocks/store";

export function useRole(): [UserRole, (role: UserRole) => Promise<void>] {
  const role = useSyncExternalStore(
    subscribeMockState,
    () => getMockState().session.role,
    () => "consumer" as UserRole,
  );

  return [role, sessionRepository.setRole];
}
