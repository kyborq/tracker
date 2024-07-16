import { getDate } from "@/utils/dates";
import { formatDuration, formatTime, timeDiff } from "@/utils/times";
import { uuid4 } from "@/utils/uuid";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import jsPDF from "jspdf";
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

  doc.addFont("/Montserrat-Medium.ttf", "MyFont", "normal");
  doc.addFont("/JetBrainsMono-Regular.ttf", "MyFontMono", "normal");
  doc.setFont("MyFont");

  doc.setFontSize(18);
  doc.text("Отчёт о проделанной работе", 20, 20);

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

    doc.text(`Задача`, 20, currentY);
    doc.text(`Начало`, 100, currentY);
    doc.text(`Конец`, 130, currentY);
    doc.text(`Итого`, 177, currentY);

    currentY += 10;

    tracksOnDate.forEach((track) => {
      const duration = calculateTotalDuration([track]);
      const totalDurationString = formatDuration(duration, true);

      const report = track.report || "Задача";

      doc.text(` • ${report}`, 20, currentY);

      doc.setFont("MyFontMono");
      doc.text(`${formatTime(track.start!)}`, 101, currentY);
      doc.text(`${formatTime(track.end!)}`, 130, currentY);
      doc.text(`${totalDurationString}`, 178, currentY);
      doc.setFont("MyFont");

      currentY += 10;
    });
  }

  doc.line(20, 250, 190, 250);
  const totalDuration = calculateTotalDuration(trackings);
  const totalDurationString = formatDuration(totalDuration, true);

  // const totalHours = totalDuration.hours + totalDuration.minutes / 60;
  // const ratePerHour = 1000; // Стоимость часа работы
  // const totalCost = totalHours * ratePerHour;

  doc.setFontSize(14);
  doc.setFont("MyFontMono");

  doc.text(`Итого:`, 20, 270);
  doc.text(`${totalDurationString}`, 176, 270);

  doc.save(`${d.toDateString()} - Отчёт.pdf`);
};
