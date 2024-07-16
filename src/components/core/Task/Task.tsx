import { TTracking } from "@/store/useTracker";

import styles from "./Task.module.css";
import { formatDuration, formatTime, timeDiff } from "@/utils/times";
import { IconButton } from "@/components/ui";
import { CloseIcon } from "@/assets/icons";

type Props = {
  onDelete?: (id: string) => void;
  track: TTracking;
};

export const Task = ({ track, onDelete }: Props) => {
  const diff = timeDiff(track.start!, track.end!);
  const duration = formatDuration(diff);

  const start = track.start && formatTime(track.start);
  const end = track.end && formatTime(track.end);

  return (
    <div className={styles.TrackItem}>
      <span className={styles.Text}>{track.report}</span>
      <div className={styles.TrackDuration}>{`${start} - ${end}`}</div>
      <span className={styles.TrackDuration}>{duration}</span>
      <IconButton
        icon={<CloseIcon />}
        isInline
        onClick={() => onDelete && onDelete(track.id)}
      />
    </div>
  );
};
