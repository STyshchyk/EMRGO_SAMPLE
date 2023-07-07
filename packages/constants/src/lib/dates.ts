import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
export const MIN_DATE = dayjs().add(1, "day").tz("Asia/Dubai").format();
