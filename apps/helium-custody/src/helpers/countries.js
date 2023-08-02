import find from "lodash.find";
import sortby from "lodash.sortby";

const normalisedCountries = (countries) => {
  const topCountriesArray = ["SA", "AE", "GB", "US"];
  const topCountries = [];

  topCountriesArray.forEach((country) => {
    const foundCountry = find(countries, ["label", country]);
    topCountries.push(foundCountry);
  });

  const filteredCountries = countries?.filter(
    (country) => !topCountriesArray.includes(country.label)
  );

  const sortedCountries = sortby(filteredCountries, ["label"]);
  return [...topCountries, ...sortedCountries];
};

export default normalisedCountries;
