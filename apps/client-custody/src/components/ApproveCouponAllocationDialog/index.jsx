import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useCouponEventsTableFilters } from "../../context/coupon-events-table-filters-context";
import * as couponsActionCreators from "../../redux/actionCreators/coupons";
import * as billingAndPaymentsSelectors from "../../redux/selectors/cashManagement";
import convertToDateOnlyInISOFormat from "../../utils/convertToDateOnlyInISOFormat";
import CouponAllocationsTable, {
  generateCouponAllocationTableRowData,
} from "../CouponAllocationsTable";
import CouponEventDetails from "../CouponEventDetails";
import CustomNumberInputField from "../CustomNumberInputField";
import StyledDialogHeader from "../StyledDialogHeader";

const ApproveCouponAllocationDialog = ({ open, handleClose, currentlySelectedRowData }) => {
  const dispatch = useDispatch();

  const [totalCouponAmount, setTotalCouponAmount] = useState(0);
  const [tableData, setTableData] = useState([]);

  const { couponEventFiltersState } = useCouponEventsTableFilters();

  // selectors
  const wethaqOwnedAccounts = useSelector(billingAndPaymentsSelectors.selectWethaqOwnedAccounts);

  useEffect(() => {
    if (currentlySelectedRowData?.totalCouponAmount) {
      const parsedTotalCouponAmount = parseFloat(currentlySelectedRowData?.totalCouponAmount, 10);

      setTotalCouponAmount(parsedTotalCouponAmount);
    }

    if (
      Array.isArray(currentlySelectedRowData?.investors) &&
      currentlySelectedRowData?.investors.length > 0
    ) {
      const updatedTableData = currentlySelectedRowData?.investors.map((i) =>
        generateCouponAllocationTableRowData(i)
      );

      setTableData(updatedTableData);
    }

    return () => {
      setTableData([]);
      setTotalCouponAmount(0);
    };
  }, [
    currentlySelectedRowData?.investors,
    currentlySelectedRowData?.totalCouponAmount,
    totalCouponAmount,
  ]);

  const handleApprove = () => {
    const approveCouponAllocation = (payload) =>
      dispatch(couponsActionCreators.doApproveCouponAllocation(payload));

    const requestPayload = {
      status: true,
    };

    approveCouponAllocation({
      couponScheduleDateId: currentlySelectedRowData.id,
      requestPayload,
      successCallback: () => {
        const fetchAllCouponsEvents = (payload) =>
          dispatch(couponsActionCreators.doFetchAllCouponEvents(payload));
        fetchAllCouponsEvents({
          params: {
            fromDate: convertToDateOnlyInISOFormat(couponEventFiltersState.fromDate),
            toDate: convertToDateOnlyInISOFormat(couponEventFiltersState.toDate),
            holdingsOnly: couponEventFiltersState.holdingsOnly,
          },
        });
        handleClose();
      },
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="approve-coupon-allocation-dialog"
    >
      <StyledDialogHeader title="Approve Coupon Allocation" handleClose={handleClose} />
      <DialogContent>
        <Box mb={2}>
          <CouponEventDetails couponEventData={currentlySelectedRowData} />
          <hr />
          <Grid container spacing={2}>
            <Grid
              item
              md={12}
              container
              alignItems="center"
              spacing={2}
              justifyContent="space-between"
            >
              <Grid item>
                <Typography>Total Coupon Amt.</Typography>
              </Grid>
              <Grid item>
                <TextField
                  disabled
                  fullWidth
                  variant="outlined"
                  value={totalCouponAmount}
                  InputProps={{
                    inputComponent: CustomNumberInputField,
                    endAdornment: (
                      <InputAdornment disableTypography position="end">
                        <span
                          style={{
                            fontSize: "0.75em",
                            padding: "0 1rem",
                          }}
                        >
                          {currentlySelectedRowData?.externalSecurity?.currencyName?.name ?? "USD"}
                        </span>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid item md={12}>
              <CouponAllocationsTable
                isLoading={false}
                tableData={tableData}
                setTableData={setTableData}
              />
            </Grid>
          </Grid>

          <Grid
            item
            container
            spacing={2}
            justifyContent="flex-end"
            style={{
              marginTop: "1rem",
            }}
          >
            <Grid item>
              <Button color="primary" variant="contained" type="submit" onClick={handleApprove}>
                <strong>Approve</strong>
              </Button>
            </Grid>

            <Grid item>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => {
                  handleClose();
                }}
              >
                <strong>Cancel</strong>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveCouponAllocationDialog;
