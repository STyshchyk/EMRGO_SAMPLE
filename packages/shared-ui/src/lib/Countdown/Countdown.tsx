import React, { useEffect, useState } from "react";

import dayjs, { Dayjs } from "dayjs";

interface ICountdownProps {
  comparisonDate: Dayjs;
}

const getDifferenceInSeconds = (comparisonDate: Dayjs) => {
  const currentDate = dayjs();
  const differenceInSeconds = comparisonDate.diff(currentDate, "second");
  return differenceInSeconds;
};

const getFormattedTimeRemaining = (differenceInSeconds: number) => {
  const date = new Date(0);
  date.setSeconds(differenceInSeconds);
  const result = date.toISOString().slice(11, 19);
  return result;
};

export const Countdown: React.FC<ICountdownProps> = ({ comparisonDate }) => {
  const [timeRemaining, setTimeRemaining] = useState(
    getFormattedTimeRemaining(getDifferenceInSeconds(comparisonDate))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const differenceInSeconds = getDifferenceInSeconds(comparisonDate);
      const formattedResult = getFormattedTimeRemaining(differenceInSeconds);

      setTimeRemaining(formattedResult);

      if (differenceInSeconds <= 0) {
        clearInterval(timer);
        setTimeRemaining("");
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [comparisonDate]);

  return <p>{timeRemaining}</p>;
};
