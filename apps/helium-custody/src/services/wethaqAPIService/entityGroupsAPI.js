import { baseAxiosInstance } from "./helpers";

const getEntityGroupDetailsByGroupID = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/entityGroups/${payload.id}`,
  });

const updateEntityGroupUserACLByUserID = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/v1/entityGroups/${payload.groupId}/users/${payload.userId}/accessControls`,

    data: payload.requestPayload,
  });

const addEntityGroup = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: "/v1/entityGroups",
    data: payload.requestPayload,
  });

const attachEntityUserToEntityGroup = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/entityGroups/${payload.entityGroupId}/users`,
    data: payload.requestPayload,
  });

const requestAgreement = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/entityGroups/${payload.entityGroupId}/agreements`,
    data: payload.requestPayload,
  });

const entityGroupsAPI = {
  getEntityGroupDetailsByGroupID,
  updateEntityGroupUserACLByUserID,
  addEntityGroup,
  attachEntityUserToEntityGroup,
  requestAgreement,
};

export default entityGroupsAPI;
