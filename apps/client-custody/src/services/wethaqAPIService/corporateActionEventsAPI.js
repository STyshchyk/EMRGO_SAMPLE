import { baseAxiosInstance } from "./helpers";

const getCorporateActionEventsList = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/externalSecurities/v1/externalSecurities/corporateEvents`,
  });

const cancelCorporateActionEvent = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/externalSecurities/v1/externalSecurities/corporateEvents/${payload.corporateActionEventId}/cancel`,
  });

const addCorporateActionEvent = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/externalSecurities/v1/externalSecurities/corporateEvents`,
    data: payload.requestPayload,
  });

const editCorporateActionEvent = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/externalSecurities/v1/externalSecurities/corporateEvents/${payload.corporateActionEventId}`,
    data: payload.requestPayload,
  });

const submitCAEventClientResponse = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.requestPayload,
    url: `/externalSecurities/v1/externalSecurities/corporateEvents/${payload.corporateActionEventId}/response`,
  });

const getCorporationActionEvent = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/externalSecurities/v1/externalSecurities/corporateEvents/${payload.corporateActionEventId}`,
  });

const corporateActionEventsAPI = {
  getCorporateActionEventsList,
  cancelCorporateActionEvent,
  addCorporateActionEvent,
  editCorporateActionEvent,
  submitCAEventClientResponse,
  getCorporationActionEvent,
};

export default corporateActionEventsAPI;
