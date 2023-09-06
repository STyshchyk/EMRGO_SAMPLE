import { useEffect, useMemo, useState,forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "@emrgo-frontend/shared-ui";
import makeAnimated from "react-select/animated";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ErrorMessage, Field, Formik } from "formik";
import { TextField } from "formik-mui";
import moment from "moment";
import PropTypes from "prop-types";

import { externalSecurityStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import { useTheme } from "../../context/theme-context";
import normalisedCountries from "../../helpers/countries";
import * as externalSecuritiesActionCreators from "../../redux/actionCreators/externalSecurities";
import * as formActionCreators from "../../redux/actionCreators/form";
import * as issuanceActionCreators from "../../redux/actionCreators/issuance";
import * as externalSecuritiesSelectors from "../../redux/selectors/externalSecurities";
import * as selectFormValues from "../../redux/selectors/form";
import * as issuanceSelectors from "../../redux/selectors/issuance";
import selectStyles from "../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../utils/form";
import { addSecurityFormSchema } from "../../validationSchemas";
import AutoSaveFields from "../AutoSaveFields";

const animatedComponents = makeAnimated();

const CustomNumberInputField = forwardRef((props,ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      decimalScale={3}
    />
  );
});

CustomNumberInputField.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

/*
    countryId: Joi.string().allow(null, '').guid(),
    currency: Joi.string().allow(null, '').guid(),
    dayCountConvention: Joi.string().allow(null, '').guid(),
    denomination: Joi.string().guid(),
    exchangeCode: Joi.string().allow(null, ''),
    formOfOffering: Joi.string().allow(null, '').guid(),
    frequency: Joi.string().allow(null, '').guid(),
    governingLaw: Joi.string().allow(null, '').guid(),
    guarantor: Joi.string().allow(null, ''),
    isin: Joi.string().allow(null, ''),
    issuanceAmount: Joi.number().allow(null, ''),
    issuanceName: Joi.string().allow('', null).trim(),
    issueDate: Joi.string().allow(null, ''),
    jurisdiction: Joi.string().allow(null, '').guid(),
    listing: Joi.string().allow(null, '').guid(),
    longName: Joi.string(),
    maturityAmount: Joi.number().allow(null, ''),
    maturityDate: Joi.string().allow(null, ''),
    name: Joi.string().allow('', null).trim(),
    pricingMethod: Joi.string().allow(null, '').guid(),
    profitRate: Joi.number().allow(null, ''),
    profitRateTerms: Joi.string().allow(null, '').guid(),
    ranking: Joi.string().allow(null, '').guid(),
    sellingRestrictions: Joi.string().allow(null, '').guid(),
    shariahCompliance: Joi.string().allow(null, '').guid(),
    shortName: Joi.string(),
    status: Joi.string().valid([Object.values(externalSecuritiesStatus)]),
    ticker: Joi.string(),
    underlyingAssets: Joi.string().allow(null, ''),
    useOfProceeds: Joi.string().allow(null, '').guid(),
    wsn: Joi.string().allow(null, ''),
*/

const initial = {
  name: "",
  shortName: "",
  longName: "",
  issuanceName: "",
  isin: "",
  ticker: "",
  profitRate: "",
  issuanceAmount: "",
  frequency: null,
  country: null,
  currency: null,
  maturityDate: null,
  issueDate: null,
  denomination: null,
  status: null,
};

const AddSecurityDialog = ({ open, handleClose, selectedRow, setSelectedRow }) => {
  const [initialValues, setInitialValues] = useState(initial);
  const dispatch = useDispatch();
  const formvalues = useSelector(selectFormValues.selectFormValues);
  const fetchingValues = useSelector(selectFormValues.formValuesFetching);
  const { t } = useTranslation(["external_securities","translation"]);
  const { theme } = useTheme();
  const { locale } = theme;
  const isEdit = selectedRow !== null;

  // selectors
  const formOptions = useSelector(issuanceSelectors.selectDropDowns);
  const externalSecuritiesList = useSelector(
    externalSecuritiesSelectors.selectExternalSecuritiesList
  );

  const fetchExternalSecuritiesList = () =>
    dispatch(externalSecuritiesActionCreators.doFetchExternalSecuritiesList());

  useEffect(() => {
    const fetchFormOptions = (payload) =>
      dispatch(issuanceActionCreators.doFetchFormOptions(payload));
    fetchFormOptions({
      options: ["currency", "rating", "denomination", "frequency", "country"],
    });
  }, [dispatch]);

  const buildRequestPayload = (values) => {
    const requestPayload = { ...values }; // make a shallow copy of values so that req payload doesnt mutate formik values.

    const selectFields = ["currency", "denomination", "frequency", "country", "status"];
    selectFields.forEach((field) => {
      if (requestPayload[field]) {
        requestPayload[field] = requestPayload[field].value;
      }
    });
    
    const countryId = requestPayload.country;
    delete requestPayload.entity;

    requestPayload.issuanceAmount = parseInt(requestPayload.issuanceAmount, 10);
    requestPayload.profitRate = parseFloat(requestPayload.profitRate, 10);

    return { ...requestPayload, countryId };
  };

  const formatParsedValues =(payload) => {
    const dateFields = ["issueDate", "maturityDate"];
    dateFields.forEach((field) => {
      if (payload[field]) {
        payload[field] = moment(payload[field]);
      }
    });

    return payload
  }

  const selectedExternalSecurities = externalSecuritiesList?.find(
    ({ id }) => selectedRow?.id === id
  );



  const getDenominationOptions = (entries) => {
    const options = [];
    if (entries) {
      entries.forEach((entry) => {
        const opt = { ...entry };
        options.push({ label: opt.value, value: opt.id });
      });
    }
    return options;
  };

  const externalSecurityStatusOptionsList = [
    {
      label: t("External Securities.Status.Active"),
      value: externalSecurityStatusEnum.ACTIVE,
    },
    {
      label: t("External Securities.Status.Inactive"),
      value: externalSecurityStatusEnum.INACTIVE,
    },
  ];

  useEffect(() => {
    if (selectedRow || selectedExternalSecurities) {
      setInitialValues({
        name: selectedRow?.name || "",
        shortName: selectedRow?.shortName || "",
        longName: selectedRow?.longName || "",
        issuanceName: selectedRow?.issuanceName || "",
        isin: selectedRow?.isin || "",
        ticker: selectedRow?.ticker || "",
        profitRate: parseFloat(selectedRow?.profitRate, 10) || "",
        issuanceAmount: selectedRow?.issuanceAmount || "",
        frequency: selectedRow?.frequency ? selectedExternalSecurities.frequencyName : null,
        country: selectedRow?.country ? selectedExternalSecurities.country : null,
        currency: selectedRow?.currency ? selectedExternalSecurities.currencyName : null,
        maturityDate: selectedRow?.maturityDate ? moment(selectedExternalSecurities.maturityDate) : null,
        issueDate:moment(selectedRow?.issueDate) || null,
        denomination: selectedRow?.denomination
          ? selectedExternalSecurities.denominationName
          : null,
        status: selectedRow?.status ? selectedExternalSecurities.status : null,
      });
    } else {
     if(!formvalues?.settings) return
      const data = formvalues?.settings[0];
      if (
        !fetchingValues &&
        data?.value &&
        data?.value !== "null" &&
        data?.key === "AddSecurityDialogForm"
      ) {
        const payload = formatParsedValues(JSON.parse(data.value))
        setInitialValues(payload);

        // setInitialValues(JSON.parse(data.value));
      }
    }
  }, [formvalues, fetchingValues, selectedExternalSecurities, selectedRow]);

  const saveFormValues = (value) => {
    if (!value)return;
    const obj = {
      settings: [
        {
          key: "AddSecurityDialogForm",
          value: JSON.stringify(value),
          isActive:false,

        },
      ],
    };
    dispatch(formActionCreators.doPostFormRequested(obj));
  };

  useEffect(() => {
    if (open) {
      const fetchFormValues = (payload) => dispatch(formActionCreators.doFetchForm(payload));
      fetchFormValues({ keys: ["AddSecurityDialogForm"] });
    }
  }, [open]);

    console.log("initialValues:: ", initialValues);
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="form-dialog-title"
      scroll="body"
      maxWidth="sm"
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={addSecurityFormSchema}
        onSubmit={async (values, { setSubmitting }) => {
          let requestPayload;
          if (isEdit) {
            const editObject = {
              requestPayload: buildRequestPayload(values),
              externalSecuritiesId: selectedRow?.id,
            };
            requestPayload = editObject;
          } else {
            requestPayload = buildRequestPayload(values);
          }

          const payload = {
            requestPayload,
            successCallback: () => {
              setSubmitting(false);
              fetchExternalSecuritiesList();
              handleClose();
              setSelectedRow(null);
              saveFormValues(null);
            },
            // rejectCallback: () => {
            //   setSubmitting(false);
            //   handleClose();
            //   saveFormValues(null); // setting isActive to false to remove settings value
            // },
          };

          if (isEdit) {
            dispatch(externalSecuritiesActionCreators.doEditExternalSecurities(payload));
          } else {
            dispatch(externalSecuritiesActionCreators.doAddExternalSecurities(payload));
          }
          setSubmitting(false);
        }}
      >
        {({ handleSubmit, setFieldValue, values, disableSelectCurrencyField }) => (
          <form onSubmit={handleSubmit} noValidate>
            <AutoSaveFields
              selectedRow={selectedRow}
              formKey="AddSecurityDialogForm"
              initial={initial}
            />
            <DialogTitle id="add-payment-account-form-dialog-title">
              <Grid container justifyContent="space-between">
                <Grid item xs container alignContent="center">
                  <strong>
                    {isEdit
                      ? t("External Securities.Edit Security")
                      : t("External Securities.New Security")}
                  </strong>
                </Grid>

                <IconButton aria-label="close" onClick={handleClose} size="large">
                  <CloseIcon />
                </IconButton>
              </Grid>
            </DialogTitle>

            <DialogContent>
              <Box mb={2}>
                <Grid container>
                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Security Name")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t("External Securities.Add Security Form.Security Name")}
                        name="name"
                        variant="filled"
                        type="text"
                        InputProps={{ readOnly: isEdit, disableUnderline: isEdit }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Security Short Name")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t("External Securities.Add Security Form.Security Short Name")}
                        name="shortName"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Security Long Name")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t("External Securities.Add Security Form.Security Long Name")}
                        name="longName"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Issuance Name")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t("External Securities.Add Security Form.Issuance Name")}
                        name="issuanceName"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                  </Grid>
                  {/* <Grid  container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} >
                        <Typography className="mt-4">WSN</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}  className="px-1">
                        <Field fullWidth component={TextField} label="WSN" name="wsn" variant="filled" type="text" />
                      </Grid>
                    </Grid>{' '} */}
                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.ISIN")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t("External Securities.Add Security Form.ISIN")}
                        name="isin"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Ticker")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t("External Securities.Add Security Form.Ticker")}
                        name="ticker"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Rate")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      {/* <Field
                          fullWidth
                          InputProps={{ type: 'number' }}
                          component={TextField}
                          label={t('external_securities:External Securities.Add Security Form.Rate')}
                          name="profitRate"
                          variant="filled"
                          type="text"
                        />
                        /> */}
                      <Field
                        fullWidth
                        component={TextField}
                        label={t("External Securities.Add Security Form.Rate")}
                        name="profitRate"
                        variant="filled"
                        value={values.profitRate}
                        InputProps={{
                          inputComponent: CustomNumberInputField,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Frequency")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          placeholder="Select.."
                          components={{
                            ...animatedComponents,
                          }}
                          isSearchable
                          styles={selectStyles}
                          value={values.frequency}
                          isClearable
                          options={getDropdownValues(formOptions?.frequency, locale)}
                          onChange={(selected) => {
                            setFieldValue("frequency", selected);
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="frequency"
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Country")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isSearchable
                          placeholder="Select.."
                          components={{
                            ...animatedComponents,
                          }}
                          styles={selectStyles}
                          value={values.country}
                          options={getDropdownValues(
                            normalisedCountries(formOptions?.country),
                            locale
                          )}
                          onChange={(selected) => {
                            setFieldValue("country", selected);
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="country"
                      />
                    </Grid>
                  </Grid>



                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Issue Date")}{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <Field
                        fullWidth
                        format="DD/MM/YYYY"
                        inputVariant="filled"
                        variant="dialog"
                        placeholder="DD/MM/YYYY"
                        component={DatePicker}
                        value={values.issueDate}
                        onChange={(date) => {
                          setFieldValue("issueDate", date);
                        }}
                        name="issueDate"
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Maturity Date")}{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <Field
                        fullWidth
                        format="DD/MM/YYYY"
                        inputVariant="filled"
                        variant="dialog"
                        placeholder="DD/MM/YYYY"
                        minDate={moment()}
                        component={DatePicker}
                        value={values.maturityDate}
                        onChange={(date) => {
                          setFieldValue("maturityDate", date);
                        }}
                        name="maturityDate"
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Currency")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          placeholder="Select.."
                          components={{
                            ...animatedComponents,
                          }}
                          isSearchable
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                          value={values.currency}
                          isDisabled={disableSelectCurrencyField}
                          isClearable
                          options={getDropdownValues(formOptions?.currency, locale)}
                          onChange={(selected) => {
                            setFieldValue("currency", selected);
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="currency"
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Issuance Amount")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t("External Securities.Add Security Form.Issuance Amount")}
                        name="issuanceAmount"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Denomination")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          placeholder="Select.."
                          components={{
                            ...animatedComponents,
                          }}
                          menuPortalTarget={document.body}
                          isSearchable
                          styles={selectStyles}
                          value={values.denomination}
                          isClearable
                          options={getDenominationOptions(formOptions?.denomination)}
                          onChange={(selected) => {
                            setFieldValue("denomination", selected);
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="denomination"
                      />
                    </Grid>
                  </Grid>

                  <Grid container className="mt-4">
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography className="mt-4">
                        {t("External Securities.Add Security Form.Status")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          placeholder="Select.."
                          components={{
                            ...animatedComponents,
                          }}
                          menuPortalTarget={document.body}
                          isSearchable
                          styles={selectStyles}
                          value={values.status}
                          isClearable
                          options={externalSecurityStatusOptionsList}
                          onChange={(selected) => {
                            setFieldValue("status", selected);
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="status"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>

            <DialogActions>
              <Grid container justifyContent="flex-end" className="w-full">
                <Grid item lg={4}>
                  <Button
                    fullWidth
                    onClick={() => {
                      saveFormValues(null);
                      setInitialValues(initial);
                      handleClose();
                    }}
                    color="primary"
                  >
                    {t("translation:Miscellaneous.Cancel")}
                  </Button>
                </Grid>
              </Grid>
              <Grid item lg={4}>
                <Button fullWidth type="submit" variant="contained" color="primary">
                  {t("translation:Miscellaneous.Submit")}
                </Button>
              </Grid>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddSecurityDialog;
