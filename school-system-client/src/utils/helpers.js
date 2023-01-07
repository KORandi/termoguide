import { TIME_IN_MS } from "../config/constants";
import dayjs from "dayjs";

export function timerSetter(interval, initialStep) {
  const day = dayjs().set("second", 0).set("millisecond", 0);
  const step = initialStep - 1;
  let roundedMinutes = 0;
  switch (interval) {
    case TIME_IN_MS.MINUTE:
      return day.subtract(step, "minute");
    case TIME_IN_MS.FIVE_MINUTES:
      const d = day.subtract(step * 5, "minute");
      roundedMinutes = Math.round(d.get("minute") / 10) * 10;
      return d.set("minute", roundedMinutes);
    case TIME_IN_MS.TEN_MINUTES:
      roundedMinutes = Math.round(day.get("minute") / 10) * 10;
      return day.subtract(step * 10, "minute").set("minute", roundedMinutes);
    case TIME_IN_MS.HOUR:
      return day.subtract(step, "hour").set("minute", 0);
    case TIME_IN_MS.DAY:
      return day.subtract(step, "day").set("minute", 0).set("hour", 0);
    case TIME_IN_MS.WEEK:
      return day.subtract(step, "week").set("minute", 0).set("hour", 0);
    case TIME_IN_MS.MONTH:
      return day.subtract(step, "month").set("minute", 0).set("hour", 0);
    default:
      return day;
  }
}
