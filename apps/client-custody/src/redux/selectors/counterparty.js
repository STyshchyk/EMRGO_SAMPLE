import { createSelector } from "reselect";

export const selectCounterpartyData = (state) => state.counterparty.counterpartyList;
export const selectIsFetching = (state) => state.counterparty.isFetching;
export const selectIsRequesting = (state) => state.counterparty.isRequesting;
export const selectCounterpartySSIData = (state) => state.counterparty.counterpartySSIList;

export const selectCounterpartyList = createSelector([selectCounterpartyData], (counterparties) => {
  if (counterparties?.length > 0) {
    return counterparties?.map((item) => ({
      id: item.id,
      entityId: item?.entity
        ? { label: item.entity?.corporateEntityName, value: item.entity?.id }
        : null,
      counterpartyId: item.counterpartyId,
      shortName: item.shortName,
      longName: item.longName,
      status: item?.status ? { label: item.status, value: item.status } : null,
      createdAt: item?.createdAt,
    }));
  }

  return [];
});

export const selectCounterpartySSIList = createSelector(
  [selectCounterpartySSIData],
  (counterpartiesSSI) => {
    if (counterpartiesSSI?.length > 0) {
      return counterpartiesSSI?.map((item) => ({
        id: item.id,
        entityId: item?.entity
          ? { label: item.entity?.corporateEntityName, value: item.entity?.id }
          : null,
        counterpartyId: item?.counterparty
          ? { label: item.counterparty?.counterpartyId, value: item.counterparty?.id }
          : null,
        longName: item?.counterparty
          ? { label: item?.counterparty?.longName, value: item?.counterparty?.longName }
          : null,
        ssiLabel: item.ssiLabel,
        settlementLocationId: item?.settlementLocation
          ? { label: item.settlementLocation?.name, value: item.settlementLocation?.id }
          : null,
        deliveryAgentIdentifierTypeId: item?.deliveryAgentIdentifierType
          ? {
              label: item.deliveryAgentIdentifierType?.name,
              value: item.deliveryAgentIdentifierType?.id,
            }
          : null,
        deliveryAgentIdentifier: item?.deliveryAgentIdentifier,
        sellerIdentifierTypeId: item?.sellerIdentifierType
          ? { label: item.sellerIdentifierType?.name, value: item.sellerIdentifierType?.id }
          : null,
        sellerIdentifier: item?.sellerIdentifier,
        safekeepingAccount: item?.safekeepingAccount,
        createdAt: item?.createdAt,
        status: item?.status,
      }));
    }

    return [];
  }
);

export const selectdropdownData = (state) => state.counterparty.dropdownData;
export const selectAllCounterparties = (state) => state.counterparty.counterpartyList;
