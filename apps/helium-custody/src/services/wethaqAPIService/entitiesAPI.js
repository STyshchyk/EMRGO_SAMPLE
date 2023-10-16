import { baseAxiosInstance } from "./helpers";

export const getEntities = (payload) =>
  baseAxiosInstance({
    method: "GET",
    params: payload,
    url: `/auth/v2/internal/entities`,
  });

export const getEmrgoEntities = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/auth/v2/internal/entities/emrgo`,
  });

export const getLegacyEntities = (payload) =>
  baseAxiosInstance({
    method: "GET",
    params: payload,
    url: `/auth/v2/entities/legacy`,
  });

export const getUsersByEntityID = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/entities/${payload.entityId}/users`,
  });

const getEntityGroupsByEntityID = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/entities/${payload.entityId}/groups`,
  });

const getParentEntities = (payload) =>
  baseAxiosInstance({
    method: "GET",
    params: payload,
    url: `/v1/entities/parent`,
  });

const addParentEntity = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/entities/parent`,
    data: payload.requestPayload,
  });

const updateParentEntity = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/entities/parent/${payload.parentEntityId}`,
    data: payload.requestPayload,
  });

const deactivateParentEntity = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/entities/parent/${payload.parentEntityId}/deactivate`,
    data: payload.requestPayload,
  });

const setParentEntityID = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/entities/${payload.entityId}/parent`,
    data: payload.requestPayload,
  });

const updateEntityTypes = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/entities/${payload.entityId}/types`,
    data: payload.requestPayload,
  });

const updateEntityPrefs = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/entities/${payload.entityId}/preferences`,
    data: payload.requestPayload,
  });

const deactivateEntity = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/entities/${payload.entityId}/activate`,
    data: payload.requestPayload,
  });

const reactivateEntity = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/entities/${payload.entityId}/activate`,
    data: payload.requestPayload,
  });

const editEntityCustodySettings = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/entities/custodySettings`,
    data: payload.requestPayload,
  });

const entitiesAPI = {
  getEntities,
  getEmrgoEntities,
  getLegacyEntities,
  getUsersByEntityID,
  getEntityGroupsByEntityID,
  getParentEntities,
  addParentEntity,
  updateParentEntity,
  deactivateParentEntity,
  setParentEntityID,
  updateEntityTypes,
  updateEntityPrefs,
  deactivateEntity,
  reactivateEntity,
  editEntityCustodySettings,
};

export default entitiesAPI;
