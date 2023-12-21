import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { MySelect as Select } from "@emrgo-frontend/shared-ui";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, Formik, useFormikContext } from "formik";
import { TextField } from "formik-mui";

import { useTheme } from "../../context/theme-context";
import { runFxCalculations } from "../../helpers/fxTransactions";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as billingAndPaymentsActionCreators from "../../redux/actionCreators/cashManagement";
import * as entitiesActionCreators from "../../redux/actionCreators/entities";
import * as formActionCreators from "../../redux/actionCreators/form";
import * as fxTransactionActionCreators from "../../redux/actionCreators/fxTransactions";
import * as authSelectors from "../../redux/selectors/auth";
import * as billingAndPaymentsSelectors from "../../redux/selectors/cashManagement";
import * as entitiesSelectors from "../../redux/selectors/entities";
import * as selectFormValues from "../../redux/selectors/form";
import selectStyles from "../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../utils/form";
import { addFXTransactionFormSchema } from "../../validationSchemas";
import AutoSaveFields from "../AutoSaveFields";
import CalculationField from "../CalculationField";

const initial = {
  entity: null,
  fromAmount: "",
  fromAccount: null,
  fromCurrency: null,
  bankRate: "",
  markupRate: "",
  clientRate: "",
  bankAmount: "",
  markupAmount: "",
  clientAmount: "",
  toCurrency: null,
  toAccount: null,
  narrative: "",
};

const DependentAccountField = (props) => {
  const { values, touched, setFieldValue } = useFormikContext();
  useEffect(() => {
    if (values.entity && props?.currency && props.optionsList.length === 1) {
      setFieldValue(props.name, props.optionsList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.entity, values.fromCurrency, touched, props.name, values.toCurrency]);

  return (
    <>
      <Select
        {...props}
        isDisabled={(!values.entity && !props.currency) || props?.optionsList?.length === 0}
        closeMenuOnSelect
        placeholder="Select.."
        isSearchable
        styles={selectStyles}
        value={props?.value}
        isClearable
        options={props?.optionsList}
        onChange={(selected) => {
          setFieldValue(props?.name, selected);
        }}
      />{" "}
    </>
  );
};

const AddFXTransactionDialog = ({ open, handleClose, currentlySelectedDateRange }) => {
  const [initialValues, setInitialValues] = useState(initial);
  const formvalues = useSelector(selectFormValues.selectFormValues);
  const fetchingValues = useSelector(selectFormValues.formValuesFetching);
  const dispatch = useDispatch();
  const { t } = useTranslation(["fx_transactions"]);
  const { theme } = useTheme();
  const { locale } = theme;

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const entitiesList = useSelector(entitiesSelectors.selectEntities);
  const accounts = useSelector(billingAndPaymentsSelectors.selectAccounts);
  const formOptions = useSelector(billingAndPaymentsSelectors.selectDropDowns);

  // const currentEntityType = currentEntityGroup?.entityType;
  const entityOptionsList = entitiesList?.map((entity) => ({
    label: entity.corporateEntityName,
    value: entity.id,
  }));
  const currencyOptionsList = getDropdownValues(formOptions?.currency, locale);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroup?.id,
  });

  useEffect(() => {
    const fetchAccounts = (payload) =>
      dispatch(billingAndPaymentsActionCreators.doFetchAccounts(payload));
    const fetchEntities = (payload) => dispatch(entitiesActionCreators.doFetchEntities(payload));

    fetchAccounts();
    fetchEntities();
  }, [dispatch, currentEntityGroup]);

  useEffect(() => {
    const fetchFormOptions = (payload) =>
      dispatch(billingAndPaymentsActionCreators.doFetchDropdownValues(payload));
    fetchFormOptions({
      options: ["currency"],
    });
  }, [dispatch]);

  const generateAccountOptionsList = (entity, currency) => {
    // based on entity and currency selected
    // auto populate if there is only 1 account

    if (entity) {
      let filteredOptions = [];

      filteredOptions = accounts.filter((acc) => acc?.group?.entity?.id === entity?.value);

      if (currency) {
        filteredOptions = filteredOptions.filter((acc) => acc?.currency?.name === currency?.label);
      }

      filteredOptions = filteredOptions.map((acc) => ({
        label: `${acc?.accountNo} (${acc?.type})`,
        value: acc?.accountNo,
        id: acc?.id,
      }));

      if (filteredOptions.length === 0) {
        return [];
      }

      if (filteredOptions.length === 1) {
        return [filteredOptions[0]];
      }

      return filteredOptions;
    }

    return [];
  };

  const generateToCurrencyOptionsList = (fromCurrencyValue) => {
    //  list cannot be the same CCY as the from CCY
    if (fromCurrencyValue) {
      const filteredOptions = currencyOptionsList.filter((ccy) => ccy.value !== fromCurrencyValue);
      return filteredOptions;
    }
    // return empty if there is no counter account for the entity
    return [];
  };

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  useEffect(() => {
    if (!formvalues?.settings) return;
    const data = formvalues?.settings[0];
    if (
      !fetchingValues &&
      data?.value &&
      data?.value !== "null" &&
      data?.key === "NewFxTransactionForm"
    ) {
      setInitialValues(JSON.parse(data.value));
    }
  }, [formvalues, fetchingValues]);

  const saveFormValues = (value) => {
    const obj = {
      settings: [
        {
          key: "NewFxTransactionForm",
          value: JSON.stringify(value),
          isActive: false,
        },
      ],
    };
    dispatch(formActionCreators.doPostFormRequested(obj));
  };

  useEffect(() => {
    if (open) {
      const fetchFormValues = (payload) => dispatch(formActionCreators.doFetchForm(payload));
      fetchFormValues({ keys: ["NewFxTransactionForm"] });
    }
  }, [open]);

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
    >
      <Formik
        initialValues={initialValues}
        validationSchema={addFXTransactionFormSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          const requestPayload = {
            fxTransactionId: undefined,
            fromAccountId: values?.fromAccount.id,
            toAccountId: values?.toAccount.id,
            fromAmount: Number(values?.fromAmount),
            bankRate: Number(values?.bankRate),
            markupRate: Number(values?.markupRate),
            clientRate: Number(values?.clientRate),
            bankAmount: Number(values?.bankAmount),
            markupAmount: Number(values?.markupAmount),
            clientAmount: Number(values?.clientAmount),
            narrative: values?.narrative,
          };
          const payload = {
            requestPayload,
            dateRange: currentlySelectedDateRange,
            successCallback: () => {
              saveFormValues(values);
              actions.resetForm();
              handleClose();
            },
          };

          // actions.setSubmitting(false);
          // doAddFxTransactions(values);
          dispatch(fxTransactionActionCreators.doAddFxTransactions(payload));
          setTimeout(() => {
            actions.setSubmitting(false);
          }, 2000);
        }}
      >
        {({
          values,
          handleSubmit,
          setFieldValue,
          setValues,
          setFieldTouched,
          setTouched,
          touched,
          handleBlur,
          isSubmitting,
        }) => {
          const toCurrencyOptionsList = generateToCurrencyOptionsList(values?.fromCurrency?.value);
          const fromAccountOptionsList = generateAccountOptionsList(
            values?.entity,
            values?.fromCurrency
          );
          const toAccountOptionsList = generateAccountOptionsList(
            values?.entity,
            values?.toCurrency
          );
          const handleOnBlur = (e, field) => {
            handleBlur(e);
            const fieldValue = e.currentTarget.value;
            if (fieldValue === "") {
              setFieldTouched(field, false);
            }
          };

          const resetFieldValue = (field) => {
            setFieldValue(field, "");
            setFieldTouched(field, false);
          };

          const resetCalculationFields = () => {
            setValues({
              ...values,
              bankRate: "",
              markupRate: "",
              clientRate: "",
              bankAmount: "",
              markupAmount: "",
              clientAmount: "",
            });

            setTouched({
              ...touched,
              bankRate: false,
              markupRate: false,
              clientRate: false,
              bankAmount: false,
              markupAmount: false,
              clientAmount: false,
            });
          };

          return (
            <form onSubmit={handleSubmit} onKeyDown={onKeyDown}>
              <AutoSaveFields formKey="NewFxTransactionForm" initial={initial} />
              <DialogTitle id="form-dialog-title">{t("Fx Modal.New Fx Transaction")}</DialogTitle>

              <DialogContent>
                <Box mb={2}>
                  <Grid container>
                    <Grid container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
                        <Typography className="mt-4">{t("Fx Table.Entity")}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <Select
                            closeMenuOnSelect
                            placeholder="Select.."
                            isSearchable
                            styles={selectStyles}
                            value={values.entity}
                            isClearable
                            options={entityOptionsList}
                            onChange={(selected) => {
                              setFieldValue("entity", selected);
                              setFieldValue("fromCurrency", null);
                              setFieldValue("fromAccount", null);
                              setFieldValue("toCurrency", null);
                              setFieldValue("toAccount", null);
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
                    <Grid container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
                        <Typography className="mt-4">{t("Fx Table.From Amount")}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <Field
                          fullWidth
                          component={TextField}
                          name="fromAmount"
                          variant="filled"
                          size="small"
                          // type="number"
                          value={values.fromAmount}
                          InputProps={{
                            inputProps: values,
                            // inputComponent: NumberFormatCustom,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
                        <Typography className="mt-4">{t("Fx Table.From Currency")}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <Select
                            closeMenuOnSelect
                            placeholder="Select.."
                            isSearchable
                            styles={selectStyles}
                            value={values.fromCurrency}
                            isClearable
                            options={currencyOptionsList}
                            onChange={(selected) => {
                              setFieldValue("fromCurrency", selected);
                              setFieldValue("fromAccount", null);
                              setFieldValue("toCurrency", null);
                            }}
                          />
                        </FormControl>
                        <ErrorMessage
                          component={Typography}
                          variant="caption"
                          color="error"
                          className="ml-4"
                          name="fromCurrency"
                        />
                      </Grid>
                    </Grid>
                    <Grid container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
                        <Typography className="mt-4">{t("Fx Table.Debit Account")}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <DependentAccountField
                            name="fromAccount"
                            optionsList={fromAccountOptionsList}
                            value={values?.fromAccount}
                            currency={values?.fromCurrency}
                          />
                        </FormControl>
                        <ErrorMessage
                          component={Typography}
                          variant="caption"
                          color="error"
                          className="ml-4"
                          name="fromAccount"
                        />
                      </Grid>
                    </Grid>

                    <CalculationField
                      fieldLabel={t("Fx Table.Bank FX Rate %")}
                      fieldKey="bankRate"
                      handleOnBlur={handleOnBlur}
                      touched={touched}
                      values={values}
                      handleFieldReset={resetFieldValue}
                      decimalScale={6}
                    />
                    <CalculationField
                      fieldLabel={t("Fx Table.Markup Rate %")}
                      fieldKey="markupRate"
                      handleOnBlur={handleOnBlur}
                      touched={touched}
                      values={values}
                      handleFieldReset={resetFieldValue}
                      decimalScale={6}
                    />
                    <CalculationField
                      fieldLabel={t("Fx Table.Client FX Rate %")}
                      fieldKey="clientRate"
                      handleOnBlur={handleOnBlur}
                      touched={touched}
                      values={values}
                      handleFieldReset={resetFieldValue}
                      decimalScale={6}
                    />
                    <CalculationField
                      fieldLabel={t("Fx Table.Bank Amount")}
                      fieldKey="bankAmount"
                      handleOnBlur={handleOnBlur}
                      touched={touched}
                      values={values}
                      handleFieldReset={resetFieldValue}
                    />
                    <CalculationField
                      fieldLabel={t("Fx Table.Markup Amount")}
                      fieldKey="markupAmount"
                      handleOnBlur={handleOnBlur}
                      touched={touched}
                      values={values}
                      handleFieldReset={resetFieldValue}
                    />
                    <CalculationField
                      fieldLabel={t("Fx Table.Client Amount")}
                      fieldKey="clientAmount"
                      handleOnBlur={handleOnBlur}
                      touched={touched}
                      values={values}
                      handleFieldReset={resetFieldValue}
                    />
                    <Grid container className="mt-4" justifyContent="flex-end">
                      <Grid item xs={5} className="px-1">
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            runFxCalculations({
                              values,
                              setFieldValue,
                              touched,
                              incompleteText: t("Fx Modal.Insufficient information given"),
                            });
                          }}
                        >
                          {t("Fx Modal.Buttons.Calculate")}
                        </Button>
                      </Grid>
                      <Grid item container xs={1} className="px-1" alignContent="center">
                        <Tooltip title={t("Fx Modal.Buttons.Reset")}>
                          <IconButton
                            size="small"
                            aria-label="reset"
                            color="primary"
                            onClick={() => resetCalculationFields()}
                          >
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    <Grid container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
                        <Typography className="mt-4">{t("Fx Table.To Currency")}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <Select
                            isDisabled={!values.fromCurrency || fromAccountOptionsList.length === 0}
                            closeMenuOnSelect
                            placeholder="Select.."
                            isSearchable
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            value={values.toCurrency}
                            isClearable
                            options={toCurrencyOptionsList}
                            onChange={(selected) => {
                              setFieldValue("toCurrency", selected);
                              setFieldValue("toAccount", null);
                            }}
                          />
                        </FormControl>
                        <ErrorMessage
                          component={Typography}
                          variant="caption"
                          color="error"
                          className="ml-4"
                          name="toCurrency"
                        />
                      </Grid>
                    </Grid>
                    <Grid container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
                        <Typography className="mt-4">{t("Fx Table.Credit Account")}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <DependentAccountField
                            name="toAccount"
                            optionsList={toAccountOptionsList}
                            value={values?.toAccount}
                            currency={values?.toCurrency}
                          />
                        </FormControl>
                        <ErrorMessage
                          component={Typography}
                          variant="caption"
                          color="error"
                          className="ml-4"
                          name="toAccount"
                        />
                      </Grid>
                    </Grid>
                    {/* calculated value of exchange rate - From Amount / To Amount, can be overridden by user
                    <Grid container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
                        <Typography className="mt-4">{t('Fx Table.Rate')}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <DependentInputField name="rate" />
                      </Grid>
                    </Grid> */}
                    <Grid container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
                        <Typography className="mt-4">{t("Fx Table.Narrative")}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <Field
                          fullWidth
                          component={TextField}
                          name="narrative"
                          multiline
                          rows={2}
                          variant="filled"
                          onKeyDown={(event) => {
                            if (event.which === 13)
                              setFieldValue("narrative", event.target.value + "\n");
                          }}
                          size="small"
                          type="text"
                          inputProps={{
                            maxLength: 100,
                          }}
                        />{" "}
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
                        setInitialValues(initial);
                        saveFormValues(values);
                        handleClose();
                      }}
                      color="primary"
                    >
                      {t("translation:Miscellaneous.Cancel")}
                    </Button>
                  </Grid>
                </Grid>

                <Grid item lg={4}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
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

export default AddFXTransactionDialog;
