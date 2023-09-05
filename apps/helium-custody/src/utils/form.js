import v from "voca";

import availableCurrencies from "../constants/currency/availableCurrencies";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getDropdownValues = (entries, locale, captitalise = false, key = "") => {
  const options = [];
  if (entries) {
    entries.forEach((entry) => {
      const opt = { ...entry };
      const extraData = opt[key];
      const name = locale?.altLocale === "ar-sa" ? opt.nameAr : opt.name;
      let push = opt.type !== "currency";
      if (
        availableCurrencies &&
        Array.isArray(availableCurrencies) &&
        availableCurrencies.includes(name)
      )
        push = true;
      push &&
        options.push({
          label: captitalise ? v.capitalize(name) : name,
          value: opt.id,
          meta: extraData,
        });
    });
  }
  return options;
};

export { delay, getDropdownValues };
