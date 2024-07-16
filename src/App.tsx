import { CardBase, Field } from "@/components/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TaskIcon } from "./assets/icons";
import { Timer, Trackings } from "./components/core";
import { useTime } from "./hooks/useTime";
import { useTracker } from "./store/useTracker";
import { shortString } from "./utils/strings";
import { formatDuration, timeDiff } from "./utils/times";
import { groupTrackings } from "./actions/groupTrackings";

export const App = () => {
  const { register, watch, reset } = useForm<{ report: string }>({
    defaultValues: { report: "" },
  });
  const { current, trackings, start, stop } = useTracker();
  const time = useTime();

  const report = watch("report");
  const dateTracks = groupTrackings(trackings);

  const currentDuration = formatDuration(timeDiff(current.start || time, time));

  useEffect(() => {
    if (current.start) {
      document.title = `${currentDuration} - ${shortString(report, 14) || "Tracking"}`;
    } else {
      document.title = "Учёт времени";
    }
  }, [time, current, currentDuration, report]);

  return (
    <>
      <CardBase width={512}>
        <Field
          icon={<TaskIcon />}
          placeholder="Задача..."
          autoComplete="off"
          {...register("report")}
        />
        <Timer
          time={time}
          current={current}
          onStart={() => {
            start();
          }}
          onStop={() => {
            stop(report);
            reset();
          }}
        />
      </CardBase>
      <div style={{ width: 512, marginTop: 16, gap: 8 }}>
        {Object.entries(dateTracks).map(([dateTimeKey, tracks]) => (
          <Trackings key={dateTimeKey} dateTime={dateTimeKey} tracks={tracks} />
        ))}
      </div>
    </>
  );
};
