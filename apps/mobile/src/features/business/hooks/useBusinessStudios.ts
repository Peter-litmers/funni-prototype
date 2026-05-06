import { useSyncExternalStore } from "react";
import type { Studio } from "@funni/domain";
import { studioRepository } from "@/mocks/repositories/studioRepository";
import { getMockState, subscribeMockState } from "@/mocks/store";

export function useBusinessStudios() {
  const state = useSyncExternalStore(subscribeMockState, getMockState, getMockState);
  const studios = state.studios.filter((studio) => state.myStudioIds.includes(studio.id));

  return {
    studios,
    getById: (id: string) => studios.find((studio) => studio.id === id) ?? null,
    listMine: studioRepository.listMine,
    saveMine: studioRepository.saveMine,
    createMine: studioRepository.createMine,
    deleteMine: studioRepository.deleteMine,
  };
}
