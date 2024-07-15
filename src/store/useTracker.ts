import { getDate } from "@/utils/dates";
import { timeDiff } from "@/utils/times";
import { create } from "zustand";

export type TTracking = {
  start: Date | null;
  end: Date | null;
  report?: string;
};

interface ITrackerStore {
  current: TTracking;
  trackings: TTracking[];
  start: () => void;
  stop: (report?: string) => void;
}

export const useTracker = create<ITrackerStore>((set) => ({
  current: {
    start: null,
    end: null,
  },
  trackings: [],
  start: () =>
    set(() => ({
      current: {
        start: new Date(),
        end: null,
      },
    })),
  stop: (report?: string) =>
    set((state) => {
      const completedTracking = {
        ...state.current,
        end: new Date(),
        report,
      };

      return {
        trackings: [...state.trackings, completedTracking],
        current: {
          start: null,
          end: null,
        },
      };
    }),
}));

export const getTrackings = (trackings: TTracking[], date: Date) => {
  return trackings.filter((track) => {
    const dateString = date.toDateString();

    if (!track.start || !track.end) {
      return false;
    }

    const startDateString = track.start.toDateString();
    const endDateString = track.end.toDateString();

    return startDateString === dateString || endDateString === dateString;
  });
};

export const groupTrackingsByDateTime = (trackings: TTracking[]) => {
  return trackings.reduce(
    (acc, tracking) => {
      if (tracking.start && tracking.end) {
        const dateTimeKey = getDate(tracking.start);
        if (!acc[dateTimeKey]) {
          acc[dateTimeKey] = [];
        }
        acc[dateTimeKey].push(tracking);
      }
      return acc;
    },
    {} as Record<string, TTracking[]>,
  );
};

export const calculateTotalDuration = (trackings: TTracking[]) => {
  return trackings.reduce(
    (totalDuration, tracking) => {
      if (tracking.start && tracking.end) {
        const duration = timeDiff(tracking.start, tracking.end);
        totalDuration.hours += duration.hours || 0;
        totalDuration.minutes += duration.minutes || 0;
        totalDuration.seconds += duration.seconds || 0;
      }
      return totalDuration;
    },
    { hours: 0, minutes: 0, seconds: 0 },
  );
};
