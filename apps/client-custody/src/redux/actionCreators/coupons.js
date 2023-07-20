import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/coupons";

export const doAddCouponPaymentSchedule = createAction(
  actionTypes.COUPONS_ADD_PAYMENT_SCHEDULE_REQUESTED
);
export const doAddCouponPaymentScheduleSuccess = createAction(
  actionTypes.COUPONS_ADD_PAYMENT_SCHEDULE_SUCCEEDED
);
export const doAddCouponPaymentScheduleFailure = createAction(
  actionTypes.COUPONS_ADD_PAYMENT_SCHEDULE_FAILED
);

export const doEditCouponPaymentSchedule = createAction(
  actionTypes.COUPONS_EDIT_PAYMENT_SCHEDULE_REQUESTED
);
export const doEditCouponPaymentScheduleSuccess = createAction(
  actionTypes.COUPONS_EDIT_PAYMENT_SCHEDULE_SUCCEEDED
);
export const doEditCouponPaymentScheduleFailure = createAction(
  actionTypes.COUPONS_EDIT_PAYMENT_SCHEDULE_FAILED
);

export const doFetchAllCouponPaymentSchedules = createAction(
  actionTypes.COUPONS_FETCH_ALL_PAYMENT_SCHEDULES_REQUESTED
);
export const doFetchAllCouponPaymentSchedulesSuccess = createAction(
  actionTypes.COUPONS_FETCH_ALL_PAYMENT_SCHEDULES_SUCCEEDED
);
export const doFetchAllCouponPaymentSchedulesFailure = createAction(
  actionTypes.COUPONS_FETCH_ALL_PAYMENT_SCHEDULES_FAILED
);

export const doFetchCouponPaymentScheduleById = createAction(
  actionTypes.COUPONS_FETCH_PAYMENT_SCHEDULE_BY_ID_REQUESTED
);
export const doFetchCouponPaymentScheduleByIdSuccess = createAction(
  actionTypes.COUPONS_FETCH_PAYMENT_SCHEDULE_BY_ID_SUCCEEDED
);
export const doFetchCouponPaymentScheduleByIdFailure = createAction(
  actionTypes.COUPONS_FETCH_PAYMENT_SCHEDULE_BY_ID_FAILED
);

export const doPublishCouponPaymentScheduleById = createAction(
  actionTypes.COUPONS_PUBLISH_PAYMENT_SCHEDULE_BY_ID_REQUESTED
);
export const doPublishCouponPaymentScheduleByIdSuccess = createAction(
  actionTypes.COUPONS_PUBLISH_PAYMENT_SCHEDULE_BY_ID_SUCCEEDED
);
export const doPublishCouponPaymentScheduleByIdFailure = createAction(
  actionTypes.COUPONS_PUBLISH_PAYMENT_SCHEDULE_BY_ID_FAILED
);

export const doFetchAllCouponEvents = createAction(
  actionTypes.COUPONS_FETCH_ALL_COUPON_EVENTS_REQUESTED
);
export const doFetchAllCouponEventsSuccess = createAction(
  actionTypes.COUPONS_FETCH_ALL_COUPON_EVENTS_SUCCEEDED
);
export const doFetchAllCouponEventsFailure = createAction(
  actionTypes.COUPONS_FETCH_ALL_COUPON_EVENTS_FAILED
);

export const doAddCouponAllocation = createAction(actionTypes.COUPONS_ADD_ALLOCATION_REQUESTED);
export const doAddCouponAllocationSuccess = createAction(
  actionTypes.COUPONS_ADD_ALLOCATION_SUCCEEDED
);
export const doAddCouponAllocationFailure = createAction(actionTypes.COUPONS_ADD_ALLOCATION_FAILED);

export const doApproveCouponAllocation = createAction(
  actionTypes.COUPONS_APPROVE_ALLOCATION_REQUESTED
);
export const doApproveCouponAllocationSuccess = createAction(
  actionTypes.COUPONS_APPROVE_ALLOCATION_SUCCEEDED
);
export const doApproveCouponAllocationFailure = createAction(
  actionTypes.COUPONS_APPROVE_ALLOCATION_FAILED
);

export const doResetCouponsState = createAction(actionTypes.COUPONS_RESET_STATE);
