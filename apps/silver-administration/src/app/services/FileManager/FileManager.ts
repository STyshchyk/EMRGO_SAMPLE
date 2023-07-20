import axios from "axios";

import { dashboardApi } from "../APIService";
import { IUploadResponse } from "./FileManager.types";

export const getFileUploadLink = async (file: {
  filename: string;
  formData: any;
}): Promise<IUploadResponse> => {
  const promise = dashboardApi({
    url: "/v1/utils/files/create",
    method: "POST",
    data: { filename: file.filename },
  });
  const response = await (await promise).data.data;
  const uploadFile = await axios({
    method: "put",
    url: `${response.url}`,
    data: file.formData,
    headers: { "Content-Type": `application/xml` },
  });
  return response;
};

export const viewFile = async (path: string): Promise<{ url: string }> => {
  const promise = dashboardApi({
    url: "/v1/utils/files/link",
    method: "PUT",
  });
  const response = await (await promise).data;
  return response || {};
};
