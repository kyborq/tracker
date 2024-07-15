import { Duration, interval, intervalToDuration } from "date-fns";

export const formatDuration = (duration: Duration) => {
  const pad = (num?: number) => String(num || 0).padStart(2, "0");
  const segments = [duration.hours, duration.minutes, duration.seconds];

  return segments.map(pad).join(":");
};

export const timeDiff = (date1: Date, date2: Date) => {
  const diff = interval(date1, date2);
  const duration = intervalToDuration(diff);
  return duration;
};
