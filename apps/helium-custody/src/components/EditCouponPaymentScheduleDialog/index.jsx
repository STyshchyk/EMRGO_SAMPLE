import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";

import { couponAllocationStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import * as couponsActionCreators from "../../redux/actionCreators/coupons";
import * as externalSecuritiesActionCreators from "../../redux/actionCreators/externalSecurities";
import * as couponsSelectors from "../../redux/selectors/coupons";
import { dateFormatter } from "../../utils/formatter";
import CouponPaymentScheduleTable, {
  generateCouponPaymentScheduleTableRowData,
} from "../CouponPaymentScheduleTable";
import SecurityOverview from "../SecurityOverview";
import StyledDialogHeader from "../StyledDialogHeader";

const EditCouponPaymentScheduleDialog = ({ currentlySelectedRowData, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["reports"]);

  const [tableData, setTableData] = useState([]);

  // selectors
  const couponPaymentSchedule = useSelector(couponsSelectors.selectCouponPaymentSchedule);
  const isFetching = useSelector(couponsSelectors.selectIsFetching);
  const isRequesting = useSelector(couponsSelectors.selectIsRequesting);

  const couponPaymentScheduleStatus = couponPaymentSchedule?.status ?? "";
  const couponPaymentScheduleUpdatedAt = dateFormatter(
    couponPaymentSchedule?.updatedAt,
    "MMMM Do YYYY, HH:mm"
  );
  const isLoading = isFetching || isRequesting;
  const isTableDataEmpty = Array.isArray(tableData) && !tableData.length > 0;
  // const couponId = currentlySelectedRowData?.couponId;
  const couponId = currentlySelectedRowData?.coupons?.id;

  const hasCouponScheduleDates = couponPaymentSchedule?.couponScheduleDates;

  // dispatchers
  const fetchAllCouponPaymentSchedules = () =>
    dispatch(couponsActionCreators.doFetchAllCouponPaymentSchedules());
  const fetchExternalSecurities = () =>
    dispatch(externalSecuritiesActionCreators.doFetchExternalSecuritiesList());
  const addCouponPaymentSchedule = (payload) =>
    dispatch(couponsActionCreators.doAddCouponPaymentSchedule(payload));
  const editCouponPaymentSchedule = (payload) =>
    dispatch(couponsActionCreators.doEditCouponPaymentSchedule(payload));

  useEffect(() => {
    const fetchCouponPaymentScheduleById = (payload) =>
      dispatch(couponsActionCreators.doFetchCouponPaymentScheduleById(payload));
    const resetCouponsState = () => dispatch(couponsActionCreators.doResetCouponsState());

    if (couponId) {
      fetchCouponPaymentScheduleById({
        couponId,
      });
    }
    return () => resetCouponsState();
  }, [couponId, dispatch]);

  useEffect(() => {
    const couponPaymentDates = couponPaymentSchedule?.couponScheduleDates ?? [];
    const generatedTableData = couponPaymentDates.map((item) =>
      generateCouponPaymentScheduleTableRowData(item)
    );

    if (generatedTableData) {
      setTableData(generatedTableData);
    }
  }, [couponId, couponPaymentSchedule?.couponScheduleDates, couponPaymentSchedule?.id]);

  const normalizeDateObject = (date) => {
    if (date && date instanceof Date) {
      // Make a deep copy of the date object
      const normalizedDate = new Date(date.getTime());

      // Reset the date-time component
      normalizedDate.setHours(0, 0, 0, 0);

      return normalizedDate;
    }

    return null;
  };

  const handleSubmitSchedule = () => {
    const couponDateObject = tableData.map(({ calenderDate, notional }, index) => ({
      couponIndex: index,
      calenderDate,
      notional,
    }));

    const requestPayload = {
      couponDateObject,
      externalSecuritiesId: currentlySelectedRowData?.id,
    };

    const payload = {
      requestPayload,
      successCallback: () => {
        fetchAllCouponPaymentSchedules();
        fetchExternalSecurities();
      },
    };

    addCouponPaymentSchedule(payload);
  };

  const handleUpdateCouponSchedule = () => {
    const originalListOfDateIds = couponPaymentSchedule?.couponScheduleDates.map(({ id }) => id);
    const deletedIds = originalListOfDateIds.filter(
      (i) => !tableData.map(({ id }) => id).includes(i)
    );

    const couponDateObject = tableData
      .filter(
        ({ couponAllocationStatus }) =>
          // const todayDateObject = normalizeDateObject(new Date());
          // const calenderDateObject = normalizeDateObject(new Date(calenderDate));
          // const isAfterToday = calenderDateObject.valueOf() > todayDateObject.valueOf();

          ![
            couponAllocationStatusEnum.ALLOCATED,
            couponAllocationStatusEnum.PENDING_APPROVAL,
          ].includes(couponAllocationStatus)
      )
      .map(({ id, calenderDate, notional, couponAllocationStatus }, index) => ({
        dateId: id,
        op: id ? "update" : "add",
        couponIndex: index,
        calenderDate,
        notional: parseFloat(notional), // golang expects float value
        couponAllocationStatus,
      }));

    const deletedDates = deletedIds.map((i) => ({
      dateId: i,
      op: "delete",
    }));

    const requestPayload = {
      couponDateObject: [...couponDateObject, ...deletedDates],
    };

    const payload = {
      requestPayload,
      couponScheduleId: couponPaymentSchedule.id,
      successCallback: () => {
        fetchAllCouponPaymentSchedules();
        fetchExternalSecurities();
      },
    };

    editCouponPaymentSchedule(payload);
  };

  const handlePublishSchedule = () => {
    const publishCouponPaymentScheduleById = (payload) =>
      dispatch(couponsActionCreators.doPublishCouponPaymentScheduleById(payload));
    const requestPayload = {
      isPublished: true,
    };

    publishCouponPaymentScheduleById({
      couponId: couponPaymentSchedule?.id,
      requestPayload,
      successCallback: () => {
        fetchAllCouponPaymentSchedules();
        fetchExternalSecurities();
      },
    });
  };

  return (
    <Fragment>
      <Dialog
        scroll="body"
        disableEscapeKeyDown
        fullWidth
        maxWidth="md"
        open={open}
        onClose={(event, reason) => {
          if (reason && reason === "backdropClick") return;

          handleClose();
        }}
        aria-labelledby="form-dialog-title"
      >
        <StyledDialogHeader title="Edit Coupon Payment Schedule" handleClose={handleClose} />
        <DialogContent>
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            <Grid container>
              <SecurityOverview data={currentlySelectedRowData} />
            </Grid>
            <hr />
            <Grid container spacing={2}>
              <Grid item>
                <div>
                  <strong>{`Status: ${couponPaymentScheduleStatus}`}</strong>
                </div>
                <div>
                  <strong>{`Last updated: ${couponPaymentScheduleUpdatedAt}`}</strong>
                </div>
              </Grid>

              <Grid item md={12}>
                <CouponPaymentScheduleTable
                  editable
                  hardcodedCouponRate={currentlySelectedRowData?.profitRate ?? 0.0}
                  tableData={tableData}
                  setTableData={setTableData}
                  isLoading={isLoading}
                />
              </Grid>

              <Grid
                container
                spacing={2}
                style={{
                  marginTop: "1rem",
                }}
              >
                <Grid item container md={12} spacing={2} justifyContent="flex-end">
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleClose();
                      }}
                      color="primary"
                    >
                      <strong>Cancel</strong>
                    </Button>
                  </Grid>

                  {couponPaymentSchedule?.id && hasCouponScheduleDates ? (
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={handleUpdateCouponSchedule}
                        color="primary"
                      >
                        <strong>Update</strong>
                      </Button>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Button variant="contained" onClick={handleSubmitSchedule} color="primary">
                        <strong>Submit</strong>
                      </Button>
                    </Grid>
                  )}
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={handlePublishSchedule}
                      color="primary"
                      disabled={
                        !couponPaymentSchedule?.id ||
                        isRequesting ||
                        isTableDataEmpty ||
                        couponPaymentScheduleStatus !== "Pending"
                      }
                    >
                      <strong>Publish</strong>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions />
      </Dialog>
    </Fragment>
  );
};

export default EditCouponPaymentScheduleDialog;

EditCouponPaymentScheduleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
