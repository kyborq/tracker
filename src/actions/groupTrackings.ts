import { TTracking } from "@/store/useTracker";
import { getDate } from "@/utils/dates";

export const groupTrackings = (trackings: TTracking[]) => {
  return trackings.reduce((acc, tracking) => {
    if (tracking.start && tracking.end) {
      const dateTimeKey = getDate(tracking.start);
      console.log(dateTimeKey);
      if (!acc[dateTimeKey]) {
        acc[dateTimeKey] = [];
      }
      acc[dateTimeKey].push(tracking);
    }
    return acc;
  }, {} as Record<string, TTracking[]>);
};
