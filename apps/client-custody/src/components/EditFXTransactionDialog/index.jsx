import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, Formik, useFormikContext } from "formik";
import { TextField } from "formik-mui";
import PropTypes from "prop-types";

import {
  BANK_AMOUNT_DP,
  BANK_RATE_DP,
  CLIENT_AMOUNT_DP,
  CLIENT_RATE_DP,
  MARKUP_AMOUNT_DP,
  MARKUP_RATE_DP,
} from "../../constants/currency/availableCurrencies";
import { useTheme } from "../../context/theme-context";
import { runFxCalculations } from "../../helpers/fxTransactions";
import { roundNumber } from "../../helpers/renderers";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as billingAndPaymentsActionCreators from "../../redux/actionCreators/cashManagement";
import * as entitiesActionCreators from "../../redux/actionCreators/entities";
import * as fxTransactionActionCreators from "../../redux/actionCreators/fxTransactions";
import * as authSelectors from "../../redux/selectors/auth";
import * as billingAndPaymentsSelectors from "../../redux/selectors/cashManagement";
import * as entitiesSelectors from "../../redux/selectors/entities";
import selectStyles from "../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../utils/form";
import CalculationField from "../CalculationField";

const animatedComponents = makeAnimated();

const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
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
      isNumericString
      decimalScale={5}
    />
  );
};

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const DependentInputField = (props) => {
  const { values, setFieldValue } = useFormikContext(); // get Formik state and helpers via React Context
  // const [field, meta] = useField(props);

  let exchangeRate = values.rate || "";
  if (values.fromAmount && values.fromAmount !== "" && values.toAmount && values.toAmount !== "") {
    exchangeRate = values?.fromAmount / values?.toAmount;
  }

  useEffect(() => {
    // set the values for this field based on those of another
    if (
      values.fromAmount &&
      values.fromAmount !== "" &&
      values.toAmount &&
      values.toAmount !== ""
    ) {
      if (values.rate !== exchangeRate) {
        setFieldValue(props.name, values.rate);
        setFieldValue("overrideFlag", true);
      } else {
        setFieldValue(props.name, exchangeRate);
        setFieldValue("overrideFlag", false);
      }
    } else {
      setFieldValue(props.name, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.fromAmount, values.toAmount, values.rate, props.name]); // can't be override if touched is used as dependency.

  const resetValue = () => {
    if (
      values.fromAmount &&
      values.fromAmount !== "" &&
      values.toAmount &&
      values.toAmount !== ""
    ) {
      setFieldValue(props.name, exchangeRate);
      setFieldValue("overrideFlag", false);
    }
  };

  return (
    <>
      {/* <Field fullWidth component={TextField} name="rate" variant="filled" type="number" /> */}
      <Field
        {...props}
        fullWidth
        component={TextField}
        label="Rate"
        name="rate"
        variant="filled"
        type="number"
        value={values.rate}
        InputProps={{
          inputProps: values,
          inputComponent: NumberFormatCustom,
        }}
      />
      {values.overrideFlag && (
        <FormHelperText id="component-helper-text">
          Calculated rate is {+parseFloat(exchangeRate).toFixed(5)}. Click{" "}
          <ButtonBase
            color="primary"
            style={{ textDecoration: "underline" }}
            onClick={() => resetValue()}
          >
            here
          </ButtonBase>{" "}
          to reset.
        </FormHelperText>
      )}
    </>
  );
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
        components={{
          ...animatedComponents,
        }}
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

const EditFXTransactionDialog = ({
  open,
  handleClose,
  selectedRow,
  currentlySelectedDateRange,
}) => {
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

      filteredOptions = accounts.map((acc) => ({
        label: acc?.accountNo,
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

  const selectedEntityOption = entityOptionsList.find(
    (entityOption) => entityOption.label === selectedRow?.entity
  );
  const selectedFromCurrencyOption = currencyOptionsList.find(
    (currencyOption) => currencyOption.label === selectedRow?.fromCurrency
  );
  const selectedToCurrencyOption = currencyOptionsList.find(
    (currencyOption) => currencyOption.label === selectedRow?.toCurrency
  );
  const selectedFromAccountOptionsList = generateAccountOptionsList(
    selectedEntityOption,
    selectedFromCurrencyOption
  );
  const selectedToAccountOptionsList = generateAccountOptionsList(
    selectedEntityOption,
    selectedToCurrencyOption
  );
  const selectedFromAccountOption = selectedFromAccountOptionsList.find(
    (fromAccountOption) => fromAccountOption.label === selectedRow?.fromAccount
  );
  const selectedToAccountOption = selectedToAccountOptionsList.find(
    (toAccountOption) => toAccountOption.label === selectedRow?.toAccount
  );
  const selectedExchangeRate = Number(selectedRow.fromAmount) / Number(selectedRow.toAmount);

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      scroll="body"
    >
      <Formik
        initialValues={{
          entity: selectedEntityOption,
          fromAmount: Number(selectedRow.fromAmount),
          fromCurrency: selectedFromCurrencyOption,
          fromAccount: selectedFromAccountOption,

          bankRate: roundNumber(Number(selectedRow.bankRate), BANK_RATE_DP),
          markupRate: roundNumber(Number(selectedRow.markupRate), MARKUP_RATE_DP),
          clientRate: roundNumber(Number(selectedRow.clientRate), CLIENT_RATE_DP),

          bankAmount: roundNumber(Number(selectedRow.bankAmount), BANK_AMOUNT_DP),
          markupAmount: roundNumber(Number(selectedRow.markupAmount), MARKUP_AMOUNT_DP),
          clientAmount: roundNumber(Number(selectedRow.clientAmount), CLIENT_AMOUNT_DP),

          toCurrency: selectedToCurrencyOption,
          toAccount: selectedToAccountOption,
          narrative: selectedRow.narrative,
          overrideFlag: selectedExchangeRate !== Number(selectedRow.rate),
        }}
        // validationSchema={addFXTransactionFormSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          const requestPayload = {
            transactionId: selectedRow.id,
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
              actions.resetForm();
              actions.setSubmitting(false);
              handleClose();
            },
          };
          // doAddFxTransactions(values);

          dispatch(fxTransactionActionCreators.doAddFxTransactions(payload));
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
            <form onSubmit={handleSubmit}>
              <DialogTitle id="form-dialog-title">
                {" "}
                {t("fx_transactions:Fx Modal.Edit Fx Transaction")}
              </DialogTitle>

              <DialogContent>
                <Box mb={2}>
                  <Grid container>
                    <Grid container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
                        <Typography className="mt-4">
                          {t("fx_transactions:Fx Table.Entity")}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <Select
                            closeMenuOnSelect
                            placeholder="Select.."
                            components={{
                              ...animatedComponents,
                            }}
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
                        <Typography className="mt-4">From Amount</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <Field
                          fullWidth
                          component={TextField}
                          label="From Amount"
                          name="fromAmount"
                          variant="filled"
                          value={values.fromAmount}
                          InputProps={{
                            inputProps: values,
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
                        <Typography className="mt-4">From Currency</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <Select
                            closeMenuOnSelect
                            placeholder="Select.."
                            components={{
                              ...animatedComponents,
                            }}
                            isSearchable
                            styles={selectStyles}
                            value={values.fromCurrency}
                            type="number"
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
                        <Typography className="mt-4">Debit Account</Typography>
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
                      fieldLabel={t("fx_transactions:Fx Table.Bank FX Rate %")}
                      fieldKey="bankRate"
                      handleOnBlur={handleOnBlur}
                      touched={touched}
                      values={values}
                      handleFieldReset={resetFieldValue}
                    />

                    <CalculationField
                      fieldLabel={t("fx_transactions:Fx Table.Markup Rate %")}
                      fieldKey="markupRate"
                      handleOnBlur={handleOnBlur}
                      touched={touched}
                      values={values}
                      handleFieldReset={resetFieldValue}
                    />

                    <CalculationField
                      fieldLabel={t("fx_transactions:Fx Table.Client FX Rate %")}
                      fieldKey="clientRate"
                      handleOnBlur={handleOnBlur}
                      touched={touched}
                      values={values}
                      handleFieldReset={resetFieldValue}
                    />

                    <CalculationField
                      fieldLabel={t("fx_transactions:Fx Table.Bank Amount")}
                      fieldKey="bankAmount"
                      handleOnBlur={handleOnBlur}
                      touched={touched}
                      values={values}
                      handleFieldReset={resetFieldValue}
                    />

                    <CalculationField
                      fieldLabel={t("fx_transactions:Fx Table.Markup Amount")}
                      fieldKey="markupAmount"
                      handleOnBlur={handleOnBlur}
                      touched={touched}
                      values={values}
                      handleFieldReset={resetFieldValue}
                    />

                    <CalculationField
                      fieldLabel={t("fx_transactions:Fx Table.Client Amount")}
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
                              incompleteText: t(
                                "fx_transactions:Fx Modal.Insufficient information given"
                              ),
                            });
                          }}
                        >
                          {t("fx_transactions:Fx Modal.Buttons.Calculate")}
                        </Button>
                      </Grid>
                      <Grid item container xs={1} className="px-1" alignContent="center">
                        <Tooltip title={t("fx_transactions:Fx Modal.Buttons.Reset")}>
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
                        <Typography className="mt-4">To Currency</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <Select
                            isDisabled={!values.fromCurrency || fromAccountOptionsList.length === 0}
                            closeMenuOnSelect
                            placeholder="Select.."
                            components={{
                              ...animatedComponents,
                            }}
                            isSearchable
                            styles={selectStyles}
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
                        <Typography className="mt-4">Credit Account</Typography>
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

                    <Grid container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} alignContent="flex-start">
                        <Typography className="mt-4">Narrative</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} alignContent="center" className="px-1">
                        <Field
                          fullWidth
                          component={TextField}
                          name="narrative"
                          multiline
                          rows={2}
                          variant="filled"
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
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default EditFXTransactionDialog;
