import { getDate } from "@/utils/dates";
import { formatDuration, timeDiff } from "@/utils/times";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import jsPDF from "jspdf";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useTracker = create(
  persist<ITrackerStore>(
    (set) => ({
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
    }),
    { name: "trackings" },
  ),
);

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

export const generatePDF = (trackings: TTracking[]) => {
  const doc = new jsPDF();

  doc.addFont("/PlayfairDisplay.ttf", "MyFont", "normal");
  doc.setFont("MyFont");

  doc.setFontSize(18);
  doc.text("Отчёт о работе", 20, 20);

  const groupedTrackings = groupTrackingsByDateTime(trackings);
  let currentY = 30;

  doc.line(20, currentY + 10, 190, currentY + 10);

  const d = new Date();

  for (const [dateTime, tracksOnDate] of Object.entries(groupedTrackings)) {
    doc.setFontSize(14);
    doc.text(
      `${format(dateTime, "d MMMM yyyy", { locale: ru })}`,
      20,
      currentY,
    );
    currentY += 20;

    doc.setFontSize(12);
    tracksOnDate.forEach((track, index) => {
      const duration = calculateTotalDuration([track]);
      const durationString = formatDuration(duration);
      const report = track.report || "Задача";

      doc.text(`${index + 1} - ${report} (${durationString})`, 20, currentY);
      currentY += 10;
    });

    doc.line(20, currentY, 190, currentY);
    currentY += 15;
  }

  const totalDuration = calculateTotalDuration(trackings);
  const totalDurationString = formatDuration(totalDuration);

  // const totalHours = totalDuration.hours + totalDuration.minutes / 60;
  // const ratePerHour = 1000; // Стоимость часа работы
  // const totalCost = totalHours * ratePerHour;

  doc.setFontSize(14);
  doc.text(`Итого - ${totalDurationString}`, 20, currentY);

  doc.save(`${d.toDateString()} - Отчёт.pdf`);
};
