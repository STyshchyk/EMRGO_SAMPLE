import orderby from "lodash.orderby";
import { createSelector } from "reselect";

export const selectExternalSecuritiesData = (state) =>
  state.externalSecurities.externalSecuritiesData;

export const selectIsFetching = (state) => state.externalSecurities.isFetching;
export const selectIsRequesting = (state) => state.externalSecurities.isRequesting;

export const selectExternalSecuritiesList = createSelector(
  [selectExternalSecuritiesData],
  (externalSecuritiesData) => {
    if (Array.isArray(externalSecuritiesData) && externalSecuritiesData?.length > 0) {
      return externalSecuritiesData?.map((item) => ({
        country: item?.country ? { label: item.country.name, value: item.country.id } : null,
        countryId: item.countryId,
        createdAt: item.createdAt,
        currency: item.currency,
        currencyName: item?.currencyName
          ? { label: item.currencyName.name, value: item.currencyName.id }
          : null,
        denomination: item.denomination,
        denominationName: item?.denominationName
          ? { label: item.denominationName.value, value: item.denominationName.id }
          : null,
        frequency: item.frequency,
        frequencyName: item?.frequencyName
          ? { label: item.frequencyName.name, value: item.frequencyName.id }
          : null,
        id: item.id,
        isin: item.isin,
        issuanceAmount: item.issuanceAmount,
        issuanceName: item.issuanceName,
        issueDate: item?.issueDate,
        longName: item.longName,
        maturityDate: item?.maturityDate,
        name: item.name,
        profitRate: item.profitRate,
        shortName: item.shortName,
        status: item?.status ? { label: item.status, value: item.status } : null,
        ticker: item.ticker,
        wsn: item.wsn,
        isPrimaryIssuance: Boolean(item.isPrimaryIssuance),
      }));
    }

    return [];
  }
);

export const selectAllExternalSecurities = createSelector(
  [selectExternalSecuritiesData],
  (externalSecuritiesList) => {
    if (Array.isArray(externalSecuritiesList) && externalSecuritiesList.length > 0) {
      const fixed = externalSecuritiesList.map((item) => ({
        ...item,
        // countryOfRisk: item.country,
        // securityLongName: item?.longName,
        // securityShortName: item?.shortName,
        // coupons:item?.coupons,
        isin: item?.isin ?? item?.attributes.find(attribute => attribute.match.key === 'isin')?.value
      }));

      return orderby(fixed, ["name"], ["asc"]);
    }

    return [];
  }
);

export const selectExternalSecuritySearchResultsRaw = (state) =>
  state.externalSecurities.listOfExternalSecuritySearchResults;
export const selectExternalSecuritySearchResults = createSelector(
  [selectExternalSecuritySearchResultsRaw],
  (externalSecuritySearchResults) => {
    if (Array.isArray(externalSecuritySearchResults) && externalSecuritySearchResults.length > 0) {
      // const deduped = Array.from(new Set(externalSecuritySearchResults.map((item) => item.externalSecurityId))).sort();

      return externalSecuritySearchResults.map((item) => ({
        externalSecurityId: item.externalSecurityId,
        identifier: item.identifier,
        match: item.match,
        securityName: item.securityName,
      }));
    }

    return [];
  }
);
