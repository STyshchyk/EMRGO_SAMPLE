import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import makeAnimated from "react-select/animated";

import { MySelect as Select } from "@emrgo-frontend/shared-ui";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { TextField } from "formik-mui";
import PropTypes from "prop-types";

import { externalSecurityStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import { useTheme } from "../../context/theme-context";
import normalisedCountries from "../../helpers/countries";
import * as externalSecuritiesActionCreators from "../../redux/actionCreators/externalSecurities";
import * as issuanceActionCreators from "../../redux/actionCreators/issuance";
import * as externalSecuritiesSelectors from "../../redux/selectors/externalSecurities";
import * as issuanceSelectors from "../../redux/selectors/issuance";
import selectStyles from "../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../utils/form";
import { addEquitySecurityFormSchema } from "../../validationSchemas";

const animatedComponents = makeAnimated();

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
      decimalScale={2}
    />
  );
};

CustomNumberInputField.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const AddEquitySecurityDialog = ({ open, handleClose, selectedRow, setSelectedRow }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["external_securities", "translation"]);
  const { theme } = useTheme();
  const { locale } = theme;
  const isEdit = selectedRow !== null;

  const [selectedSecurityIdentifierTypeOption, setSelectedSecurityIdentifierTypeOption] =
    useState(null);

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
      options: ["currency", "country", "securityIdentifier"],
    });
  }, [dispatch]);

  const buildRequestPayload = (values) => {
    const requestPayload = values;
    requestPayload.externalSecurityId = selectedRow?.id;

    const dropdownFieldNames = ["currency", "country", "status"];

    dropdownFieldNames.forEach((field) => {
      if (requestPayload[field]) {
        requestPayload[field] = requestPayload[field].value;
      }
    });

    requestPayload.attributes = requestPayload.attributes.map((attribute) => ({
      ...attribute,
      securityIdTypeName: undefined,
    }));

    // API expects countryId instead of country
    requestPayload.countryId = requestPayload.country;
    delete requestPayload.country;

    return { ...requestPayload };
  };

  const selectedExternalSecurities = externalSecuritiesList?.find(
    ({ id }) => selectedRow?.id === id
  );

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

  const getCurrencyOption = (currencyId) => {
    const currencyDropdownOptions = getDropdownValues(formOptions?.currency, locale);
    const currency = currencyDropdownOptions.find(({ value }) => value === currencyId);

    return currency ?? null;
  };

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
      maxWidth="md"
    >
      <Formik
        initialValues={{
          name: selectedRow?.name || "",
          longName: selectedRow?.longName || "",
          shortName: selectedRow?.shortName || "",
          country: selectedRow?.country ? selectedExternalSecurities.country : null,
          currency: selectedRow?.currencyId ? getCurrencyOption(selectedRow.currencyId) : null,
          status: selectedRow?.status ? selectedExternalSecurities.status : null,
          attributes: selectedRow?.attributes ?? [],
        }}
        enableReinitialize
        validationSchema={addEquitySecurityFormSchema}
        onSubmit={async (values, { setSubmitting }) => {
          let requestPayload;
          if (isEdit) {
            requestPayload = {
              ...buildRequestPayload(values),
              externalSecuritiesId: selectedRow?.id,
            };
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
            },
          };
          dispatch(externalSecuritiesActionCreators.doAddEquityExternalSecurities(payload));
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => {
          const listOfUserSelectedSecurityIdentifierTypes = values.attributes.map(
            ({ securityIdTypeName }) => securityIdTypeName
          );

          return (
            <form onSubmit={handleSubmit} noValidate>
              <DialogTitle id="form-dialog-title">
                <Grid container justifyContent="space-between">
                  <Grid item xs container alignContent="center">
                    <strong>
                      {isEdit
                        ? t("External Securities.Edit Equity Security")
                        : t("External Securities.New Equity Security")}
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
                          variant="outlined"
                          size="small"
                          type="text"
                          // InputProps={{ readOnly: isEdit, disableUnderline: isEdit }}
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
                          variant="outlined"
                          size="small"
                          type="text"
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
                          variant="outlined"
                          size="small"
                          type="text"
                          InputProps={{ readOnly: isEdit, disableUnderline: isEdit }}
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
                            menuPortalTarget={document.body}
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

                    <FieldArray name="attributes">
                      {({ remove, push }) => (
                        <Fragment>
                          <Grid container item className="mt-4">
                            <Grid item xs={12} md={6}>
                              <Typography className="mt-4">
                                {"Add Security Identifier Type ***"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6} className="px-1" container>
                              <Grid item xs={11} md={11}>
                                <FormControl className="w-full">
                                  <Select
                                    closeMenuOnSelect
                                    placeholder="Select Security ID Type"
                                    value={selectedSecurityIdentifierTypeOption}
                                    components={{
                                      ...animatedComponents,
                                    }}
                                    isSearchable
                                    styles={selectStyles}
                                    menuPortalTarget={document.body}
                                    options={getDropdownValues(
                                      formOptions?.securityIdentifier
                                    ).filter(
                                      ({ label }) =>
                                        !["Long Name", "Short Name"].includes(label) &&
                                        !listOfUserSelectedSecurityIdentifierTypes.includes(label)
                                    )}
                                    onChange={(newValue) => {
                                      setSelectedSecurityIdentifierTypeOption(newValue);
                                    }}
                                  />
                                </FormControl>
                                <Typography variant="caption" color="error" className="ml-4">
                                  {values.attributes.length === 0 &&
                                    "At least one security identifier is required"}
                                </Typography>
                              </Grid>
                              <Grid item xs={1} md={1}>
                                <IconButton
                                  disabled={!selectedSecurityIdentifierTypeOption}
                                  color="primary"
                                  variant="contained"
                                  onClick={() => {
                                    setSelectedSecurityIdentifierTypeOption(null);
                                    push({
                                      securityIdTypeName:
                                        selectedSecurityIdentifierTypeOption?.label,
                                      identifierId: selectedSecurityIdentifierTypeOption?.value,
                                      value: "",
                                    });
                                  }}
                                  size="large"
                                >
                                  <AddIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Grid>
                          {values.attributes.length > 0 &&
                            values.attributes.map((item, index) => (
                              <Fragment key={`index-${item.securityIdTypeName}}`}>
                                <Grid container className="mt-4">
                                  <Grid item xs={12} md={6}>
                                    <Typography className="mt-4">{`Security Identifier: ${item.securityIdTypeName}`}</Typography>
                                  </Grid>
                                  <Grid item container xs={12} md={6}>
                                    <Grid item xs={11} md={11} className="px-1">
                                      <Field
                                        fullWidth
                                        component={TextField}
                                        label={item.securityIdTypeName}
                                        name={`attributes.${index}.value`}
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                      />
                                    </Grid>
                                    <Grid item xs={1} md={1}>
                                      <IconButton
                                        color="primary"
                                        variant="contained"
                                        onClick={() => remove(index)}
                                        size="large"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Fragment>
                            ))}
                        </Fragment>
                      )}
                    </FieldArray>
                  </Grid>
                </Box>
              </DialogContent>

              <DialogActions>
                <Grid container justifyContent="flex-end" className="w-full">
                  <Grid item>
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
                <Grid item>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={values.attributes.length === 0}
                  >
                    {t("translation:Miscellaneous.Submit")}
                  </Button>
                </Grid>
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default AddEquitySecurityDialog;
