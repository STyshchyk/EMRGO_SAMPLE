import { baseAxiosInstance } from "./helpers";

// * [experimental] - DEPRECATED - TO BE DELETED

const addModuleAccess = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.data,
    url: `/v1/users/${payload.userId}/permissions`,
  });

const getModuleData = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/permissions`,
  });

const grantModuleAccess = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.request,
    url: `/v1/users/${payload.userID}/permissions`,
  });

const revokeModuleAccess = (payload) =>
  baseAxiosInstance({
    method: "DELETE",
    data: payload.request,
    url: `/v1/users/${payload.userID}/permissions`,
  });

const requestModuleAccess = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    data: payload,
    url: `/v1/users/permissions/request`,
  });

const modulesAPI = {
  addModuleAccess,
  getModuleData,
  grantModuleAccess,
  requestModuleAccess,
  revokeModuleAccess,
};

export default modulesAPI;
