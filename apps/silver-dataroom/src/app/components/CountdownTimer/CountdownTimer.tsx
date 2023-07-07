import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
export const CountdownTimer = ({ date }: { date: string }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const validDate = dayjs(date).isValid();
  if (!validDate) return <span></span>;
  const updateTimer = () => {
    const now = dayjs().tz("Asia/Dubai").format();
    const targetDate = dayjs(date);
    const difference = targetDate.diff(now);

    if (difference <= 0) {
      setTimeLeft("");
      return;
    }

    const duration = dayjs.duration(difference);
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (days > 0) {
      setTimeLeft(`${days} day${days > 1 ? "s" : ""}`);
    } else if (hours > 0) {
      setTimeLeft(`${hours} hour${hours > 1 ? "s" : ""}`);
    } else if (minutes > 5) {
      setTimeLeft(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    } else {
      setTimeLeft(`${minutes} minute${minutes > 1 ? "s" : ""} ${seconds} second${seconds > 1 ? "s" : ""}`);
    }
  };
  useEffect(() => {
    const now = dayjs().tz("Asia/Dubai").format();
    const targetDate = dayjs(date);
    const difference = targetDate.diff(now);

    if (difference > 0 && difference <= 86400000) {
      const interval = setInterval(updateTimer, 1000);
      return () => {
        clearInterval(interval);
      };
    } else {
      updateTimer();
    }
  }, [date]);

  return <div>{timeLeft}</div>;
};

export default CountdownTimer;
