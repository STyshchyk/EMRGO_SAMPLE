export const selectAllCouponEvents = (state) => state.coupons?.couponEvents;
export const selectAllCouponPaymentSchedules = (state) => state.coupons?.couponPaymentSchedules;
export const selectCouponPaymentSchedule = (state) => state.coupons?.couponPaymentSchedule;
export const selectIsFetching = (state) => state.coupons.isFetching;
export const selectIsRequesting = (state) => state.coupons.isRequesting;
