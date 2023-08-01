import { createSelector } from "reselect";

export const selectCAEventsData = (state) => state.CAEvents.corporateActionEventsData;

export const selectCorporateActionEvent = (state) => state.CAEvents.corporateActionEvent;

export const selectIsFetching = (state) => state.CAEvents.isFetching;

export const selectIsFetchingEvent = (state) => state.CAEvents.isFetchingEvent;

// ! update with BE response format
export const selectCorporateActionEventsList = createSelector([selectCAEventsData], (eventData) => {
  if (Array.isArray(eventData) && eventData?.length > 0) {
    return eventData?.map((item) => ({
      exDate: item?.exDate,
      recordDate: item?.recordDate,
      paymentDate: item.paymentDate,
      securityId: item.externalSecurity?.isin,
      securityName: item?.externalSecurity?.name
        ? { label: item.externalSecurity.longName, value: item.externalSecurity.id }
        : null,
      eventType: item?.eventType,
      eventId: item?.eventId,
      eventStatus: item?.statusDropdown,
      voluntary: Boolean(item.voluntary),
      clientResponseDeadline: item?.clientResponseDeadline,
      eventTerms: item?.eventTerms,
      additionalInfo: item?.additionalInfo,
      externalSecurity: item?.externalSecurity,
      linkedEvent: item?.linkedEvent,
      id: item.id,
    }));
  }

  return [];
});
