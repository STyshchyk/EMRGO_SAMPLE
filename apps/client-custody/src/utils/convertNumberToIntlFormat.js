// !DEV NOTE: THE DEFAULT LOCALE IS `EN`
// TODO: UPDATE THIS FUNCTION TO ACCEPT USER PROVIDED LOCALE CODE AS AN ADDITIONAL ARGUMENT

const convertNumberToIntlFormat = (
  number = 0,
  opts = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
) => new Intl.NumberFormat('en', opts).format(number);

export default convertNumberToIntlFormat;
