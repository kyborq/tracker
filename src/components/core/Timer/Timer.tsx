import { PauseIcon, PlayIcon } from "@/assets/icons";
import { IconButton } from "@/components/ui";
import { TTracking } from "@/store/useTracker";
import { formatDuration, timeDiff } from "@/utils/times";

import styles from "./Timer.module.css";

type Props = {
  time: Date;
  current: TTracking;
  onStop?: () => void;
  onStart?: () => void;
};

export const Timer = ({ time, current, onStop, onStart }: Props) => {
  return (
    <div className={styles.Timer}>
      <span>{formatDuration(timeDiff(current.start || time, time))}</span>
      <IconButton
        icon={current.start ? <PauseIcon /> : <PlayIcon />}
        onClick={() => {
          if (current.start) {
            onStop && onStop();
          } else {
            onStart && onStart();
          }
        }}
      />
    </div>
  );
};
