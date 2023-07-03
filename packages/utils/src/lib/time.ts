import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relative from "dayjs/plugin/relativeTime";

dayjs.extend(relative);
dayjs.extend(duration);

export const humaniseTime = (date: Date) => {
  const currentDate = dayjs();
  const comparisonDate = dayjs(date);

  const differenceDuration = dayjs.duration(comparisonDate.diff(currentDate));

  const humanized = differenceDuration.humanize(true);

  return humanized;
};

export const timeLeft = (date: string) => {
  const currentDate = dayjs();
  const comparisonDate = dayjs(date);

  const timeToDate = currentDate.to(comparisonDate, true);
  return timeToDate;
};
