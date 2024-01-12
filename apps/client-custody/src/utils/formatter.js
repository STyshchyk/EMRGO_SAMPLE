import moment from "moment";

import { isValidDate } from "../helpers/table";

const toMomentObject = (date) => moment(date);

const dateFormatter = (date, format) => {
  if (!date) return "";
  if (!isValidDate(date)) return "--";
  return moment(date).format(format);
};

const decimalFormatter = (value, decimalPlace = 2) => {
  if (!value) return value;
  return Number.parseInt(value, 10).toFixed(decimalPlace);
};

// remove default when we have more than one export
export { dateFormatter, decimalFormatter, toMomentObject };
