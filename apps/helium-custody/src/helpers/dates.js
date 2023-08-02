import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

const findDateRange = (type) => {
  let startDate = moment();
  let endDate = moment();

  switch (type) {
    case "today":
      startDate.startOf("day");
      endDate.endOf("day");
      break;
    case "week":
      startDate.startOf("week");
      endDate.endOf("day");
      break;
    case "seven":
      startDate.subtract(7, "days").startOf("day");
      endDate.endOf("day");
      break;
    case "month":
      startDate.startOf("month");
      endDate.endOf("day");
      break;
    case "thirty":
      startDate.subtract(30, "days").startOf("day");
      endDate.endOf("day");
      break;
    case "quarter":
      startDate.startOf("quarter");
      endDate.endOf("day");
      break;
    case "year":
      startDate.startOf("year");
      endDate.endOf("day");
      break;
    case "all":
      startDate.subtract(3, "years").startOf("year");
      endDate.endOf("day");
      break;
    default:
      if (typeof type === "object") {
        startDate = type.startDate;
        endDate = type.endDate;
      }
    // code block
  }

  return {
    defaultStartDate: type === "none" ? null : startDate,
    defaultEndDate: type === "none" ? null : endDate,
  };
};

export const findOverlaps = (dateranges, includeAdjacent = false) => {
  /*
  Requires each object in the array to have
  {
    id
    start_date
    end_date
  }
  */

  let overlaps = [];
  let free = [];
  dateranges.forEach((outerPeriod) => {
    const outerPeriodStartDate = moment(outerPeriod.start_date).startOf("day");
    const outerPeriodEndDate = moment(outerPeriod.end_date).endOf("day");
    const outerRange = moment.range(outerPeriodStartDate, outerPeriodEndDate);
    let outerOverlap = false;
    dateranges.forEach((innerPeriod) => {
      if (outerPeriod.id !== innerPeriod.id) {
        const innerPeriodStartDate = moment(innerPeriod.start_date).startOf("day");
        const innerPeriodEndDate = moment(innerPeriod.end_date).endOf("day");
        const innerRange = moment.range(innerPeriodStartDate, innerPeriodEndDate);
        if (outerRange.overlaps(innerRange, { adjacent: includeAdjacent })) {
          overlaps.push([outerPeriod.id, innerPeriod.id].sort());
          outerOverlap = true;
        }
      }
    });

    if (!outerOverlap) {
      free.push(outerPeriod);
    }
  });
  overlaps = Array.from(new Set(overlaps.map(JSON.stringify)), JSON.parse);
  free = Array.from(new Set(free.map(JSON.stringify)), JSON.parse);

  const processedPeriods = overlaps.map((overlap) => {
    const foundFirstPeriod = dateranges.find((period) => period.id === overlap[0]);
    const foundSecondPeriod = dateranges.find((period) => period.id === overlap[1]);
    return [foundFirstPeriod, foundSecondPeriod];
  });

  return { overlaps: processedPeriods, free };
};

export default findDateRange;
