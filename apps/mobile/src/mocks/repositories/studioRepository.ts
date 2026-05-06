import type { Studio } from "@funni/domain";
import { getMockState, updateMockState } from "../store";

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export const studioRepository = {
  async list(): Promise<Studio[]> {
    return getMockState().studios;
  },

  async getById(id: string): Promise<Studio | null> {
    return getMockState().studios.find((studio) => studio.id === id) ?? null;
  },

  async listMine(): Promise<Studio[]> {
    const { studios, myStudioIds } = getMockState();
    return studios.filter((studio) => myStudioIds.includes(studio.id));
  },

  async saveMine(studio: Studio): Promise<Studio> {
    updateMockState((current) => {
      const exists = current.studios.some((item) => item.id === studio.id);
      return {
        ...current,
        studios: exists
          ? current.studios.map((item) => (item.id === studio.id ? studio : item))
          : [studio, ...current.studios],
        myStudioIds: exists ? current.myStudioIds : [studio.id, ...current.myStudioIds],
      };
    });

    return studio;
  },

  async createMine(input: Omit<Studio, "id" | "slug">): Promise<Studio> {
    const nextStudio: Studio = {
      ...input,
      id: `studio-${Date.now()}`,
      slug: toSlug(input.name),
    };

    await this.saveMine(nextStudio);
    return nextStudio;
  },

  async deleteMine(id: string): Promise<void> {
    updateMockState((current) => ({
      ...current,
      studios: current.studios.filter((studio) => studio.id !== id),
      myStudioIds: current.myStudioIds.filter((studioId) => studioId !== id),
    }));
  },
};
