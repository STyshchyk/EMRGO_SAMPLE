import appConfig from "../appConfig";

const defaultRegion = appConfig.appRegion;
// const defaultRegion = 'AE';

const regionSwitcher = (regionComponents, region) => {
  const { sa, ae } = regionComponents;
  const currentRegion = region || defaultRegion;

  switch (currentRegion) {
    case "SA":
      if (typeof sa === "function") {
        sa();
      }
      return sa;
    case "AE":
      if (typeof ae === "function") {
        ae();
      }
      return ae;
    default:
      return "";
  }
};

export default regionSwitcher;
