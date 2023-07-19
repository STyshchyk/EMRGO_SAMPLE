import { baseAxiosInstance } from './helpers';

const getListOfValidPreferences = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/preferences`,
  });

const preferencesAPI = {
  getListOfValidPreferences,
};

export default preferencesAPI;
