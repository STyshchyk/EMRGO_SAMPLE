import { baseAxiosInstance } from "./helpers";

const fetchTNCData = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/files/v1/tnc`,
  });

const fetchTNCStatus = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/files/v1/tnc/entity/status`,
    params: {
      entityId: payload.entityId,
    },
  });

const acceptTNCVersion = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/files/v1/tnc/${payload.versionNumber}/accept`,
  });

const tncAPI = {
  fetchTNCData,
  fetchTNCStatus,
  acceptTNCVersion,
};

export default tncAPI;
