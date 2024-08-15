import { DownloadIcon } from "@/assets/icons";
import { CardBase, IconButton } from "@/components/ui";
import { TTracking, useTracker } from "@/store/useTracker";
import { formatDuration } from "@/utils/times";
import { format, parse } from "date-fns";

import styles from "./Trackings.module.css";
import { Task } from "../Task";
import { totalDuration } from "@/actions/totalDuration";
import { generatePDF } from "@/actions/exportPdf";

type Props = {
  dateTime: string;
  tracks: TTracking[];
};

export const Trackings = ({ dateTime, tracks }: Props) => {
  const { deleteTrack, updateTrack } = useTracker();

  const date = parse(dateTime, "yyyy-MM-dd", new Date());
  const formatted = format(date, "yyyy.MM.dd");
  const total = totalDuration(tracks);
  const totalDurationFormatted = formatDuration(total);

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
        {tracks.map((track, i) => (
          <Task
            key={i}
            track={track}
            onDelete={deleteTrack}
            onUpdate={updateTrack}
          />
        ))}
      </div>
    </CardBase>
  );
};
