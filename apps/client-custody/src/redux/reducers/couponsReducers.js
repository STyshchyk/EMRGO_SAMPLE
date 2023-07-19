import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as couponsActionCreators from '../actionCreators/coupons';

const defaultState = {
  couponPaymentSchedules: [],
  couponPaymentSchedule: {},
  errorMessage: null,
  isRequesting: false,
  isFetching: false,
  couponEvents: [],
};

const couponsReducer = handleActions(
  {
    [couponsActionCreators.doAddCouponPaymentSchedule]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [couponsActionCreators.doAddCouponPaymentScheduleSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { coupons },
          },
        },
      ) => {
        draft.isRequesting = false;
        draft.couponPaymentSchedule = coupons;
      },
    ),
    [couponsActionCreators.doAddCouponPaymentScheduleFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),

    [couponsActionCreators.doFetchAllCouponPaymentSchedules]: produce((draft) => {
      draft.isFetching = true;
      draft.errorMessage = null;
    }),
    [couponsActionCreators.doFetchAllCouponPaymentSchedulesSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { coupons },
          },
        },
      ) => {
        draft.isFetching = false;
        draft.couponPaymentSchedules = coupons;
      },
    ),
    [couponsActionCreators.doFetchAllCouponPaymentSchedulesFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [couponsActionCreators.doFetchCouponPaymentScheduleById]: produce((draft) => {
      draft.isFetching = true;
      draft.errorMessage = null;
    }),
    [couponsActionCreators.doFetchCouponPaymentScheduleByIdSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { coupons },
          },
        },
      ) => {
        draft.isFetching = false;
        draft.couponPaymentSchedule = coupons;
      },
    ),
    [couponsActionCreators.doFetchCouponPaymentScheduleByIdFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [couponsActionCreators.doPublishCouponPaymentScheduleById]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [couponsActionCreators.doPublishCouponPaymentScheduleByIdSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { coupons },
          },
        },
      ) => {
        draft.isRequesting = false;
        draft.couponPaymentSchedule = coupons;
      },
    ),
    [couponsActionCreators.doPublishCouponPaymentScheduleByIdFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),

    [couponsActionCreators.doResetCouponsState]: produce((draft) => {
      draft.couponPaymentSchedule = {};
    }),

    [couponsActionCreators.doFetchAllCouponEvents]: produce((draft) => {
      draft.isFetching = true;
      draft.errorMessage = null;
    }),
    [couponsActionCreators.doFetchAllCouponEventsSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        },
      ) => {
        draft.isFetching = false;
        draft.couponEvents = data;
      },
    ),
    [couponsActionCreators.doFetchAllCouponEventsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [couponsActionCreators.doAddCouponAllocation]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [couponsActionCreators.doAddCouponAllocationSuccess]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      // draft.couponPaymentSchedule = coupons;
    }),
    [couponsActionCreators.doAddCouponAllocationFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),

    [couponsActionCreators.doEditCouponPaymentSchedule]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [couponsActionCreators.doEditCouponPaymentScheduleSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { coupons },
          },
        },
      ) => {
        draft.isRequesting = false;
        draft.couponPaymentSchedule = coupons;
      },
    ),
    [couponsActionCreators.doEditCouponPaymentScheduleFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState,
);

export default couponsReducer;
