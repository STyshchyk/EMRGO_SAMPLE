import { ReactNode } from "react";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relative from "dayjs/plugin/relativeTime";
import voca from "voca";

import { Countdown } from "../Countdown";

dayjs.extend(relative);
dayjs.extend(duration);

export const currencyRenderer = (amount: number) => {
  const language = "en";
  const formatted = Intl.NumberFormat(language, { notation: "compact" }).format(amount);
  return formatted === "NaN" ? undefined : formatted;
};

export const timeLeftRenderer = (date: string) => {
  const currentDate = dayjs();
  const comparisonDate = dayjs(date);

  let formatted: string | ReactNode = "";

  if (comparisonDate.isBefore(currentDate)) {
    formatted = "";
  } else {
    const differenceInDays = comparisonDate.diff(currentDate, "day");

    if (differenceInDays === 0) {
      // Less than a day

      formatted = <Countdown comparisonDate={comparisonDate} />;
      // formatted = (
      //   <div>
      //     <p>hello</p>
      //   </div>
      // );
    }

    if (differenceInDays > 0 && differenceInDays <= 30) {
      // More than a day & Less than a month
      const differenceDuration = dayjs.duration(comparisonDate.diff(currentDate));
      const humanized = differenceDuration.humanize();
      formatted = voca.capitalize(humanized);
    }

    if (differenceInDays > 30 && differenceInDays <= 365) {
      // More than a month & Less than a year
      const differenceDuration = dayjs.duration(comparisonDate.diff(currentDate));
      const humanized = differenceDuration.humanize();
      formatted = voca.capitalize(humanized);
    }

    if (differenceInDays > 365) {
      // More than a year
      const differenceDuration = dayjs.duration(comparisonDate.diff(currentDate));
      const humanized = differenceDuration.humanize();
      formatted = voca.capitalize(humanized);
    }
  }
  return formatted;
};
