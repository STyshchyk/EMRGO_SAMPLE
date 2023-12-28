import moment from "moment";

export const dateWithinRange = (date, startDate, endDate) => {
  const momentDate = moment(date);
  const momentStartDate = moment(startDate);
  const momentEndDate = moment(endDate);

  return momentDate.isSameOrAfter(momentStartDate) && momentDate.isSameOrBefore(momentEndDate);
};

export const isValidDate = (dateString) => {
  // not sure BE bug? returning 0001/01/01 so omit it out as valid now
  if (dateString === "0001-01-01T00:00:00Z") {
    return false; // Special case: "0001-01-01T00:00:00Z" is not a valid date
  }

  const date = moment(dateString, moment.ISO_8601, true);
  return date.isValid();
};
