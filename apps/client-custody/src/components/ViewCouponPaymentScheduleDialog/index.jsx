import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";

import * as couponsActionCreators from "../../redux/actionCreators/coupons";
import * as couponsSelectors from "../../redux/selectors/coupons";
import { dateFormatter } from "../../utils/formatter";
import CouponPaymentScheduleTable, {
  generateCouponPaymentScheduleTableRowData,
} from "../CouponPaymentScheduleTable";
import SecurityOverview from "../SecurityOverview";
import StyledDialogHeader from "../StyledDialogHeader";

const ViewCouponPaymentScheduleDialog = ({ couponId, securityData, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["reports", ""]);

  const [couponPaymentTableData, setCouponPaymentTableData] = useState([]);

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
      setCouponPaymentTableData(generatedTableData);
    }
  }, [couponId, couponPaymentSchedule?.couponScheduleDates]);

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
        <StyledDialogHeader
          title={t("Coupon Payment Schedule.Coupon Payment Schedule")}
          handleClose={handleClose}
        />
        <DialogContent>
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            <Grid container>
              <SecurityOverview data={securityData} />
            </Grid>
            <hr
              style={{
                width: "100%",
                border: "1px solid lightgrey",
                marginBottom: "1rem",
              }}
            />
            <Grid container spacing={2}>
              <Grid item>
                <div>
                  <strong>{`${t(
                    "Coupon Payment Schedule.Status"
                  )}: ${couponPaymentScheduleStatus}`}</strong>
                </div>
                <div>
                  <strong>{`${t(
                    "Coupon Payment Schedule.Last Updated"
                  )}: ${couponPaymentScheduleUpdatedAt}`}</strong>
                </div>
              </Grid>

              <Grid item md={12}>
                <CouponPaymentScheduleTable
                  editable={false}
                  hardcodedCouponRate={securityData?.profitRate ?? 0.0}
                  tableData={couponPaymentTableData}
                  setTableData={setCouponPaymentTableData}
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
                      <strong>Close</strong>
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

export default ViewCouponPaymentScheduleDialog;

ViewCouponPaymentScheduleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
