import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Select } from "@emrgo-frontend/shared-ui";
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
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import convertToDateOnlyInISOFormat from "../../utils/convertToDateOnlyInISOFormat";
import CouponAllocationsTable, {
  generateCouponAllocationTableRowData,
} from "../CouponAllocationsTable";
import CouponEventDetails from "../CouponEventDetails";
import CustomNumberInputField from "../CustomNumberInputField";
import ReactSelectCurrencyOption from "../ReactSelectCurrencyOption";
import StyledDialogHeader from "../StyledDialogHeader";

// TODO: CLEAN UP LATER

const computeTotalAllocatedCouponAmount = (data) =>
  data.reduce((acc, current) => acc + parseInt(current?.couponAllocation, 10), 0);

const AllocateCouponDialog = ({ open, handleClose, currentlySelectedRowData }) => {
  const dispatch = useDispatch();
  const [totalCouponAmount, setTotalCouponAmount] = useState(0);
  const [selectedWethaqSourceAccountOption, setSelectedWethaqSourceAccountOption] = useState(null);
  const [tableData, setTableData] = useState([]);
  const { couponEventFiltersState } = useCouponEventsTableFilters();
  const parsedTotalCouponAmount = parseFloat(currentlySelectedRowData?.totalCouponAmount, 10);
  const computedTotalAllocatedCouponAmount = computeTotalAllocatedCouponAmount(tableData);
  console.log("currentlySelectedRowData", currentlySelectedRowData);
  // selectors
  const wethaqOwnedAccounts = useSelector(billingAndPaymentsSelectors.selectWethaqOwnedAccounts);

  const accountOptionsList = wethaqOwnedAccounts
    .filter(
      ({ currencyName }) =>
        currencyName === currentlySelectedRowData?.externalSecurity?.currencyName?.name
    )
    .map((item) => ({
      label: `${item.accountNo}`,
      value: { ...item },
    }));

  useEffect(() => {
    if (parsedTotalCouponAmount) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlySelectedRowData?.investors, parsedTotalCouponAmount]);

  const handleTotalCouponAmountChange = (event) => {
    setTotalCouponAmount(event?.target.value);
  };

  const handleSubmitForApproval = () => {
    const addCouponAllocation = (payload) =>
      dispatch(couponsActionCreators.doAddCouponAllocation(payload));

    const requestPayload = {
      totalCouponAmount: totalCouponAmount.toString(), // has to be sent as string otherwise go throws validation error
      distributions: tableData.map((item) => ({
        investorEntityGroupId: item?.clientEntityGroupId,
        couponAllocation: parseFloat(item?.couponAllocation, 10),
      })),
      debitWethaqAccountId:
        selectedWethaqSourceAccountOption?.value?.id ||
        currentlySelectedRowData?.debitWethaqAccountId,
    };

    addCouponAllocation({
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
      aria-labelledby="allocate-coupon-dialog"
    >
      <StyledDialogHeader title="Allocate Coupon" handleClose={handleClose} />
      <DialogContent>
        <Box mb={2}>
          <CouponEventDetails
            couponEventData={currentlySelectedRowData}
            selectedWethaqSourceAccountOption={selectedWethaqSourceAccountOption}
          />
          <hr />
          <Grid container spacing={2}>
            {!currentlySelectedRowData?.isPrimaryIssuance && (
              <Grid item md={12} container spacing={2}>
                <Box mt={4} ml={2}>
                  <Select
                    aria-label="source-accounts-menu"
                    closeMenuOnSelect
                    isSearchable
                    components={{ Option: ReactSelectCurrencyOption }}
                    onChange={(newValue) => {
                      setSelectedWethaqSourceAccountOption(newValue);
                    }}
                    options={accountOptionsList}
                    placeholder="Set Source Account"
                    value={selectedWethaqSourceAccountOption}
                    styles={{
                      menu: (styles) => ({
                        ...styles,
                        zIndex: 100,
                      }),
                      control: (styles) => ({
                        ...styles,
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "rgba(0, 0, 0, 0.09)",
                        height: "3rem",
                        width: 600,
                      }),
                    }}
                    isClearable
                  />
                </Box>

                <Grid item container md={12} justifyContent="space-between">
                  <Grid item>
                    <Typography
                      style={{
                        fontWeight: "bold",
                      }}
                    >{`Selected Source Account Bal.`}</Typography>
                  </Grid>
                  <Grid item>
                    {selectedWethaqSourceAccountOption?.value?.accountBalance &&
                      convertNumberToIntlFormat(
                        selectedWethaqSourceAccountOption?.value?.accountBalance,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}{" "}
                  </Grid>
                </Grid>
              </Grid>
            )}
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
                  fullWidth
                  variant="filled"
                  value={totalCouponAmount}
                  onChange={handleTotalCouponAmountChange}
                  InputProps={{
                    inputComponent: CustomNumberInputField,
                    "data-testid": "total-coupon-amount-input-field",
                    endAdornment: (
                      <InputAdornment disableTypography position="end">
                        <span
                          style={{
                            fontSize: "0.75em",
                            padding: "0 1rem",
                          }}
                        >
                          {currentlySelectedRowData?.externalSecurity?.currencyName?.name}
                        </span>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid
              item
              md={12}
              container
              alignItems="center"
              spacing={2}
              justifyContent="space-between"
            >
              <Grid item>
                <Typography>Unallocated Coupon Amt.</Typography>
              </Grid>
              <Grid item>
                <TextField
                  disabled
                  fullWidth
                  variant="filled"
                  value={totalCouponAmount - computedTotalAllocatedCouponAmount}
                  InputProps={{
                    inputComponent: CustomNumberInputField,
                    "data-testid": "total-coupon-amount-input-field",
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
              <CouponAllocationsTable tableData={tableData} setTableData={setTableData} editable />
            </Grid>
          </Grid>

          <Grid
            item
            container
            spacing={2}
            style={{
              marginTop: "1rem",
            }}
          >
            <Grid item md={12} container spacing={1} justifyContent="flex-end">
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={
                    !selectedWethaqSourceAccountOption ||
                    !totalCouponAmount ||
                    !(totalCouponAmount - computedTotalAllocatedCouponAmount === 0)
                  }
                  type="submit"
                  onClick={handleSubmitForApproval}
                >
                  <strong>Commit for Approval</strong>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <strong>Cancel</strong>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AllocateCouponDialog;
