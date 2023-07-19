import axios from 'axios';

import appConfig from '../../../appConfig';

const axiosParams = {
  baseURL: appConfig.baseAPIURL,
  // baseURL: "https://d0dfd200c7c4.ngrok.io/",
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
};

// eslint-disable-next-line import/prefer-default-export
export const baseAxiosInstance = axios.create(axiosParams);
