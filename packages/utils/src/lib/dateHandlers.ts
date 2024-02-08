import { MIN_DATE } from "@emrgo-frontend/constants";
import dayjs from "dayjs";

export const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";
export const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} HH:mm:ss`;
export const DEFAULT_DATE_TIME_FORMAT_SM = `ddd ${DEFAULT_DATE_FORMAT} HH:mm A `;

export function compareDates(date2: string): string {
  const today = MIN_DATE,
    compareDate = new Date(date2);
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

export const dateFormatter = (date: Date, format?: string) => {
  if (!date) return "";
  return dayjs(date).format(format || "DD/MM/YYYY");
};

export const customDateFormat = (date: Date | null | undefined): string => {
  if (!date) return "N/A";
  const currentDate = dayjs();
  const inputDate = dayjs(date);

  if (currentDate.isSame(inputDate, "day")) {
    return inputDate.format("HH:mm");
  }
  if (currentDate.isSame(inputDate, "week")) {
    return inputDate.format("ddd MM/D");
  }
  return inputDate.format("D/M/YYYY");
};
