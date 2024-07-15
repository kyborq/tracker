import { CardBase, Field, IconButton } from "@/components/ui";
import { PauseIcon, PlayIcon, TaskIcon } from "./assets/icons";
import { useTime } from "./hooks/useTime";
import {
  calculateTotalDuration,
  groupTrackingsByDateTime,
  useTracker,
} from "./store/useTracker";
import { formatDuration, timeDiff } from "./utils/times";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { shortString } from "./utils/strings";

export const App = () => {
  const { register, watch, reset } = useForm<{ report: string }>({
    defaultValues: { report: "" },
  });
  const { current, trackings, start, stop } = useTracker();
  const time = useTime();

  const report = watch("report");
  const dateTracks = groupTrackingsByDateTime(trackings);

  const currentDuration = formatDuration(timeDiff(current.start || time, time));

  useEffect(() => {
    if (current.start) {
      document.title = `${shortString(report, 14) || "Tracking"} ${currentDuration}`;
    } else {
      document.title = "Tracker";
    }
  }, [time, current, currentDuration, report]);

  return (
    <>
      <CardBase width={512}>
        <Field
          icon={<TaskIcon />}
          placeholder="Задача..."
          {...register("report")}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#e9ecef",
            borderRadius: 16,
            paddingLeft: 16,
          }}
        >
          <span style={{ width: 64, fontWeight: 700 }}>
            {formatDuration(timeDiff(current.start || time, time))}
          </span>
          <IconButton
            icon={current.start ? <PauseIcon /> : <PlayIcon />}
            onClick={() => {
              if (current.start) {
                stop(report);
                reset();
              } else {
                start();
              }
            }}
          />
        </div>
      </CardBase>
      <div style={{ width: 512, marginTop: 16 }}>
        {Object.entries(dateTracks).map(([dateTimeKey, tracks]) => (
          <CardBase key={dateTimeKey}>
            <div style={{ padding: 16 }}>
              <strong>
                {dateTimeKey} {formatDuration(calculateTotalDuration(tracks))}
              </strong>
              {tracks.map((track, i) => (
                <div key={i}>
                  {track.report} -{" "}
                  {formatDuration(timeDiff(track.start!, track.end!))}
                </div>
              ))}
            </div>
          </CardBase>
        ))}
      </div>
    </>
  );
};
