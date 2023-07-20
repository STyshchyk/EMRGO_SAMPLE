import changeCase from "change-case";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getDropdownValues = (entries, locale, captitalise = false, key = "") => {
  const options = [];
  if (entries) {
    entries.forEach((entry) => {
      const opt = { ...entry };
      const extraData = opt[key];
      const name = locale?.altLocale === "ar-sa" ? opt.nameAr : opt.name;
      options.push({
        label: captitalise ? changeCase.titleCase(name) : name,
        value: opt.id,
        meta: extraData,
      });
    });
  }
  return options;
};

export { delay, getDropdownValues };
