import { useSyncExternalStore } from "react";
import { getMockState, subscribeMockState } from "@/mocks/store";

export function useStudios() {
  const state = useSyncExternalStore(subscribeMockState, getMockState, getMockState);
  return state.studios;
}
