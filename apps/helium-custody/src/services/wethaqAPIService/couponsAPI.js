import { baseAxiosInstance } from "./helpers";

const addCouponPaymentSchedule = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/coupons/schedules`,
    data: payload.requestPayload,
  });

const editCouponPaymentScheduleById = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/coupons/schedules/${payload.couponScheduleId}`,
    data: payload.requestPayload,
  });

const getAllCoupons = () =>
  baseAxiosInstance({
    method: "GET",
    url: "/v1/coupons",
  });

const getCouponsById = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/coupons/${payload.couponId}`,
  });

const publishCouponsById = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/v1/coupons/${payload.couponId}/publish`,
    data: payload.requestPayload,
  });

const getAllCouponEvents = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: "/v1/coupons/events",
    params: payload?.params,
  });

const addCouponAllocation = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/v1/coupons/${payload.couponScheduleDateId}/allocation`,
    data: payload.requestPayload,
  });

const approveCouponAllocation = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/v1/coupons/${payload.couponScheduleDateId}/allocation/approve`,
    data: payload.requestPayload,
  });

const couponsAPI = {
  addCouponPaymentSchedule,
  editCouponPaymentScheduleById,
  getAllCoupons,
  getCouponsById,
  publishCouponsById,
  getAllCouponEvents,
  addCouponAllocation,
  approveCouponAllocation,
};

export default couponsAPI;

/*
      const patchCouponPayload = {
      params: {
        scheduleId: Joi.string().trim().guid().required(),
      },
      body: {
        couponDateObject: Joi.array()
          .items(
            Joi.object({
              dateId: Joi.string().trim().guid().required(),
              couponIndex: Joi.number().required(),
              calenderDate: Joi.string().trim().isoDate().required(),
              notional: Joi.number().required(),
              toBeDeleted: Joi.boolean().default(false),
            }).required(),
          )
          .required(),
      },
    };
  */
