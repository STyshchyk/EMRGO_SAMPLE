/* eslint-disable consistent-return */

import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as couponsActionCreators from "../actionCreators/coupons";
import * as couponsActionTypes from "../actionTypes/coupons";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* addCouponPaymentSchedule({ payload }) {
  try {
    const response = yield call(wethaqAPIService.couponsAPI.addCouponPaymentSchedule, payload);
    const { data } = response;

    yield put(couponsActionCreators.doAddCouponPaymentScheduleSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(couponsActionCreators.doAddCouponPaymentScheduleFailure({ message: errorMessage }));
  }
}

function* editCouponPaymentSchedule({ payload }) {
  try {
    const response = yield call(wethaqAPIService.couponsAPI.editCouponPaymentScheduleById, payload);
    const { data } = response;

    yield put(couponsActionCreators.doEditCouponPaymentScheduleSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(couponsActionCreators.doEditCouponPaymentScheduleFailure({ message: errorMessage }));
  }
}

function* fetchCouponPaymentScheduleById({ payload }) {
  try {
    const response = yield call(wethaqAPIService.couponsAPI.getCouponsById, payload);
    const { data } = response;

    yield put(couponsActionCreators.doFetchCouponPaymentScheduleByIdSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(
      couponsActionCreators.doFetchCouponPaymentScheduleByIdFailure({ message: errorMessage })
    );
  }
}

function* fetchAllCouponPaymentSchedules({ payload }) {
  try {
    const response = yield call(wethaqAPIService.couponsAPI.getAllCoupons, payload);
    const { data } = response;

    yield put(couponsActionCreators.doFetchAllCouponPaymentSchedulesSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(
      couponsActionCreators.doFetchAllCouponPaymentSchedulesFailure({ message: errorMessage })
    );
  }
}

function* publishCouponPaymentScheduleById({ payload }) {
  try {
    const response = yield call(wethaqAPIService.couponsAPI.publishCouponsById, payload);
    const { data } = response;

    yield put(couponsActionCreators.doPublishCouponPaymentScheduleByIdSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(
      couponsActionCreators.doPublishCouponPaymentScheduleByIdFailure({ message: errorMessage })
    );
  }
}

function* fetchAllCouponEvents({ payload }) {
  try {
    const response = yield call(wethaqAPIService.couponsAPI.getAllCouponEvents, payload);
    const { data } = response;

    yield put(couponsActionCreators.doFetchAllCouponEventsSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(couponsActionCreators.doFetchAllCouponEventsFailure({ message: errorMessage }));
  }
}

function* addCouponAllocation({ payload }) {
  try {
    const response = yield call(wethaqAPIService.couponsAPI.addCouponAllocation, payload);
    const { data } = response;

    yield put(couponsActionCreators.doAddCouponAllocationSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(couponsActionCreators.doAddCouponAllocationFailure({ message: errorMessage }));
  }
}

function* approveCouponAllocation({ payload }) {
  try {
    const response = yield call(wethaqAPIService.couponsAPI.approveCouponAllocation, payload);
    const { data } = response;

    yield put(couponsActionCreators.doApproveCouponAllocationSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(couponsActionCreators.doApproveCouponAllocationFailure({ message: errorMessage }));
  }
}

function* showCsvFileErrorToast() {
    yield call(
      toast.error,
      "CSV file columns does not match expected format. Please check and try again"
    );
}

const couponsSaga = [
  takeLatest(couponsActionTypes.COUPONS_ADD_PAYMENT_SCHEDULE_REQUESTED, addCouponPaymentSchedule),
  takeLatest(couponsActionTypes.COUPONS_EDIT_PAYMENT_SCHEDULE_REQUESTED, editCouponPaymentSchedule),
  takeLatest(
    couponsActionTypes.COUPONS_FETCH_ALL_PAYMENT_SCHEDULES_REQUESTED,
    fetchAllCouponPaymentSchedules
  ),
  takeLatest(
    couponsActionTypes.COUPONS_FETCH_PAYMENT_SCHEDULE_BY_ID_REQUESTED,
    fetchCouponPaymentScheduleById
  ),
  takeLatest(couponsActionTypes.COUPONS_IMPORT_CSV_FILE_FAILED, showCsvFileErrorToast),
  takeLatest(
    couponsActionTypes.COUPONS_PUBLISH_PAYMENT_SCHEDULE_BY_ID_REQUESTED,
    publishCouponPaymentScheduleById
  ),
  takeLatest(couponsActionTypes.COUPONS_FETCH_ALL_COUPON_EVENTS_REQUESTED, fetchAllCouponEvents),
  takeLatest(couponsActionTypes.COUPONS_ADD_ALLOCATION_REQUESTED, addCouponAllocation),
  takeLatest(couponsActionTypes.COUPONS_APPROVE_ALLOCATION_REQUESTED, approveCouponAllocation),
];

export default couponsSaga;
