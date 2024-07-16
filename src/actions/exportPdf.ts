import { TTracking } from "@/store/useTracker";
import { formatDuration, formatTime } from "@/utils/times";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import jsPDF from "jspdf";
import { groupTrackings } from "./groupTrackings";
import { totalDuration } from "./totalDuration";

export const generatePDF = (trackings: TTracking[]) => {
  const doc = new jsPDF();

  doc.addFont("/Montserrat-Medium.ttf", "MyFont", "normal");
  doc.addFont("/JetBrainsMono-Regular.ttf", "MyFontMono", "normal");
  doc.setFont("MyFont");

  doc.setFontSize(18);
  doc.text("Отчёт о проделанной работе", 20, 20);

  const groupedTrackings = groupTrackings(trackings);
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
      const duration = totalDuration([track]);
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
  const total = totalDuration(trackings);
  const totalDurationString = formatDuration(total, true);

  // const totalHours = totalDuration.hours + totalDuration.minutes / 60;
  // const ratePerHour = 1000; // Стоимость часа работы
  // const totalCost = totalHours * ratePerHour;

  doc.setFontSize(14);
  doc.setFont("MyFontMono");

  doc.text(`Итого:`, 20, 270);
  doc.text(`${totalDurationString}`, 176, 270);

  doc.save(`${d.toDateString()} - Отчёт.pdf`);
};
