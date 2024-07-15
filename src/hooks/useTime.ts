import { useState } from "react";
import { useInterval } from "usehooks-ts";

export const useTime = () => {
  const [time, setTime] = useState(new Date());

  useInterval(() => {
    setTime(new Date());
  }, 1000);

  return time;
};
