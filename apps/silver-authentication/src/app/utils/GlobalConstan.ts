import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
export const MIN_DATE = dayjs().add(1, "day").tz("Asia/Dubai").format();

export function compareDates(date2: string): string {
  const today = MIN_DATE,
    compareDate = new Date(date2);
  // if (today > compareDate) return today.toISOString().split("T")[0].toString();
  return compareDate.toISOString().split("T")[0].toString();
}

export function convertDate(date1: string): string {
  const date = new Date(date1).toISOString().split("T")[0];
  return date;
}

export function convertDateModify(date1: string | undefined): string {
  if (date1 == null) return MIN_DATE.split("T")[0].toString();
  const date = new Date(date1).toISOString().split("T")[0].toString();
  return date;
}

export function trimDate(date: string): string {
  return date.substring(0, 16).replace("T", " ");
}
