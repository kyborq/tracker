import { uuid4 } from "@/utils/uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TTracking = {
  id: string;
  start: Date | null;
  end: Date | null;
  report?: string;
  project?: string;
};

interface ITrackerStore {
  current: TTracking;
  trackings: TTracking[];
  start: () => void;
  stop: (report?: string, project?: string) => void;
  deleteTrack: (trackId: string) => void;
}

export const useTracker = create(
  persist<ITrackerStore>(
    (set) => ({
      current: {
        id: uuid4(),
        start: null,
        end: null,
      },
      trackings: [],
      start: () =>
        set(() => ({
          current: {
            id: uuid4(),
            start: new Date(),
            end: null,
          },
        })),
      stop: (report?: string, project?: string) =>
        set((state) => {
          const completedTracking = {
            ...state.current,
            end: new Date(),
            report,
            project,
          };

          return {
            trackings: [...state.trackings, completedTracking],
            current: {
              id: uuid4(),
              start: null,
              end: null,
            },
          };
        }),
      deleteTrack: (trackId: string) =>
        set((state) => ({
          trackings: state.trackings.filter((track) => trackId !== track.id),
        })),
    }),
    { name: "trackings" },
  ),
);
