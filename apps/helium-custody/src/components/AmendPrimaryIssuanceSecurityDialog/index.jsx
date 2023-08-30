import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {NumericFormat} from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "@emrgo-frontend/shared-ui";
import makeAnimated from "react-select/animated";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import moment from "moment";
import PropTypes from "prop-types";

import { externalSecurityStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import { useTheme } from "../../context/theme-context";
import * as externalSecuritiesActionCreators from "../../redux/actionCreators/externalSecurities";
import * as issuanceActionCreators from "../../redux/actionCreators/issuance";
import * as issuanceSelectors from "../../redux/selectors/issuance";
import selectStyles from "../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../utils/form";
import { dateFormatter } from "../../utils/formatter";

const animatedComponents = makeAnimated();

const DEFAULT_DATE_FORMAT = "DD/MM/YYYY HH:mm:ss";

const InlineFormField = ({ label, children }) => (
  <Grid item container md={12}>
    <Grid item sm={4} container direction="column" justifyContent="center">
      <Typography>{label}</Typography>
    </Grid>
    <Grid item sm={8}>
      <FormControl
        style={{
          width: "100%",
        }}
      >
        {children}
      </FormControl>
    </Grid>
  </Grid>
);

const CustomNumberInputField = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
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
};

CustomNumberInputField.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const generateAPIDropdownOption = (dropdownData) => ({
  label: dropdownData?.name,
  value: dropdownData?.id,
});

const AmendPrimaryIssuanceSecurityDialog = ({ open, handleClose, currentlySelectedRowData }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["translation", "external_securties"]);
  const { theme } = useTheme();
  const { locale } = theme;
  const isEdit = currentlySelectedRowData !== null;

  // selectors
  const formOptions = useSelector(issuanceSelectors.selectDropDowns);

  const fetchExternalSecuritiesList = () =>
    dispatch(externalSecuritiesActionCreators.doFetchExternalSecuritiesList());

  useEffect(() => {
    const fetchFormOptions = (payload) =>
      dispatch(issuanceActionCreators.doFetchFormOptions(payload));
    fetchFormOptions({
      options: [
        "jurisdiction",
        "currency",
        "governingLaw",
        "rating",
        "profitRateTerms",
        "dayCountConvention",
        "sellingRestrictions",
        "formOfOffering",
        "useOfProceeds",
        "shariaCompliance",
        "ranking",
        "listing",
        "denomination",
        "frequency",
        "country",
        "pricingMethod",
      ],
    });
  }, [dispatch]);

  const buildRequestPayload = (values) => {
    const requestPayload = values;

    const selectFields = [
      "country",
      "currency",
      "dayCountConvention",
      "denomination",
      "formOfOffering",
      "frequency",
      "governingLaw",
      "jurisdiction",
      "listing",
      "pricingMethod",
      "profitRateTerms",
      "ranking",
      "rating",
      "sellingRestrictions",
      "shariaCompliance",
      "status",
      "useOfProceeds",
    ];
    selectFields.forEach((field) => {
      if (requestPayload[field]) {
        requestPayload[field] = requestPayload[field].value;
      }
    });

    const countryId = requestPayload.country;
    delete requestPayload.entity;

    return { ...requestPayload, countryId };
  };

  const getDenominationOptions = (entries) => {
    const options = [];
    if (entries) {
      entries.forEach((entry) => {
        const opt = { ...entry };
        options.push({ label: opt.name, value: opt.id });
      });
    }
    return options;
  };

  const externalSecurityStatusOptionsList = [
    {
      label: t("external_securities:External Securities.Status.Active"),
      value: externalSecurityStatusEnum.ACTIVE,
    },
    {
      label: t("external_securities:External Securities.Status.Inactive"),
      value: externalSecurityStatusEnum.INACTIVE,
    },
  ];

  const handleSubmit = async (values, { setSubmitting }) => {
    let requestPayload;
    if (isEdit) {
      const editObject = {
        requestPayload: buildRequestPayload(values),
        externalSecuritiesId: currentlySelectedRowData?.id,
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
      },
    };
    if (isEdit) {
      // dispatch(externalSecuritiesActionCreators.doEditExternalSecurities(payload));
    } else {
      // dispatch(externalSecuritiesActionCreators.doAddExternalSecurities(payload));
    }
    setSubmitting(false);
  };

  const generateInitialValues = (rowData) => ({
    currency: generateAPIDropdownOption(rowData?.currency),
    dayCountConvention: generateAPIDropdownOption(rowData?.dayCountConvention),
    denomination: generateAPIDropdownOption(rowData?.denomination),
    exchangeCode: rowData?.exchangeCode,
    formOfOffering: generateAPIDropdownOption(rowData?.formOfOffering),
    frequency: generateAPIDropdownOption(rowData?.frequency),
    governingLaw: generateAPIDropdownOption(rowData?.governingLaw),
    guarantor: rowData?.guarantor,
    isin: rowData?.isin ?? "",
    issuanceAmount: rowData?.issuanceAmount ?? "",
    issuanceName: rowData?.issuanceName ?? "",
    issueDate: rowData?.issueDate ?? null,
    jurisdiction: generateAPIDropdownOption(rowData?.jurisdiction),
    listing: generateAPIDropdownOption(rowData?.listing),
    longName: rowData?.longName ?? "",
    maturityAmount: rowData.maturityAmount,
    maturityDate: rowData?.maturityDate,
    name: rowData?.name,
    pricingMethod: generateAPIDropdownOption(rowData?.pricingMethod),
    profitRate: parseFloat(rowData?.profitRate, 10) || "",
    profitRateTerms: generateAPIDropdownOption(rowData?.profitRateTerms),
    ranking: generateAPIDropdownOption(rowData?.ranking),
    sellingRestrictions: generateAPIDropdownOption(rowData?.sellingRestrictions),
    shariaCompliance: generateAPIDropdownOption(rowData?.shariahCompliance),
    shortName: "N/A", // !DEV NOTES: NEED DISCUSSION
    status: externalSecurityStatusOptionsList.find((i) => i.value === rowData?.status),
    ticker: rowData?.ticker ?? "",
    underlyingAssets: rowData?.underlyingAssets,
  });

  const generatedInitialValues = generateInitialValues(currentlySelectedRowData);

  return (
    <Dialog
      aria-labelledby="form-dialog-title"
      disableEscapeKeyDown
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
    >
      <DialogTitle id="form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6">
              <span
                style={{
                  borderBottom: "2px solid #28ccbf",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  paddingBottom: "0.25em",
                }}
              >
                Amend Primary Issuance Security
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="close"
              onClick={() => {
                handleClose();
              }}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Formik initialValues={generatedInitialValues} enableReinitialize onSubmit={handleSubmit}>
            {({ setFieldValue, values, disableSelectCurrencyField }) => (
              <Form>
                <Grid container spacing={2}>
                  <InlineFormField
                    label={t(
                      "external_securities:External Securities.Add Security Form.Security Name"
                    )}
                  >
                    <Field
                      fullWidth
                      component={TextField}
                      name="name"
                      variant="filled"
                      type="text"
                      InputProps={{ readOnly: isEdit, disableUnderline: isEdit }}
                      disabled
                    />
                  </InlineFormField>

                  <InlineFormField
                    label={t(
                      "external_securities:External Securities.Add Security Form.Security Short Name"
                    )}
                  >
                    <Field
                      disabled
                      fullWidth
                      component={TextField}
                      name="shortName"
                      variant="filled"
                      type="text"
                    />
                  </InlineFormField>

                  <InlineFormField
                    label={t(
                      "external_securities:External Securities.Add Security Form.Security Long Name"
                    )}
                  >
                    <Field
                      disabled
                      fullWidth
                      component={TextField}
                      name="longName"
                      variant="filled"
                      type="text"
                    />
                  </InlineFormField>

                  <InlineFormField
                    label={t(
                      "external_securities:External Securities.Add Security Form.Issuance Name"
                    )}
                  >
                    <Field
                      disabled
                      fullWidth
                      component={TextField}
                      name="issuanceName"
                      variant="filled"
                      type="text"
                    />
                  </InlineFormField>

                  <InlineFormField
                    label={t("external_securities:External Securities.Add Security Form.Ticker")}
                  >
                    <Field
                      disabled
                      fullWidth
                      component={TextField}
                      name="ticker"
                      variant="filled"
                      type="text"
                    />
                  </InlineFormField>

                  <InlineFormField
                    label={t("external_securities:External Securities.Add Security Form.ISIN")}
                  >
                    <Field
                      fullWidth
                      component={TextField}
                      name="isin"
                      variant="filled"
                      type="text"
                    />
                  </InlineFormField>

                  <InlineFormField label="Exchange Code">
                    <Field
                      fullWidth
                      component={TextField}
                      name="exchangeCode"
                      variant="filled"
                      type="text"
                    />
                  </InlineFormField>

                  <InlineFormField
                    label={t("external_securities:External Securities.Add Security Form.Rate")}
                  >
                    <Field
                      fullWidth
                      component={TextField}
                      name="profitRate"
                      variant="filled"
                      value={values.profitRate}
                      InputProps={{
                        inputComponent: CustomNumberInputField,
                      }}
                    />
                  </InlineFormField>

                  <InlineFormField
                    label={t("external_securities:External Securities.Add Security Form.Frequency")}
                  >
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
                  </InlineFormField>

                  <InlineFormField
                    label={t(
                      "external_securities:External Securities.Add Security Form.Issue Date"
                    )}
                  >
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
                  </InlineFormField>

                  <InlineFormField
                    label={t(
                      "external_securities:External Securities.Add Security Form.Maturity Date"
                    )}
                  >
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
                  </InlineFormField>

                  <InlineFormField
                    label={t("external_securities:External Securities.Add Security Form.Currency")}
                  >
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
                  </InlineFormField>

                  <InlineFormField
                    label={t(
                      "external_securities:External Securities.Add Security Form.Issuance Amount"
                    )}
                  >
                    <Field
                      fullWidth
                      component={TextField}
                      name="issuanceAmount"
                      variant="filled"
                      type="text"
                      InputProps={{
                        inputComponent: CustomNumberInputField,
                      }}
                    />
                  </InlineFormField>

                  <InlineFormField
                    label={t(
                      "external_securities:External Securities.Add Security Form.Denomination"
                    )}
                  >
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
                  </InlineFormField>

                  <InlineFormField
                    label={t("external_securities:External Securities.Add Security Form.Status")}
                  >
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
                  </InlineFormField>

                  <InlineFormField label="Day Count Convention">
                    <Select
                      closeMenuOnSelect
                      isSearchable
                      placeholder="Select.."
                      components={{
                        ...animatedComponents,
                      }}
                      styles={selectStyles}
                      value={values.dayCountConvention}
                      options={getDropdownValues(formOptions?.dayCountConvention, locale)}
                      onChange={(selected) => {
                        setFieldValue("dayCountConvention", selected);
                      }}
                    />
                  </InlineFormField>

                  <InlineFormField label="Form of Offering">
                    <Select
                      closeMenuOnSelect
                      isSearchable
                      placeholder="Select.."
                      components={{
                        ...animatedComponents,
                      }}
                      styles={selectStyles}
                      value={values.formOfOffering}
                      options={getDropdownValues(formOptions?.formOfOffering, locale)}
                      onChange={(selected) => {
                        setFieldValue("formOfOffering", selected);
                      }}
                    />
                  </InlineFormField>

                  <InlineFormField label="Governing Law">
                    <Select
                      closeMenuOnSelect
                      isSearchable
                      placeholder="Select.."
                      components={{
                        ...animatedComponents,
                      }}
                      styles={selectStyles}
                      value={values.governingLaw}
                      options={getDropdownValues(formOptions?.governingLaw, locale)}
                      onChange={(selected) => {
                        setFieldValue("governingLaw", selected);
                      }}
                    />
                  </InlineFormField>

                  <InlineFormField label="Guarantor">
                    <Field
                      fullWidth
                      component={TextField}
                      label="Guarantor"
                      name="guarantor"
                      variant="filled"
                      type="text"
                    />
                  </InlineFormField>

                  <InlineFormField label="Jurisdiction">
                    <Select
                      closeMenuOnSelect
                      isSearchable
                      placeholder="Select.."
                      components={{
                        ...animatedComponents,
                      }}
                      styles={selectStyles}
                      value={values.jurisdiction}
                      options={getDropdownValues(formOptions?.jurisdiction, locale)}
                      onChange={(selected) => {
                        setFieldValue("jurisdiction", selected);
                      }}
                    />
                  </InlineFormField>

                  <InlineFormField label="Listing">
                    <Select
                      closeMenuOnSelect
                      isSearchable
                      placeholder="Select.."
                      components={{
                        ...animatedComponents,
                      }}
                      styles={selectStyles}
                      value={values.listing}
                      options={getDropdownValues(formOptions?.listing, locale)}
                      onChange={(selected) => {
                        setFieldValue("listing", selected);
                      }}
                    />
                  </InlineFormField>

                  <InlineFormField label="Maturity Amount">
                    <Field
                      fullWidth
                      InputProps={{ type: "number" }}
                      component={TextField}
                      name="maturityAmount"
                      variant="filled"
                      type="text"
                    />
                  </InlineFormField>

                  <InlineFormField label="Pricing Method">
                    <Select
                      closeMenuOnSelect
                      isSearchable
                      placeholder="Select.."
                      components={{
                        ...animatedComponents,
                      }}
                      styles={selectStyles}
                      value={values.pricingMethod}
                      options={getDropdownValues(formOptions?.pricingMethod, locale)}
                      onChange={(selected) => {
                        setFieldValue("pricingMethod", selected);
                      }}
                    />
                  </InlineFormField>

                  <InlineFormField label="Rate">
                    <Select
                      closeMenuOnSelect
                      isSearchable
                      placeholder="Select.."
                      components={{
                        ...animatedComponents,
                      }}
                      styles={selectStyles}
                      value={values.profitRateTerms}
                      options={getDropdownValues(formOptions?.profitRateTerms, locale)}
                      onChange={(selected) => {
                        setFieldValue("profitRateTerms", selected);
                      }}
                    />
                  </InlineFormField>

                  <InlineFormField label="Ranking">
                    <Select
                      closeMenuOnSelect
                      isSearchable
                      placeholder="Select.."
                      components={{
                        ...animatedComponents,
                      }}
                      styles={selectStyles}
                      value={values.ranking}
                      options={getDropdownValues(formOptions?.ranking, locale)}
                      onChange={(selected) => {
                        setFieldValue("ranking", selected);
                      }}
                    />
                  </InlineFormField>

                  <InlineFormField label="Selling Restrictions">
                    <Select
                      closeMenuOnSelect
                      isSearchable
                      placeholder="Select.."
                      components={{
                        ...animatedComponents,
                      }}
                      styles={selectStyles}
                      value={values.sellingRestrictions}
                      options={getDropdownValues(formOptions?.sellingRestrictions, locale)}
                      onChange={(selected) => {
                        setFieldValue("sellingRestrictions", selected);
                      }}
                    />
                  </InlineFormField>

                  <InlineFormField label="Shariah Compliance">
                    <Select
                      closeMenuOnSelect
                      isSearchable
                      placeholder="Select.."
                      components={{
                        ...animatedComponents,
                      }}
                      styles={selectStyles}
                      value={values.shariaCompliance}
                      options={getDropdownValues(formOptions?.shariaCompliance, locale)}
                      onChange={(selected) => {
                        setFieldValue("shariaCompliance", selected);
                      }}
                    />
                  </InlineFormField>

                  <Grid item container spacing={2} justifyContent="flex-end">
                    <Grid item>
                      <Button
                        color="primary"
                        variant="outlined"
                        onClick={() => {
                          handleClose();
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button color="primary" variant="contained" type="submit">
                        {t("Miscellaneous.Submit")}{" "}
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

export default AmendPrimaryIssuanceSecurityDialog;
