import { DownloadIcon } from "@/assets/icons";
import { CardBase, IconButton } from "@/components/ui";
import {
  calculateTotalDuration,
  generatePDF,
  TTracking,
} from "@/store/useTracker";
import { formatDuration, timeDiff } from "@/utils/times";
import { format, parse } from "date-fns";

import styles from "./Trackings.module.css";

type Props = {
  dateTime: string;
  tracks: TTracking[];
};

export const Trackings = ({ dateTime, tracks }: Props) => {
  const date = parse(dateTime, "yyyy-MM-dd", new Date());
  const formatted = format(date, "yyyy.MM.dd");
  const totalDuration = calculateTotalDuration(tracks);
  const totalDurationFormatted = formatDuration(totalDuration);

  return (
    <CardBase isColumn>
      <div className={styles.TrackingsContainer}>
        <span className={styles.TrackingsDate}>{formatted}</span>
        <div className={styles.TrackingsDurationContainer}>
          <span className={styles.TrackingsDuration}>
            {totalDurationFormatted}
          </span>
          <IconButton
            icon={<DownloadIcon />}
            onClick={() => generatePDF(tracks)}
            isInline
          />
        </div>
      </div>

      <div className={styles.TrackingsList}>
        {tracks.map((track, i) => {
          const diff = timeDiff(track.start!, track.end!);
          const duration = formatDuration(diff);

          return (
            <div key={i} className={styles.TrackItem}>
              <span>{track.report}</span>
              <span className={styles.TrackDuration}>{duration}</span>
            </div>
          );
        })}
      </div>
    </CardBase>
  );
};
