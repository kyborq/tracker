import { TTracking } from "@/store/useTracker";
import { timeDiff } from "@/utils/times";

export const totalDuration = (trackings: TTracking[]) => {
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
