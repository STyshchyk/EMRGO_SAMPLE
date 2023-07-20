import { Fragment, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import NumberFormat from "react-number-format";
import { useSelector } from "react-redux";
import Select from "react-select";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik, useFormikContext } from "formik";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PropTypes from "prop-types";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import * as authSelectors from "../../redux/selectors/auth";
import * as counterpartySelectors from "../../redux/selectors/counterparty";
import * as dropdownSelectors from "../../redux/selectors/dropdown";
import * as externalSecuritiesSelectors from "../../redux/selectors/externalSecurities";
import useIsProduction from "../../utils/useIsProduction";
import { addSettlementInstructionFormSchema } from "../../validationSchemas";
import CustomTextField from "../CustomTextField";
import RealtimeSecSearchDialog from "../RealtimeSecSearchDialog";

const PREFIX = 'RaiseSettlementInstructionForm';

const classes = {
  input: `${PREFIX}-input`
};

const StyledMuiPickersUtilsProvider = styled(MuiPickersUtilsProvider)(() => ({
  [`& .${classes.input}`]: {
    "&:disabled": {
      color: "green",
      backgroundColor: "red",
    },
  }
}));

// !REMINDER - 7/3/23: REAL-TIME SECURITY LOOKUP BUTTON IS DISABLED WHEN IN STAGING/PRODUCTION ENVIRONMENTS

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

const CustomCurrencyInputField = (props) => {
  const { inputRef, onChange, decimals = 2, ...other } = props;
  const { setFieldTouched } = useFormikContext();

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
        setFieldTouched(props.name);
      }}
      thousandSeparator
      isNumericString
      decimalScale={decimals}
    />
  );
};

CustomCurrencyInputField.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const CustomNumberInputField = (props) => {
  const { inputRef, onChange, ...other } = props;
  const { setFieldTouched } = useFormikContext();
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
        setFieldTouched(props.name);
      }}
      thousandSeparator
      isNumericString
      decimalScale={0}
    />
  );
};

CustomNumberInputField.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const DependentAmountField = (props) => {
  const { values, touched, setFieldValue } = useFormikContext();
  const { valueA, valueB } = props;
  const touchedFieldA = touched[valueA?.key];
  const touchedFieldB = touched[valueB?.key];

  useEffect(() => {
    if (valueA && valueB) {
      if (valueA?.value?.toString().trim() !== "" && valueB?.value?.toString().trim() !== "") {
        if (props.calculatedValue !== values[props.name] && !touchedFieldA && !touchedFieldB) {
          setFieldValue(props.name, values[props.name]);
        } else {
          setFieldValue(props.name, props.calculatedValue);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueA?.value, valueB?.value, setFieldValue, props.name]);

  return (
    <>
      <Field
        fullWidth
        component={CustomTextField}
        label={props.label}
        name={props.name}
        variant="filled"
        value={values[props.name]}
        disabled={
          !values.externalSecuritySelectOption?.value?.currencyName ||
          ["DFOP", "RFOP"].includes(values.settlementTypeSelectOption?.label)
        }
        InputProps={{
          inputComponent: CustomCurrencyInputField,
          endAdornment: (
            <InputAdornment disableTypography position="end">
              <span
                style={{
                  fontSize: "0.75em",
                  padding: "0 1rem",
                }}
              >
                {values.externalSecuritySelectOption?.value?.currencyName?.name ?? ""}
              </span>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

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

export const buildRaiseSIRequestPayload = (formikValues) => {
  const isFreeOfPayment = ["DFOP", "RFOP"].includes(formikValues.settlementTypeSelectOption?.label);

  const requestPayload = {
    ...formikValues,
    settlementAmount: parseFloat(formikValues.settlementAmount, 10),
    price: parseFloat(formikValues.price, 10),
    quantity: parseFloat(formikValues.quantity, 10),
    counterPartyId: formikValues.counterpartySelectOption?.value?.id,
    counterpartySelectOption: undefined,
    counterPartySSIId: formikValues.counterpartySSISelectOption?.value?.id,
    counterpartySSISelectOption: undefined,
    externalSecuritiesId: formikValues.externalSecuritySelectOption?.value?.id,
    externalSecuritySelectOption: undefined,
    settlementTypeId: formikValues.settlementTypeSelectOption?.value,
    settlementTypeSelectOption: undefined,
    entityGroupId: formikValues?.entityGroupId,
    userId: formikValues?.entityGroupUserId,
    entityId: undefined,
    entityGroupUserId: undefined,
    principalAmount: !formikValues.principalAmount
      ? 0
      : parseFloat(formikValues.principalAmount, 10),
    accruedInterest: !formikValues.accruedInterest
      ? 0
      : parseFloat(formikValues.accruedInterest, 10),
    entityGroup: undefined,
    internalTradeRef: formikValues.internalTradeRef === "" ? "--" : formikValues.internalTradeRef, // otherwise even when internalRef isn't amended appears on audit log
  };

  if (isFreeOfPayment) {
    requestPayload.price = undefined;
    requestPayload.settlementAmount = undefined;
    requestPayload.accruedInterest = undefined;
    requestPayload.principalAmount = undefined;
  }

  return requestPayload;
};

export const generateSettlementInstructionTypeOptionsList = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data
      .filter((item) => !item?.isPrimaryIssuance)
      .map((item) => ({
        label: item.name,
        value: item.id,
      }));
  }

  return [];
};

export const generateExternalSecurityOptionsList = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data
      .filter((item) => item?.assetTypeName?.name !== "Equity")
      .filter((item) => item?.isin)
      .map((item) => ({
        label: item.isin,
        value: item,
      }));
  }

  return [];
};

export const generateCounterpartyOptionsList = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data
      .filter((item) => item.status === "Active")
      .map((item) => ({
        label: item.shortName,
        value: item,
      }));
  }

  return [];
};

export const generateCounterpartySSIOptionsList = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data
      .filter((item) => item.status === "Active")
      .map((item) => ({
        label: item.ssiLabel,
        value: item,
      }));
  }

  return [];
};

const generateEntityGroupsOptionsList = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data
      .filter((i) => i.entityType === "INVESTOR")
      .map((i) => ({
        label: i.name,
        value: i,
      }));
  }

  return [];
};

const generateEntityGroupUserOptionsList = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data
      .filter((i) => i.user?.isActive)
      .map((i) => ({
        label: i.user?.email,
        value: i.user,
      }));
  }

  return [];
};

const RaiseSettlementInstructionForm = ({
  handleSubmit,
  initialValues = {
    counterpartySelectOption: "",
    counterpartySSISelectOption: "",
    externalSecuritySelectOption: "",
    price: "",
    quantity: "",
    settlementAmount: "",
    settlementDate: null,
    settlementTypeSelectOption: "",
    tradeDate: null,
    internalTradeRef: "",
    principalAmount: "",
    accruedInterest: "",
  },
  isSubmitting,
  handleCloseDialog,
  editable,
  options,
}) => {

  const inProd = useIsProduction();

  const counterpartiesList = useSelector(counterpartySelectors.selectAllCounterparties);
  const dropdownOptions = useSelector(dropdownSelectors.selectDropdownOptions);
  const externalSecuritiesList = useSelector(
    externalSecuritiesSelectors.selectExternalSecuritiesData
  );
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityType = currentEntityGroup?.entityType;
  const isWethaqUser = currentEntityType === "EMRGO_SERVICES";
  const [selectedEntityOption, setSelectedEntityOption] = useState(null);
  const [selectedEntityGroupOption, setSelectedEntityGroupOption] = useState(null);
  const [selectedEntityGroupUserOption, setSelectedEntityGroupUserOption] = useState(null);
  const [openRealtimeSecuritySearchDialog, setOpenRealtimeSecuritySearchDialog] = useState(false);

  const counterpartyOptionsList = generateCounterpartyOptionsList(counterpartiesList);
  const externalSecurityOptionsList = generateExternalSecurityOptionsList(externalSecuritiesList);
  const settlementInstructionTypeOptionsList = generateSettlementInstructionTypeOptionsList(
    dropdownOptions?.settlementInstructionType
  );

  /*
    Note that if Settlement Type is set to DFOP or RFOP then
    the Price and Settlement Amount fields should be greyed out and not populated by the user
  */
  return (
    <StyledMuiPickersUtilsProvider utils={MomentUtils}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={addSettlementInstructionFormSchema}
      >
        {({ values, setFieldValue, resetForm }) => (
          <Form>
            <Grid container spacing={2}>
              {isWethaqUser && !editable ? (
                <Fragment>
                  <InlineFormField label={"Entity"}>
                    <Select
                      {...baseSelectProps}
                      placeholder={"Select Entity"}
                      value={selectedEntityOption}
                      options={options.entityOptionsList}
                      onChange={(newValue) => {
                        setFieldValue("entityId", newValue?.value?.id);
                        setSelectedEntityOption(newValue);
                        setSelectedEntityGroupOption(null);
                        setSelectedEntityGroupUserOption(null);
                      }}
                    />
                  </InlineFormField>
                  <InlineFormField label={"Entity Group"}>
                    <Select
                      {...baseSelectProps}
                      placeholder={"Select Entity Group"}
                      value={selectedEntityGroupOption}
                      options={generateEntityGroupsOptionsList(selectedEntityOption?.value?.groups)}
                      onChange={(newValue) => {
                        setFieldValue("entityGroupId", newValue?.value?.id);
                        setSelectedEntityGroupOption(newValue);
                        setSelectedEntityGroupUserOption(null);
                      }}
                      isDisabled={!selectedEntityOption}
                    />
                  </InlineFormField>
                  <InlineFormField label={"Entity Group User"}>
                    <Select
                      {...baseSelectProps}
                      placeholder={"Select Entity Group User"}
                      value={selectedEntityGroupUserOption}
                      options={generateEntityGroupUserOptionsList(
                        selectedEntityGroupOption?.value?.users
                      )}
                      onChange={(newValue) => {
                        setFieldValue("entityGroupUserId", newValue?.value?.id);
                        setSelectedEntityGroupUserOption(newValue);
                      }}
                      isDisabled={!selectedEntityOption}
                    />
                  </InlineFormField>
                </Fragment>
              ) : (
                <InlineFormField label={"Entity"}>
                  <Field
                    fullWidth
                    placeholder="Entity"
                    component={CustomTextField}
                    name="entity"
                    variant="filled"
                    type="text"
                    value={values?.entityGroup?.entity?.corporateEntityName || "N/A"}
                    disabled
                  />
                </InlineFormField>
              )}

              <InlineFormField label="Settlement Type">
                <Select
                  {...baseSelectProps}
                  placeholder={"Select Settlement Type"}
                  value={values.settlementTypeSelectOption}
                  options={settlementInstructionTypeOptionsList}
                  onChange={(newValue) => {
                    setFieldValue("settlementTypeSelectOption", newValue);
                  }}
                />
              </InlineFormField>

              <InlineFormField label="ISIN">
                <Select
                  {...baseSelectProps}
                  placeholder={"Select ISIN"}
                  value={values.externalSecuritySelectOption}
                  options={externalSecurityOptionsList}
                  onChange={(newValue, triggeredAction) => {
                    setFieldValue("externalSecuritySelectOption", newValue);

                    if (triggeredAction.action === "clear") {
                      resetForm();
                    }
                  }}
                  isDisabled={editable}
                />
              </InlineFormField>
              {!inProd && (
                <Grid container item justifyContent="flex-end">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setOpenRealtimeSecuritySearchDialog(true);
                      }}
                      disabled={editable}
                    >
                      <Typography variant="caption">Security lookup</Typography>
                    </Button>
                  </Grid>
                </Grid>
              )}

              <InlineFormField label={"Security"}>
                <Field
                  className={classes.input}
                  fullWidth
                  component={CustomTextField}
                  label="Security"
                  name="security"
                  variant="filled"
                  type="text"
                  value={values.externalSecuritySelectOption?.value?.shortName ?? ""}
                  disabled
                />
              </InlineFormField>

              <InlineFormField label={"Currency"}>
                <Field
                  fullWidth
                  component={CustomTextField}
                  label="Currency"
                  name="currencyName"
                  variant="filled"
                  type="text"
                  value={values.externalSecuritySelectOption?.value?.currencyName?.name ?? ""}
                  disabled
                />
              </InlineFormField>

              <InlineFormField label="Trade Date">
                <Field
                  component={DatePicker}
                  onChange={(date) => {
                    setFieldValue("tradeDate", date.toDate());
                  }}
                  format={DEFAULT_DATE_FORMAT}
                  fullWidth
                  inputVariant="filled"
                  label={DEFAULT_DATE_FORMAT}
                  name="tradeDate"
                  variant="dialog"
                />
              </InlineFormField>

              <InlineFormField label="Settlement Date">
                <Field
                  component={DatePicker}
                  onChange={(date) => {
                    setFieldValue("settlementDate", date.toDate());
                  }}
                  format={DEFAULT_DATE_FORMAT}
                  fullWidth
                  inputVariant="filled"
                  label={DEFAULT_DATE_FORMAT}
                  minDate={values.tradeDate}
                  name="settlementDate"
                  variant="dialog"
                  disabled={!values.tradeDate}
                />
              </InlineFormField>

              <InlineFormField label={"Quantity"}>
                <Field
                  fullWidth
                  component={CustomTextField}
                  disabled={false} // !Dev notes: Jeez :/ -> (https://github.com/stackworx/formik-mui/issues/81#issuecomment-517260458)
                  label="Quantity"
                  name="quantity"
                  variant="filled"
                  value={values.quantity}
                  InputProps={{
                    inputComponent: CustomNumberInputField,
                  }}
                />
              </InlineFormField>

              <InlineFormField label={"Price %"}>
                <Field
                  component={CustomTextField}
                  disabled={
                    !values.externalSecuritySelectOption?.value?.currencyName ||
                    ["DFOP", "RFOP"].includes(values.settlementTypeSelectOption?.label)
                  }
                  fullWidth
                  label="Price"
                  name="price"
                  value={values.price}
                  variant="filled"
                  InputProps={{
                    inputComponent: CustomCurrencyInputField,
                    endAdornment: (
                      <InputAdornment disableTypography position="end">
                        <span
                          style={{
                            fontSize: "0.75em",
                            padding: "0 1rem",
                          }}
                        >
                          {values.externalSecuritySelectOption?.value?.currencyName?.name ?? ""}
                        </span>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    decimals: 5,
                  }}
                />
              </InlineFormField>

              <InlineFormField label={"Principal Amount"}>
                <DependentAmountField
                  label="Principal Amount"
                  name="principalAmount"
                  valueA={{ key: "quantity", value: values?.quantity }}
                  valueB={{ key: "price", value: values?.price }}
                  calculatedValue={(values.price / 100) * Number(values?.quantity)}
                />
              </InlineFormField>

              <InlineFormField label={"Accrued Interest"}>
                <Field
                  fullWidth
                  component={CustomTextField}
                  label="Accrued Interest"
                  name="accruedInterest"
                  variant="filled"
                  value={values.accruedInterest}
                  disabled={
                    !values.externalSecuritySelectOption?.value?.currencyName ||
                    ["DFOP", "RFOP"].includes(values.settlementTypeSelectOption?.label)
                  }
                  InputProps={{
                    inputComponent: CustomCurrencyInputField,
                    endAdornment: (
                      <InputAdornment disableTypography position="end">
                        <span
                          style={{
                            fontSize: "0.75em",
                            padding: "0 1rem",
                          }}
                        >
                          {values.externalSecuritySelectOption?.value?.currencyName?.name ?? ""}
                        </span>
                      </InputAdornment>
                    ),
                  }}
                />
              </InlineFormField>

              <InlineFormField label={"Settlement Amount"}>
                <DependentAmountField
                  label="Settlement Amount"
                  name="settlementAmount"
                  valueA={{ key: "principalAmount", value: values?.principalAmount }}
                  valueB={{ key: "accruedInterest", value: values?.accruedInterest }}
                  calculatedValue={
                    Number(values?.principalAmount) + Number(values?.accruedInterest)
                  }
                />
              </InlineFormField>

              <InlineFormField label="Counterparty">
                <Select
                  {...baseSelectProps}
                  placeholder={"Select Counterparty"}
                  value={values.counterpartySelectOption}
                  options={counterpartyOptionsList}
                  onChange={(newValue) => {
                    setFieldValue("counterpartySelectOption", newValue);
                    setFieldValue("counterpartySSISelectOption", null);
                  }}
                />
              </InlineFormField>

              <InlineFormField label="Counterparty SSI">
                <Select
                  {...baseSelectProps}
                  isDisabled={!values.counterpartySelectOption}
                  placeholder={"Select Counterparty SSI"}
                  value={values.counterpartySSISelectOption}
                  options={generateCounterpartySSIOptionsList(
                    values.counterpartySelectOption?.value?.counterpartySSI
                  )}
                  onChange={(newValue) => {
                    setFieldValue("counterpartySSISelectOption", newValue);
                  }}
                />
              </InlineFormField>

              <InlineFormField label={"Internal Trade Ref"}>
                <Field
                  fullWidth
                  component={CustomTextField}
                  label="Internal Trade Ref"
                  name="internalTradeRef"
                  variant="filled"
                  type="text"
                  value={values.internalTradeRef ?? ""}
                  onChange={(newValue) => {
                    setFieldValue("internalTradeRef", newValue);
                  }}
                />
              </InlineFormField>

              <Grid item container spacing={2} justifyContent="flex-end">
                <Grid item>
                  <Button color="primary" variant="outlined" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting || (isWethaqUser && !selectedEntityOption && !editable)}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            {openRealtimeSecuritySearchDialog && (
              <RealtimeSecSearchDialog
                open={openRealtimeSecuritySearchDialog}
                handleClose={() => {
                  setOpenRealtimeSecuritySearchDialog(false);
                }}
                handleSecurityResultItemSelect={(row) => {
                  const found = externalSecurityOptionsList.find(
                    (item) => item.value.id === row?.externalSecurityId
                  );

                  if (found) {
                    setFieldValue("externalSecuritySelectOption", found);
                  }
                }}
                assetTypeFilterValue="Fixed Income"
              />
            )}
          </Form>
        )}
      </Formik>
    </StyledMuiPickersUtilsProvider>
  );
};

RaiseSettlementInstructionForm.defaultProps = {
  editable: false,
};

export default RaiseSettlementInstructionForm;
