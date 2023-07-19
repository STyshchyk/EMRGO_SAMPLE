const convertToDateOnlyInISOFormat = (date) => {
  if (date instanceof Date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    return date.toISOString();
  }

  throw new Error('convertToDateOnlyInISOFormat: Invalid argument type, expected Date object');
};

export default convertToDateOnlyInISOFormat;
