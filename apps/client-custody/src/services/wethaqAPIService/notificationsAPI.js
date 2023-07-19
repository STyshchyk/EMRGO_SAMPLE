import { baseAxiosInstance } from './helpers';

export const fetchNotifications = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    url: `/v1/notifications/getAll`,
    data: payload,
  });

export const notificationSetRead = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: payload ? `/v1/notifications/setRead/${payload.id}` : `/v1/notifications/setRead/`,
  });

const notificationsAPI = {
  fetchNotifications,
  notificationSetRead,
};

export default notificationsAPI;
