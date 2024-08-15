import { TTracking } from "@/store/useTracker";

import styles from "./Task.module.css";
import {
  formatDuration,
  formatTime,
  timeDiff,
  timeStringToDate,
} from "@/utils/times";
import { IconButton } from "@/components/ui";
import { CloseIcon } from "@/assets/icons";
import { useState } from "react";
import { format, parse } from "date-fns";

type Props = {
  onDelete?: (id: string) => void;
  track: TTracking;
  onUpdate?: (track: TTracking) => void;
};

export const Task = ({ track, onDelete, onUpdate }: Props) => {
  const start = track.start && formatTime(track.start);
  const end = track.end && formatTime(track.end);

  const [editable, setEditable] = useState(false);

  const [editReport, setReport] = useState(track.report || "");
  const [editStart, setStart] = useState(start || "00:00");
  const [editEnd, setEnd] = useState(end || "00:00");
  const [editDate, setEditDate] = useState(
    format(track.start || new Date(), "yyyy-MM-dd")
  );

  const diff = timeDiff(track.start!, track.end!);
  const duration = formatDuration(diff);

  const handleUpdate = () => {
    if (onUpdate) {
      const d = parse(editDate, "yyyy-MM-dd", new Date());

      const updatedTrack: TTracking = {
        ...track,
        report: editReport,
        start: timeStringToDate(d, editStart),
        end: timeStringToDate(d, editEnd),
      };
      onUpdate(updatedTrack);
    }
    setEditable(false);
  };

  return (
    <div
      className={styles.TrackItem}
      onDoubleClick={() => setEditable((e) => !e)}
    >
      <span className={styles.Text}>
        {editable ? (
          <input
            value={editReport}
            onChange={(e) => setReport(e.target.value)}
            onBlur={handleUpdate}
          />
        ) : (
          track.report
        )}
      </span>
      <div className={styles.TrackDuration}>
        {editable && (
          <input
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            onBlur={handleUpdate}
          />
        )}
        {editable ? (
          <div className={styles.Inputs}>
            <input
              value={editStart}
              className={styles.InputValue}
              onChange={(e) => setStart(e.target.value)}
              onBlur={handleUpdate}
            />
            <span>-</span>
            <input
              value={editEnd}
              className={styles.InputValue}
              onChange={(e) => setEnd(e.target.value)}
              onBlur={handleUpdate}
            />
          </div>
        ) : (
          `${start} - ${end}`
        )}
      </div>
      <span className={styles.TrackDuration}>{duration}</span>
      <IconButton
        icon={<CloseIcon />}
        isInline
        onClick={() => onDelete && onDelete(track.id)}
      />
    </div>
  );
};
