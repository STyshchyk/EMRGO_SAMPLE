import { createRef, Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import makeAnimated from "react-select/animated";
import { toast } from "react-toastify";

import { Select } from "@emrgo-frontend/shared-ui";
import MaterialTable from "@material-table/core";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import WrapTextIcon from "@mui/icons-material/WrapText";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Paper from "@mui/material/Paper";
import MuiTextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, Formik } from "formik";
import { TextField } from "formik-mui";
import groupBy from "lodash.groupby";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import v from "voca";
import * as yup from "yup";

import { currencyRenderer, dateRenderer, idRenderer } from "../../constants/renderers";
import { useTheme } from "../../context/theme-context";
import { generateAccountOptions } from "../../helpers/billing";
import normalisedCountries from "../../helpers/countries";
import { findOverlaps } from "../../helpers/dates";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as billingActionCreators from "../../redux/actionCreators/billing";
import * as cashManagementActionCreators from "../../redux/actionCreators/cashManagement";
import * as dropdownActionCreators from "../../redux/actionCreators/dropdown";
import * as entitiesActionCreators from "../../redux/actionCreators/entities";
import * as authSelectors from "../../redux/selectors/auth";
import * as billingSelectors from "../../redux/selectors/billing";
import * as cashManagementSelectors from "../../redux/selectors/cashManagement";
import * as dropdownSelectors from "../../redux/selectors/dropdown";
import * as entitiesSelectors from "../../redux/selectors/entities";
import selectStyles from "../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../utils/form";
import MaterialTableCustomButtonRenderer from "../MaterialTableCustomButtonRenderer";
import MaterialTableCustomDatepickerRenderer from "../MaterialTableCustomDatepickerRenderer";
import MaterialTableCustomDropdownRenderer from "../MaterialTableCustomDropdownRenderer";

// import { Divider } from '@mui/material';

const animatedComponents = makeAnimated();

const ToastMessageRenderer = ({ groupedMessages }) => (
  <Box>
    <List dense>
      <Fragment>
        {groupedMessages.map((group, index) => (
          <Fragment key={index}>
            <ListSubheader disableSticky className="text-xs text-left text-gray-500 pt-4">
              {group.name}
            </ListSubheader>
            {group.messages.map((message) => (
              <Fragment key={message.text}>
                <ListItem>
                  <ListItemIcon>{message.icon}</ListItemIcon>
                  <ListItemText
                    primary={message.text}
                    secondary={null}
                    className="text-xl text-left  text-gray-700"
                  />
                </ListItem>
              </Fragment>
            ))}
            {index !== groupedMessages.length - 1 ? <Divider /> : null}
          </Fragment>
        ))}
      </Fragment>
    </List>
  </Box>
);

const ClientRateCardViewDialog = ({ open, handleClose, selectedRow, modalType }) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { locale } = theme;
  const { t } = useTranslation(["billing"]);
  const [localPaymentHolidays, setLocalPaymentHolidays] = useState([]);
  const [localSafekeepingCharges, setLocalSafekeepingCharges] = useState([]);
  const [localTransactionCharges, setLocalTransactionCharges] = useState([]);
  const [paymentHolidayOverlaps, setPaymentHolidayOverlaps] = useState([]);
  const [showPaymentHolidayOverlapsError, setShowPaymentHolidayOverlapsError] = useState(true);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentUserId = useSelector(authSelectors.selectUserId);
  const dropdownOptions = useSelector(dropdownSelectors.selectDropdownOptions);
  const rateCardConfig = useSelector(billingSelectors.selectCurrentRateCard);
  const entitiesList = useSelector(entitiesSelectors.selectEntities);
  const USDCurrency = dropdownOptions?.currency?.find((currency) => currency.name === "USD");
  const sourceAccounts = generateAccountOptions(
    useSelector(cashManagementSelectors.selectAccountsData)?.data || []
  );

  const rateCard = rateCardConfig?.rate_card;
  const remotePaymentHolidays = useMemo(
    () => rateCardConfig?.payment_holiday?.filter((holidays) => holidays.is_active) || [],
    [rateCardConfig?.payment_holiday]
  );
  const remoteSafekeepingCharges = useMemo(
    () => rateCardConfig?.safe_keeping_charge?.filter((charges) => charges.is_active) || [],
    [rateCardConfig?.safe_keeping_charge]
  );
  const remoteTrxCharges = useMemo(
    () => rateCardConfig?.trx_charge?.filter((charges) => charges.is_active) || [],
    [rateCardConfig?.trx_charge]
  );

  const currentEntity = entitiesList.find((entity) => entity.id === rateCard?.entity_id);
  const foundGroup = currentEntity?.groups?.find((group) => group.entityType === "INVESTOR");

  const filteredAccounts = sourceAccounts
    ?.filter((account) => account.value.entityGroupId === foundGroup?.id)
    .filter((account) => account.value.currencyId === USDCurrency?.id);
  const selectedAccount = filteredAccounts.find(
    (account) => account.id === rateCard?.billingAccount
  );

  const billingPeriodOptions = getDropdownValues(
    dropdownOptions?.reportingCycle?.filter((period) => period.key === "monthly"),
    locale
  );
  const selectedBillingPeriod = billingPeriodOptions.find(
    (period) => period.value === rateCard?.billing_period_id
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

  const fetchRateCard = (payload) => dispatch(billingActionCreators.doReadRatecardRequest(payload));

  useEffect(() => {
    dispatch(
      dropdownActionCreators.doFetchDropdownOptions({
        options: ["country", "transactionType", "securityType", "settlementLocation"],
      })
    );

    if (selectedRow) {
      fetchRateCard({ clientRateCardId: selectedRow?.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow]);

  useEffect(() => {
    setLocalPaymentHolidays(remotePaymentHolidays);
    setLocalSafekeepingCharges(remoteSafekeepingCharges);
    setLocalTransactionCharges(remoteTrxCharges);
  }, [remotePaymentHolidays, remoteSafekeepingCharges, remoteTrxCharges]);

  useEffect(() => {
    // fetch these entities for wethaq ops
    const fetchEntities = (payload) => dispatch(entitiesActionCreators.doFetchEntities(payload));
    const fetchAccounts = (payload) =>
      dispatch(cashManagementActionCreators.doFetchAccounts(payload));

    fetchEntities();
    fetchAccounts();
  }, [dispatch]);

  // TRANSACTIONS
  const transactionTableRef = createRef();

  const transactionTableColumns = [
    {
      title: "Transaction Type",
      field: "transaction_type_id",
      lookup: transactionTypeOptions,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: "Security Type",
      field: "asset_type_id",
      lookup: securityTypeOptions,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: "Security Country / ICSD",
      field: "security_country_icsd_id",
      lookup: countriesLookup,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: "Charge",
      field: "charge",
      initialEditValue: "",
      editComponent: (props) => (
        <MuiTextField
          label="Charge ($)"
          variant="filled"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
      render: (rowData) => `$${currencyRenderer(rowData.charge)}`,
    },
  ];

  const handleAddTransaction = (requestPayload, resolve) => {
    setLocalTransactionCharges([...localTransactionCharges, requestPayload]);

    setTimeout(() => {
      resolve();
    }, 500);
  };

  const handleDeleteTransaction = (requestObject, resolve) => {
    const filteredTransactions = localTransactionCharges.filter(
      (charge) => !requestObject.includes(charge.id)
    );
    setLocalTransactionCharges([...filteredTransactions]);
    resolve();
  };

  // SAFEKEEPING
  const safekeepingTableRef = createRef();

  const safekeepingTableColumns = [
    {
      title: "Security Type",
      field: "asset_type_id",
      lookup: securityTypeOptions,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: "Security Country / ICSD",
      field: "security_country_icsd_id",
      lookup: countriesLookup,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: "Txn Band Start",
      field: "band_start",
      editComponent: (props) => (
        <MuiTextField
          label="Band Start ($)"
          variant="filled"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Txn Band End",
      field: "band_end",
      editComponent: (props) => (
        <MuiTextField
          label="Band End ($)"
          variant="filled"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Charge(BPS)",
      field: "charge_in_bps",
      initialEditValue: "",
      editComponent: (props) => (
        <MuiTextField
          label="Charge ($)"
          variant="filled"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
      render: (rowData) => `$${currencyRenderer(rowData.charge_in_bps)}`,
    },
  ];

  const processedSafeKeepingData = localSafekeepingCharges.map((band) => {
    const concatedKey = `${band?.name?.String}_${v.camelCase(band?.name_2?.String)}`;
    return {
      ...band,
      band_end: band?.band_end === -1 ? Infinity : band?.band_end,
      type: concatedKey,
    };
  });

  const handleAddSafekeeping = (requestPayload, resolve) => {
    setLocalSafekeepingCharges([...localSafekeepingCharges, requestPayload]);
    setTimeout(() => {
      resolve();
    }, 500);
  };

  const handleDeleteSafekeeping = (requestObject, resolve) => {
    const filteredCharges = localSafekeepingCharges.filter(
      (charge) => !requestObject.includes(charge.id)
    );
    setLocalSafekeepingCharges([...filteredCharges]);
    resolve();
  };

  // HOLIDAY
  const holidayTableRef = createRef();

  const holidayTableColumns = [
    {
      title: "Holiday Ref",
      field: "id",
      editable: "never",
      render: (rowData) => idRenderer(rowData.id),
    },
    {
      title: "Start Date",
      field: "start_date",
      render: (rowData) => dateRenderer(rowData.start_date),
      initialEditValue: moment(),
      editComponent: (props) => <MaterialTableCustomDatepickerRenderer openTo="year" {...props} />,
    },
    {
      title: "End Date",
      field: "end_date",
      render: (rowData) => dateRenderer(rowData.end_date),
      initialEditValue: moment(),
      editComponent: (props) => <MaterialTableCustomDatepickerRenderer openTo="year" {...props} />,
    },
    {
      title: "Invoice Narrative",
      field: "narrative.String",
      initialEditValue: "",
      editComponent: (props) => (
        <MuiTextField
          label="Narrative"
          variant="filled"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    },
  ];

  useEffect(() => {
    const { overlaps } = findOverlaps(localPaymentHolidays);

    setPaymentHolidayOverlaps(overlaps);
  }, [localPaymentHolidays]);

  const handleAddHoliday = (requestPayload, resolve) => {
    setLocalPaymentHolidays([...localPaymentHolidays, requestPayload]);
    setTimeout(() => {
      resolve();
    }, 500);
  };

  const handleDeleteHoliday = (requestObject, resolve) => {
    const filteredHolidays = localPaymentHolidays.filter(
      (holiday) => !requestObject.includes(holiday.id)
    );
    setLocalPaymentHolidays([...filteredHolidays]);
    resolve();
  };

  // Rate Card
  const handleRateCardSubmit = (values) => {
    // Validate Safekeeping Bands

    /*
    Tests
    1. Bands need to start from 0
    2. Bands need to end at Infinity
    3. Bands should not overlap
    4. Bands should not have gaps
    5. Band validations should be grouped by security type - country combination
    */

    const groupedMessages = [];

    // Get safekeeping bands data
    const safekeepingFormData = safekeepingTableRef.current.dataManager.data;

    // Group by securityType and Country combination that is saved in the type key
    const groupedData = groupBy(safekeepingFormData, "type");

    // Loop through types
    // eslint-disable-next-line no-restricted-syntax
    for (const [, bandArray] of Object.entries(groupedData)) {
      const messages = [];
      const bandLength = bandArray.length;

      // Sort Type Array by txnBandStart
      const sortedBands = bandArray.sort((a, b) => a.band_start - b.band_start);

      // Check if first band starts at 0
      const firstBand = sortedBands[0];
      if (firstBand.band_start !== 0) {
        messages.push({ text: `Bands do not start from 0`, icon: <ErrorOutlineIcon /> });
      }

      // Check for gaps and overlaps
      sortedBands.forEach((band, index) => {
        // Skip check for last band
        if (index !== bandLength - 1) {
          const nextBand = sortedBands[index + 1];
          if (band.band_end + 1 !== nextBand.band_start) {
            if (band.band_end >= nextBand.band_start) {
              // Overlap detected
              messages.push({
                text: `Overlap between bands ${band.band_start}-${band.band_end} and ${nextBand.band_start}-${nextBand.band_end}`,
                icon: <SwapHorizIcon />,
              });
            } else {
              // Gap detected
              messages.push({
                text: `Unaccounted gap between ${band.band_end} and ${nextBand.band_start}`,
                icon: <WrapTextIcon />,
              });
            }
          }
        }
      });

      // Check if last band ends at Infinity
      const lastBand = sortedBands[bandLength - 1];
      if (lastBand.band_end !== Infinity) {
        messages.push({ text: `Bands do not end at Infinity`, icon: <AllInclusiveIcon /> });
      }

      if (messages.length > 0) {
        groupedMessages.push({
          name: `${v.capitalize(firstBand.name.String)} ( ${firstBand.name_2.String} )`,
          messages,
        });
      }
    }

    if (groupedMessages.length > 0) {
      toast(<ToastMessageRenderer groupedMessages={groupedMessages} />, {
        position: "bottom-left",
        closeOnClick: true,
        autoClose: 20000,
        limit: 1,
      });
    } else {
      // const foundAmend = dropdownOptions?.clientRateCardStatus.find((status) => status.key === 'amended');

      const requestPayload = {
        min_charge: values.minimumCharge,
        billing_period_id: values.billingPeriod.value,
        transaction_charges: localTransactionCharges.map((trxCharge) => {
          const newObject = { ...trxCharge, charge: trxCharge.charge.toString() };
          delete newObject.id;
          return newObject;
        }),
        safe_keeping_charges: localSafekeepingCharges.map((charge) => {
          const newObject = { ...charge };
          delete newObject.id;
          return newObject;
        }),
        payment_holidays: localPaymentHolidays.map((holiday) => {
          const newObject = { ...holiday };
          delete newObject.id;
          return newObject;
        }),
      };

      dispatch(
        billingActionCreators.doUpdateRatecardRequest({
          requestPayload,
          clientRateCardId: selectedRow?.id,
        })
      );
      handleClose();
    }
  };

  const handleApprove = () => {
    const foundApprove = dropdownOptions?.clientRateCardStatus.find(
      (status) => status.key === "active"
    );

    const requestPayload = {
      status_id: foundApprove.id,
      updated_by: { String: currentUserId, valid: true },
      approved_by: { String: currentUserId, valid: true },
      updated_at: moment(),
      client_rate_card_id: selectedRow?.id,
    };

    dispatch(
      billingActionCreators.doApproveRatecardRequest({
        requestPayload,
        clientRateCardId: selectedRow?.id,
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
      maxWidth="md"
    >
      <Formik
        initialValues={{
          client: currentEntity?.corporateEntityName || "",
          billingAccount: selectedAccount || null,
          billingPeriod: selectedBillingPeriod || null,
          minimumCharge: selectedRow?.minCharge || 0,
        }}
        // validationSchema={addFXTransactionFormSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          handleRateCardSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <DialogTitle id="form-dialog-title">
              {" "}
              {t("Client Rate Card.View Dialog.Client Rate Card", {
                type: v.capitalize(modalType),
              })}
            </DialogTitle>

            <DialogContent>
              <Box mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={6} container>
                    <Grid item xs={6} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t("Client Rate Card.View Dialog.Client")}
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
                        {t("Client Rate Card.View Dialog.Billing Account")}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} container alignContent="center" className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          placeholder="Select.."
                          components={{
                            ...animatedComponents,
                          }}
                          isDisabled={true}
                          isSearchable
                          styles={selectStyles}
                          value={values.billingAccount}
                          options={filteredAccounts}
                          onChange={(selected) => {
                            setFieldValue("billingAccount", selected);
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="entity"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6} container>
                    <Grid item xs={6} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t("Client Rate Card.View Dialog.Billing Period")}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} container alignContent="center" className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          placeholder="Select.."
                          components={{
                            ...animatedComponents,
                          }}
                          isDisabled={modalType !== "amend"}
                          isSearchable
                          styles={selectStyles}
                          value={values.billingPeriod}
                          options={billingPeriodOptions}
                          onChange={(selected) => {
                            setFieldValue("billingPeriod", selected);
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="entity"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6} container>
                    <Grid item xs={6} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t("Client Rate Card.View Dialog.Minimum Charge (USD)")}
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
                <Box my={4}>
                  <MaterialTable
                    title="Transaction Charges"
                    columns={transactionTableColumns}
                    tableRef={transactionTableRef}
                    components={{
                      Container: (props) => <Paper {...props} elevation={0} />,
                      Action: (props) => <MaterialTableCustomButtonRenderer {...props} />,
                    }}
                    options={{
                      // search: false,
                      searchFieldVariant: "outlined",
                      selection: modalType === "amend",
                      actionsColumnIndex: -1,
                    }}
                    data={localTransactionCharges}
                    editable={
                      modalType === "amend"
                        ? {
                            onRowAdd: (newData) =>
                              new Promise((resolve, reject) => {
                                const schema = yup.object().shape({
                                  transaction_type_id: yup
                                    .string()
                                    .required("Transaction type is required"),
                                  asset_type_id: yup.string().required("Security type is required"),
                                  security_country_icsd_id: yup
                                    .string()
                                    .required("Country/ICSD is required"),
                                  charge: yup
                                    .number()
                                    .required("Charge is required")
                                    .positive("Charge must be a positive number"),
                                });

                                const requestObject = {
                                  id: uuidv4(),
                                  client_rate_card_id: selectedRow?.id,
                                  transaction_type_id: newData?.transaction_type_id?.value,
                                  asset_type_id: newData?.asset_type_id?.value,
                                  security_country_icsd_id:
                                    newData?.security_country_icsd_id?.value,
                                  charge: Number(newData?.charge),
                                };

                                schema
                                  .validate(requestObject)
                                  .then((valid) => {
                                    if (valid) {
                                      handleAddTransaction(requestObject, resolve);
                                    } else {
                                      toast.warning(
                                        "Transaction data inputted is incomplete/invalid.",
                                        2000
                                      );
                                      reject();
                                    }
                                  })
                                  .catch(({ errors }) => {
                                    const groupedMessages = [
                                      {
                                        name: "Transaction Charge Errors",
                                        messages: errors.map((error) => {
                                          const errorIcon = <ErrorOutlineIcon />;
                                          return {
                                            text: error,
                                            icon: errorIcon,
                                          };
                                        }),
                                      },
                                    ];
                                    toast(
                                      <ToastMessageRenderer groupedMessages={groupedMessages} />,
                                      {
                                        position: "bottom-left",
                                        closeOnClick: true,
                                        autoClose: 10000,
                                        limit: 1,
                                      }
                                    );
                                    reject();
                                    return {};
                                  });
                              }),
                            onRowDelete: (oldData) =>
                              new Promise((resolve) => {
                                const requestObject = [oldData.id];
                                handleDeleteTransaction(requestObject, resolve);
                              }),
                          }
                        : {}
                    }
                    actions={
                      modalType === "amend"
                        ? [
                            {
                              tooltip: "Bulk Delete",
                              icon: "delete",
                              onClick: (evt, rowData) =>
                                new Promise((resolve) => {
                                  const requestObject = rowData.map((row) => row.id);
                                  handleDeleteTransaction(requestObject, resolve);
                                }),
                            },
                          ]
                        : []
                    }
                  />
                </Box>
                <Box my={4}>
                  <MaterialTable
                    title="Safekeeping Charges"
                    columns={safekeepingTableColumns}
                    tableRef={safekeepingTableRef}
                    components={{
                      Container: (props) => <Paper {...props} elevation={0} />,
                      Action: (props) => <MaterialTableCustomButtonRenderer {...props} />,
                    }}
                    options={{
                      // search: false,
                      searchFieldVariant: "outlined",
                      selection: modalType === "amend",
                      actionsColumnIndex: -1,
                    }}
                    data={processedSafeKeepingData}
                    editable={
                      modalType === "amend"
                        ? {
                            onRowAdd: (newData) =>
                              new Promise((resolve, reject) => {
                                const schema = yup.object().shape({
                                  asset_type_id: yup.string().required("Security Type is required"),
                                  security_country_icsd_id: yup
                                    .string()
                                    .required("Country/ICSD is required"),
                                  band_start: yup
                                    .number()
                                    .integer("Band start amount must be an integer"),
                                  band_end: yup
                                    .number()
                                    .integer("Band end amount must be an integer"),
                                  charge_in_bps: yup
                                    .number()
                                    .required("Charge is required")
                                    .positive("Charge must be a positive number"),
                                });

                                const requestObject = {
                                  id: uuidv4(),
                                  client_rate_card_id: selectedRow?.id,
                                  asset_type_id: newData?.asset_type_id?.value,
                                  security_country_icsd_id:
                                    newData?.security_country_icsd_id?.value,
                                  band_start: Number(newData.band_start || 0),
                                  band_end: Number(newData.band_end || -1),
                                  charge_in_bps: Number(newData?.charge_in_bps),
                                  name: {
                                    String: newData?.asset_type_id?.label,
                                    valid: true,
                                  },
                                  name_2: {
                                    String: newData?.security_country_icsd_id?.label,
                                    valid: true,
                                  },
                                };

                                schema
                                  .validate(requestObject)
                                  .then((valid) => {
                                    if (valid) {
                                      handleAddSafekeeping(requestObject, resolve);
                                    } else {
                                      toast.warning(
                                        "Safekeeping data inputted is incomplete/invalid.",
                                        2000
                                      );
                                      reject();
                                    }
                                  })
                                  .catch(({ errors }) => {
                                    const groupedMessages = [
                                      {
                                        name: "Safekeeping Charge Errors",
                                        messages: errors?.map((error) => {
                                          const errorIcon = <ErrorOutlineIcon />;
                                          return {
                                            text: error,
                                            icon: errorIcon,
                                          };
                                        }),
                                      },
                                    ];
                                    toast(
                                      <ToastMessageRenderer groupedMessages={groupedMessages} />,
                                      {
                                        position: "bottom-left",
                                        closeOnClick: true,
                                        autoClose: 10000,
                                        limit: 1,
                                      }
                                    );
                                    reject();
                                  });
                              }),
                            onRowDelete: (oldData) =>
                              new Promise((resolve) => {
                                const requestObject = [oldData.id];
                                handleDeleteSafekeeping(requestObject, resolve);
                              }),
                          }
                        : {}
                    }
                    actions={
                      modalType === "amend"
                        ? [
                            {
                              tooltip: "Bulk Delete",
                              icon: "delete",
                              onClick: (evt, rowData) =>
                                new Promise((resolve) => {
                                  const requestObject = rowData.map((row) => row.id);
                                  handleDeleteSafekeeping(requestObject, resolve);
                                }),
                            },
                          ]
                        : []
                    }
                  />
                </Box>
                <Box my={4}>
                  <MaterialTable
                    title={
                      <Typography
                        variant="h6"
                        className={paymentHolidayOverlaps.length > 0 ? "text-yellow-500" : ""}
                      >
                        Payment Holidays
                        {paymentHolidayOverlaps.length > 0 ? (
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            onClick={() => {
                              setShowPaymentHolidayOverlapsError(true);
                            }}
                            size="large"
                          >
                            <ErrorOutlineIcon fontSize="inherit" />
                          </IconButton>
                        ) : (
                          ""
                        )}
                      </Typography>
                    }
                    columns={holidayTableColumns}
                    tableRef={holidayTableRef}
                    components={{
                      Container: (props) => <Paper {...props} elevation={0} />,
                      Action: (props) => <MaterialTableCustomButtonRenderer {...props} />,
                    }}
                    options={{
                      // search: false,
                      searchFieldVariant: "outlined",
                      selection: modalType === "amend",
                      actionsColumnIndex: -1,
                    }}
                    data={localPaymentHolidays}
                    editable={
                      modalType === "amend"
                        ? {
                            onRowAdd: (newData) =>
                              new Promise((resolve, reject) => {
                                const schema = yup.object().shape({
                                  start_date: yup.date().required("Start Date is required"),
                                  end_date: yup.date().required("End Date is required"),
                                  // end_date: yup.date().min(yup.ref('startDate'), "End date can't be before start date").required('End Date is required'),
                                  // narrative: yup.string().required('Invoice Narrative is required'),
                                });

                                const requestObject = {
                                  id: uuidv4(),
                                  client_rate_card_id: selectedRow?.id,
                                  start_date: newData?.start_date?.format(),
                                  end_date: newData?.end_date?.format(),
                                  narrative: newData?.narrative,
                                };

                                schema
                                  .validate(requestObject)
                                  .then((valid) => {
                                    if (valid) {
                                      handleAddHoliday(requestObject, resolve);
                                    } else {
                                      toast.warning(
                                        "Safekeeping data inputted is incomplete/invalid.",
                                        2000
                                      );
                                      reject();
                                    }
                                  })
                                  .catch(({ errors }) => {
                                    const groupedMessages = [
                                      {
                                        name: "Payment Holidays Errors",
                                        messages: errors?.map((error) => {
                                          const errorIcon = <ErrorOutlineIcon />;
                                          return {
                                            text: error,
                                            icon: errorIcon,
                                          };
                                        }),
                                      },
                                    ];
                                    toast(
                                      <ToastMessageRenderer groupedMessages={groupedMessages} />,
                                      {
                                        position: "bottom-left",
                                        closeOnClick: true,
                                        autoClose: 10000,
                                        limit: 1,
                                      }
                                    );
                                    reject();
                                  });
                              }),
                            onRowDelete: (oldData) =>
                              new Promise((resolve) => {
                                const requestObject = [oldData.id];

                                handleDeleteHoliday(requestObject, resolve);
                              }),
                          }
                        : {}
                    }
                    actions={
                      modalType === "amend"
                        ? [
                            {
                              tooltip: "Bulk Delete",
                              icon: "delete",
                              onClick: (evt, rowData) =>
                                new Promise((resolve) => {
                                  const requestObject = rowData.map((row) => row.id);
                                  handleDeleteHoliday(requestObject, resolve);
                                }),
                            },
                          ]
                        : []
                    }
                  />
                  {paymentHolidayOverlaps.length > 0 && showPaymentHolidayOverlapsError ? (
                    <Fragment>
                      <Alert
                        severity="warning"
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setShowPaymentHolidayOverlapsError(false);
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                      >
                        <AlertTitle>
                          {t("Client Rate Card.View Dialog.OverlappingPeriodMessageKey", {
                            count: paymentHolidayOverlaps.length,
                          })}
                        </AlertTitle>
                        <ul>
                          {paymentHolidayOverlaps.map((overlap) => {
                            const firstPeriod = overlap[0];
                            const secondPeriod = overlap[1];
                            return (
                              <li className="list-disc">
                                <Typography>
                                  Holiday Ref #{idRenderer(firstPeriod.id)} and #
                                  {idRenderer(secondPeriod.id)}
                                </Typography>
                              </li>
                            );
                          })}
                        </ul>
                      </Alert>
                    </Fragment>
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
            </DialogContent>

            <DialogActions>
              <Grid container justifyContent="flex-end" className="w-full">
                <Grid item lg={4}>
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
                <Grid item lg={4}>
                  <Button fullWidth type="submit" variant="contained" color="primary">
                    {t("translation:Miscellaneous.Submit")}
                  </Button>
                </Grid>
              )}
              {modalType === "approve" && (
                <Grid item lg={4}>
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
        )}
      </Formik>
    </Dialog>
  );
};

export default ClientRateCardViewDialog;
