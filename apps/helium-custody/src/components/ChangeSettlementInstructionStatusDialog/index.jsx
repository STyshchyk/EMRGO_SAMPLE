import { useDispatch, useSelector } from "react-redux";

import { Select } from "@emrgo-frontend/shared-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Field, Form, Formik } from "formik";
import moment from "moment/moment";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import { settlementInstructionStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import * as paymentAndSettlementActionCreators from "../../redux/actionCreators/paymentAndSettlement";
import * as dropdownSelectors from "../../redux/selectors/dropdown";
import StyledDialogHeader from "../StyledDialogHeader";

const baseSelectStyles = {
  menu: (styles) => ({
    ...styles,
    zIndex: 10,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  control: (styles) => ({
    ...styles,
    border: "none",
    borderRadius: "6px",
    backgroundColor: "rgba(0, 0, 0, 0.09)",
    height: "3rem",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#23389c",
  }),
};

const baseSelectProps = {
  closeMenuOnSelect: true,
  isClearable: true,
  isSearchable: true,
  menuPortalTarget: document.body,
  styles: baseSelectStyles,
};

const generateDropdownOptionsList = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data
      .filter((item) => item.active === true)
      .map((item) => ({
        label: item.name,
        value: item,
      }))
      .sort((a, b) => (a.label > b.label ? 1 : -1));
  }

  return [];
};

const ChangeSettlementInstructionStatusDialog = ({
  requestedSettlementInstructionStatus,
  open,
  handleClose,
  currentlySelectedRowData,
}) => {
  const dispatch = useDispatch();
  const settlementId = currentlySelectedRowData?.id;
  const tradeDate = currentlySelectedRowData?.tradeDate;
  const entryDate = currentlySelectedRowData?.entryDate;
  const settledStatus =
    requestedSettlementInstructionStatus === settlementInstructionStatusEnum.SETTLED;
  const dropdownOptions = useSelector(dropdownSelectors.selectDropdownOptions);

  const changeSettlementInstructionStatus = (payload) =>
    dispatch(paymentAndSettlementActionCreators.doChangeSettlementInstructionChange(payload));

  let settlementStatusReasonSelectOptionsList;

  switch (requestedSettlementInstructionStatus) {
    case settlementInstructionStatusEnum.UNMATCHED:
      settlementStatusReasonSelectOptionsList = generateDropdownOptionsList(
        dropdownOptions?.settlementInstructionUnmatchedReason
      );
      break;

    case settlementInstructionStatusEnum.FAILED:
      settlementStatusReasonSelectOptionsList = generateDropdownOptionsList(
        dropdownOptions?.settlementInstructionFailedReason
      );
      break;

    case settlementInstructionStatusEnum.REJECTED:
      settlementStatusReasonSelectOptionsList = generateDropdownOptionsList(
        dropdownOptions?.settlementInstructionRejectedReason
      );
      break;

    default:
      settlementStatusReasonSelectOptionsList = [];
  }

  const handleSubmit = (values) => {
    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());

    const requestPayload = {
      status: requestedSettlementInstructionStatus,
      settlementDate: settledStatus ? values.settlementDate : undefined,
      settlementStatusReasonId: settledStatus
        ? undefined
        : values.settlementStatusReasonSelectOption?.value?.id,
    };

    changeSettlementInstructionStatus({
      settlementId,
      requestPayload,
      successCallback: () => {
        fetchPaymentsList();
        handleClose();
      },
    });
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="change-settlement-instruction-status-form-dialog"
    >
      <StyledDialogHeader
        title={`Change SI status to ${requestedSettlementInstructionStatus}?`}
        handleClose={handleClose}
      />
      <DialogContent>
        <Box mb={2}>
          <Grid
            container
            direction="column"
            spacing={1}
            style={{
              marginBottom: "1rem",
            }}
          >
            <Grid item>
              <Typography>{`${currentlySelectedRowData?.security}`}</Typography>
            </Grid>
            <Grid item>
              <Typography>{`Reference no: ${currentlySelectedRowData?.referenceId}`}</Typography>
            </Grid>
            <Grid item>
              <Typography>{`Settlement Instruction Status: ${currentlySelectedRowData?.tradeSettlementOrSettlementInstructionStatus}`}</Typography>
            </Grid>
          </Grid>
          <Formik
            initialValues={{
              settlementStatusReasonSelectOption: "",
              settlementDate: moment(),
            }}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Grid container spacing={2}>
                  {!settledStatus ? (
                    <Grid item md={12}>
                      <Select
                        {...baseSelectProps}
                        placeholder={"Select Reason description"}
                        value={values.settlementStatusReasonSelectOption}
                        options={settlementStatusReasonSelectOptionsList}
                        onChange={(newValue) => {
                          setFieldValue("settlementStatusReasonSelectOption", newValue);
                        }}
                      />
                    </Grid>
                  ) : (
                    <Grid item md={12}>
                      <Grid item>
                        <Typography className="py-2">Select Actual Settlement Date</Typography>
                      </Grid>
                      <Field
                        component={DatePicker}
                        onChange={(date) => {
                          setFieldValue("settlementDate", date);
                        }}
                        value={values.settlementDate}
                        format={DEFAULT_DATE_FORMAT}
                        className="w-full"
                        inputvariant="outlined"
                        label={DEFAULT_DATE_FORMAT}
                        name="tradeDate"
                        variant="dialog"
                        slotProps={{ textField: { size: "small" } }}
                        maxDate={moment()}
                        minDate={
                          moment(tradeDate).isSameOrBefore(moment(entryDate))
                            ? moment(tradeDate)
                            : moment(entryDate)
                        }
                      />
                    </Grid>
                  )}
                  <Grid item container spacing={2} justifyContent="flex-end">
                    <Grid item>
                      <Button color="primary" variant="outlined" onClick={handleClose}>
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button color="primary" variant="contained" type="submit">
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeSettlementInstructionStatusDialog;
