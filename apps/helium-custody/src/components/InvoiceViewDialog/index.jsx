import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import v from "voca";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import Moment from "moment";
import { extendMoment } from "moment-range";

import { BANK_AMOUNT_DP } from "../../constants/currency/availableCurrencies";
import { dateRenderer, idRenderer, roundNumber } from "../../constants/renderers";
import { useTheme } from "../../context/theme-context";
import normalisedCountries from "../../helpers/countries";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as billingActionCreators from "../../redux/actionCreators/billing";
import * as cashManagementActionCreators from "../../redux/actionCreators/cashManagement";
import * as dropdownActionCreators from "../../redux/actionCreators/dropdown";
import * as entitiesActionCreators from "../../redux/actionCreators/entities";
import * as authSelectors from "../../redux/selectors/auth";
import * as billingSelectors from "../../redux/selectors/billing";
import * as dropdownSelectors from "../../redux/selectors/dropdown";
import { getDropdownValues } from "../../utils/form";
import OutOfPocketExpensesSections from "./OutOfPocketExpensesSections";
import PaymentHolidaysSection from "./PaymentHolidaysSection";
import SafekeepingChargesSection from "./SafekeepingChargesSection";
import TransactionChargesSection from "./TransactionChargesSection";

// import { Divider } from '@mui/material';

const InvoiceViewDialog = ({ open, handleClose, selectedRow, modalType, fetchInvoiceParams }) => {
  const moment = extendMoment(Moment);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { locale } = theme;
  const { t } = useTranslation(["billing"]);
  const [localPaymentHolidays, setLocalPaymentHolidays] = useState([]);
  const [localSafekeepingCharges, setLocalSafekeepingCharges] = useState([]);
  const [localTransactionCharges, setLocalTransactionCharges] = useState([]);
  const [localOutOfPocketExpenses, setLocalOutOfPocketExpenses] = useState([]);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentUserId = useSelector(authSelectors.selectUserId);
  const dropdownOptions = useSelector(dropdownSelectors.selectDropdownOptions);
  const invoiceConfig = useSelector(billingSelectors.selectCurrentInvoice)[0];
  const totalInvoiceAmount = useSelector(billingSelectors.selectTotalInvoiceAmount);
  // const invoiceConfig = mockedSingleInvoice;

  const invoice = invoiceConfig?.invoice;
  const remotePaymentHolidays = useMemo(
    () =>
      invoiceConfig?.payment_holiday
        // ?.filter((holiday) => holiday.is_active)
        ?.map((holiday) => {
          const processedHoliday = { ...holiday, isApplied: holiday.is_active };
          return processedHoliday;
        }) || [],
    [invoiceConfig?.payment_holiday]
  );
  const remoteSafekeepingCharges = useMemo(
    () => invoiceConfig?.safe_keeping_item || [],
    [invoiceConfig?.safe_keeping_item]
  );
  const remoteTrxCharges = useMemo(
    () => invoiceConfig?.transaction_items || [],
    [invoiceConfig?.transaction_items]
  );
  const remoteOutOfPocketExpenses = useMemo(
    () => invoiceConfig?.pocket_expenses || [],
    [invoiceConfig?.pocket_expenses]
  );

  const transactionTypeOptions = {};
  getDropdownValues(
    dropdownOptions?.transactionType?.filter(
      (type) => type.key === "SETTLEMENT" || type.key === "FX"
    ),
    locale
  ).forEach((type) => {
    transactionTypeOptions[type.value] = type.label;
  });

  const securityTypeOptions = {};
  getDropdownValues(dropdownOptions?.securityType, locale)?.forEach((type) => {
    securityTypeOptions[type.value] = type.label;
  });

  let countries = getDropdownValues(normalisedCountries(dropdownOptions?.country), locale);
  const EuroclearSettlementLocation = getDropdownValues(
    dropdownOptions?.settlementLocation?.filter((location) => location?.name === "Euroclear"),
    locale
  )[0];
  countries = [EuroclearSettlementLocation, ...countries];

  const countriesLookup = {};
  countries.forEach((country) => {
    countriesLookup[country?.value] = country?.label;
  });

  useWethaqAPIParams({
    currentGroupId: currentEntityGroup?.id,
  });

  const fetchInvoice = (payload) => dispatch(billingActionCreators.doReadInvoiceRequest(payload));

  useEffect(() => {
    dispatch(
      dropdownActionCreators.doFetchDropdownOptions({
        options: ["country", "transactionType", "securityType", "settlementLocation"],
      })
    );

    if (selectedRow) {
      fetchInvoice({ invoiceId: selectedRow?.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow]);

  useEffect(() => {
    setLocalPaymentHolidays(remotePaymentHolidays);
    setLocalSafekeepingCharges(remoteSafekeepingCharges);
    setLocalTransactionCharges(remoteTrxCharges);
    setLocalOutOfPocketExpenses(remoteOutOfPocketExpenses);
  }, [
    remotePaymentHolidays,
    remoteSafekeepingCharges,
    remoteTrxCharges,
    remoteOutOfPocketExpenses,
  ]);

  useEffect(() => {
    // fetch these entities for wethaq ops
    const fetchEntities = (payload) => dispatch(entitiesActionCreators.doFetchEntities(payload));
    const fetchAccounts = (payload) =>
      dispatch(cashManagementActionCreators.doFetchAccounts(payload));

    fetchEntities();
    fetchAccounts();
  }, [dispatch]);

  const processInvoiceItems = () => {
    const transactionChargesArray = localTransactionCharges.map((transactionCharge) => {
      const transactionChargeObject = {
        id: transactionCharge?.isNew ? undefined : transactionCharge.id,
        charge: roundNumber(Number(transactionCharge.total_amount), BANK_AMOUNT_DP),
        transaction_type_id: transactionCharge.transaction_type_id,
        asset_country_icsd_id: transactionCharge.asset_country_icsd_id,
        asset_type_id: transactionCharge.asset_type_id,
        total_amount: String(roundNumber(Number(transactionCharge.total_amount), BANK_AMOUNT_DP)),
        calculated_txn: transactionCharge.calculated_txn,
      };
      return transactionChargeObject;
    });

    const safekeepingChargesArray = localSafekeepingCharges.map((safekeepingCharge) => {
      const safekeepingChargeObject = {
        id: safekeepingCharge?.isNew ? undefined : safekeepingCharge.id,
        asset_type_id: safekeepingCharge.asset_type_id,
        asset_country_icsd_id: safekeepingCharge.asset_country_icsd_id,
        charge_in_bps: safekeepingCharge.charge_in_bps,
        calculated_valuation: safekeepingCharge.calculated_valuation,
        charge: String(safekeepingCharge.charge),
        band_start: Number(safekeepingCharge.band_start || 0),
        band_end: Number(safekeepingCharge.band_end || -1),
      };
      return safekeepingChargeObject;
    });

    const paymentHolidaysArray = localPaymentHolidays.map((paymentHoliday) => {
      const paymentHolidayObject = {
        id: paymentHoliday?.isNew ? undefined : paymentHoliday.id,
        holiday_ref: paymentHoliday?.holiday_ref || idRenderer(paymentHoliday.id),
        start_date: paymentHoliday?.start_date,
        end_date: paymentHoliday?.end_date,
        invoice_narrative: paymentHoliday?.invoice_narrative,
        is_active: paymentHoliday.isApplied,
      };
      return paymentHolidayObject;
    });

    const outOfPocketExpensesArray = localOutOfPocketExpenses.map((outOfPocketExpense) => {
      const outOfPocketExpenseObject = {
        id: outOfPocketExpense?.isNew ? undefined : outOfPocketExpense.id,
        expense_ref: outOfPocketExpense?.expense_ref || idRenderer(outOfPocketExpense.id),
        charge: String(outOfPocketExpense?.charge),
        expense_narrative: outOfPocketExpense?.expense_narrative,
      };
      return outOfPocketExpenseObject;
    });

    const invoiceItems = {
      transaction_charges_invoice_item: [...transactionChargesArray],
      safe_keeping_invoice_item: [...safekeepingChargesArray],
      payment_holidays_invoice_item: [...paymentHolidaysArray],
      out_of_pocket_expenses_invoice_item: [...outOfPocketExpensesArray],
    };

    return invoiceItems;
  };

  // Invoice
  const handleInvoiceSubmit = (values) => {
    const processedInvoiceItems = processInvoiceItems();

    const requestPayload = {
      min_charge: values.minimumCharge,
      amount: values.invoiceAmount,
      ...processedInvoiceItems,
    };
    // console.log('🚀 ~ file: index.js:209 ~ handleInvoiceSubmit ~ requestPayload:', requestPayload);

    dispatch(
      billingActionCreators.doUpdateInvoiceRequest({
        requestPayload,
        invoiceId: selectedRow?.id,
        fetchInvoiceParams,
      })
    );
  };

  const handleApprove = () => {
    const foundApprove = dropdownOptions?.invoiceStatus.find((status) => status.key === "open");

    const requestPayload = {
      status_id: foundApprove.id,
      updated_by: { String: currentUserId, valid: true },
      approved_by: { String: currentUserId, valid: true },
      updated_at: moment(),
      invoice_id: selectedRow?.id,
    };

    dispatch(
      billingActionCreators.doApproveInvoiceRequest({
        requestPayload,
        invoiceId: selectedRow?.id,
        fetchInvoiceParams,
      })
    );
    handleClose();
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      scroll="body"
      maxWidth="lg"
    >
      <Formik
        initialValues={{
          client: invoice?.entity_name || "",
          invoiceRef: invoice?.reference || "",
          invoiceDate: invoice ? dateRenderer(invoice?.date) : null,
          minimumCharge: roundNumber(Number(selectedRow?.minCharge), BANK_AMOUNT_DP) || 0,
          invoiceAmount:
            roundNumber(
              Number(totalInvoiceAmount === null ? selectedRow?.amount : totalInvoiceAmount),
              BANK_AMOUNT_DP
            ) || 0,
        }}
        // validationSchema={addFXTransactionFormSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          handleInvoiceSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => {
          const handleInvoiceCalculation = () => {
            const processedInvoiceItems = processInvoiceItems();

            const requestPayload = {
              min_charge: values.minimumCharge,
              ...processedInvoiceItems,
            };
            console.log(
              "🚀 ~ file: index.js:249 ~ handleInvoiceCalculation ~ requestPayload:",
              JSON.stringify(requestPayload)
            );

            dispatch(
              billingActionCreators.doCalculateInvoiceRequest({
                requestPayload,
                invoiceId: selectedRow?.id,
              })
            );
            setFieldValue(
              "invoiceAmount",
              roundNumber(
                Number(totalInvoiceAmount === null ? selectedRow?.amount : totalInvoiceAmount),
                BANK_AMOUNT_DP
              ) || 0
            );
          };

          return (
            <form onSubmit={handleSubmit}>
              <DialogTitle id="form-dialog-title">
                {" "}
                {t("Invoice Management.View Dialog.Invoice", {
                  type: v.capitalize(modalType),
                })}
              </DialogTitle>

              <DialogContent>
                <Box mb={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={6} container>
                      <Grid item xs={6} container alignContent="flex-start">
                        <Typography className="mt-4">
                          {t("Invoice Management.View Dialog.Client")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} container alignContent="center" className="px-1">
                        <Field
                          fullWidth
                          disabled
                          component={TextField}
                          name="client"
                          variant="filled"
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} lg={6} container>
                      <Grid item xs={6} container alignContent="flex-start">
                        <Typography className="mt-4">
                          {t("Invoice Management.View Dialog.Invoice Reference")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} container alignContent="center" className="px-1">
                        <Field
                          fullWidth
                          disabled
                          component={TextField}
                          name="invoiceRef"
                          variant="filled"
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} lg={6} container>
                      <Grid item xs={6} container alignContent="flex-start">
                        <Typography className="mt-4">
                          {t("Invoice Management.View Dialog.Invoice Date")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} container alignContent="center" className="px-1">
                        <Field
                          fullWidth
                          disabled
                          component={TextField}
                          name="invoiceDate"
                          variant="filled"
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} lg={6} container>
                      <Grid item xs={6} container alignContent="flex-start">
                        <Typography className="mt-4">
                          {t("Invoice Management.View Dialog.Minimum Charge (USD)")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} container alignContent="center" className="px-1">
                        <Field
                          disabled={modalType !== "amend"}
                          fullWidth
                          component={TextField}
                          name="minimumCharge"
                          variant="filled"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <TransactionChargesSection
                    modalType={modalType}
                    selectedRow={selectedRow}
                    transactionTypeOptions={transactionTypeOptions}
                    securityTypeOptions={securityTypeOptions}
                    countriesLookup={countriesLookup}
                    localTransactionCharges={localTransactionCharges}
                    setLocalTransactionCharges={setLocalTransactionCharges}
                  />

                  <SafekeepingChargesSection
                    modalType={modalType}
                    selectedRow={selectedRow}
                    securityTypeOptions={securityTypeOptions}
                    countriesLookup={countriesLookup}
                    localSafekeepingCharges={localSafekeepingCharges}
                    setLocalSafekeepingCharges={setLocalSafekeepingCharges}
                  />

                  <PaymentHolidaysSection
                    modalType={modalType}
                    selectedRow={selectedRow}
                    localPaymentHolidays={localPaymentHolidays}
                    setLocalPaymentHolidays={setLocalPaymentHolidays}
                  />

                  <OutOfPocketExpensesSections
                    modalType={modalType}
                    localOutOfPocketExpenses={localOutOfPocketExpenses}
                    setLocalOutOfPocketExpenses={setLocalOutOfPocketExpenses}
                  />

                  <Grid container justifyContent="flex-end" alignContent="center">
                    <Grid
                      xs
                      item
                      container
                      direction="column"
                      justifyContent="center"
                      alignContent="flex-end"
                    >
                      <Typography>Invoice Amount (USD)</Typography>
                    </Grid>

                    <Field
                      disabled={modalType !== "amend"}
                      component={TextField}
                      name="invoiceAmount"
                      variant="filled"
                      className="w-[20rem] ml-6 mr-2 "
                    />
                    {modalType === "amend" && (
                      <Tooltip title="Update" placement="top">
                        <Fab
                          aria-label="update"
                          size="small"
                          color="primary"
                          onClick={() => handleInvoiceCalculation()}
                        >
                          <RefreshIcon />
                        </Fab>
                      </Tooltip>
                    )}
                  </Grid>
                </Box>
              </DialogContent>

              <DialogActions>
                <Grid container justifyContent="flex-end" className="w-full">
                  <Grid item lg={3}>
                    <Button
                      fullWidth
                      onClick={() => {
                        handleClose();
                      }}
                      color="primary"
                    >
                      {t("translation:Miscellaneous.Cancel")}
                    </Button>
                  </Grid>
                </Grid>
                {modalType === "amend" && (
                  <Grid item lg={3}>
                    <Button fullWidth type="submit" variant="contained" color="primary">
                      {t("translation:Miscellaneous.Submit")}
                    </Button>
                  </Grid>
                )}
                {modalType === "approve" && (
                  <Grid item lg={3}>
                    <Button
                      fullWidth
                      onClick={() => {
                        handleApprove();
                      }}
                      variant="contained"
                      color="primary"
                    >
                      {t("translation:Miscellaneous.Approve")}
                    </Button>
                  </Grid>
                )}
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default InvoiceViewDialog;
