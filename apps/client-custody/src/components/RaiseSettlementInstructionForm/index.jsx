import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { MySelect as Select } from "@emrgo-frontend/shared-ui";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import moment from "moment";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import { currencyRenderer } from "../../constants/renderers";
import { getAttribute } from "../../helpers/custodyAndSettlement";
import * as authSelectors from "../../redux/selectors/auth";
import * as counterpartySelectors from "../../redux/selectors/counterparty";
import * as dropdownSelectors from "../../redux/selectors/dropdown";
import * as externalSecuritiesSelectors from "../../redux/selectors/externalSecurities";
import * as reportsSelectors from "../../redux/selectors/reports";
import useIsProduction from "../../utils/useIsProduction";
import { addSettlementInstructionFormSchema } from "../../validationSchemas";
import CustomNumberInputField from "../CustomNumberInputField";
import CustomTextField from "../CustomTextField";
import RealtimeSecSearchDialog from "../RealtimeSecSearchDialog";

const PREFIX = "RaiseSettlementInstructionForm";

const classes = {
  input: `${PREFIX}-input`,
};

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
  }, [valueA?.value, valueB?.value, setFieldValue, props.name, props.calculatedValue]);
  const currencyExists = values.externalSecuritySelectOption?.value?.currencyName;
  const isSettlementTypeDFOPorRFOP = ["DFOP", "RFOP"].includes(
    values.settlementTypeSelectOption?.label
  );
  const isVariantfilled = currencyExists && !isSettlementTypeDFOPorRFOP;
  return (
    <Field
      fullWidth
      component={CustomTextField}
      label={props.label}
      name={props.name}
      variant={isVariantfilled ? "filled" : "filled"}
      disabled={!currencyExists || isSettlementTypeDFOPorRFOP}
      value={values[props.name]}
      InputProps={{
        inputComponent: CustomNumberInputField,
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
  );
};

const clearFormCalculation = (setFieldValue, values) => {
  if (values?.quantity) setFieldValue("quantity", "");
  if (values?.price) setFieldValue("price", "");
  if (values?.principalAmount) setFieldValue("principalAmount", "");
  if (values?.accruedInterest) setFieldValue("accruedInterest", "");
  if (values?.settlementAmount) setFieldValue("settlementAmount", "");
};
const InlineFormField = ({ label, name, children }) => (
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
      {name && (
        <ErrorMessage
          component={Typography}
          variant="caption"
          color="error"
          className="ml-4"
          name={name}
        />
      )}
    </Grid>
  </Grid>
);

export const buildRaiseSIRequestPayload = (formikValues) => {
  const isFreeOfPayment = ["DFOP", "RFOP"].includes(formikValues.settlementTypeSelectOption?.label);
  const isEquityType =
    formikValues.externalSecuritySelectOption?.value?.assetTypeName?.key === "equity";

  const requestPayload = {
    ...formikValues,
    commission: isEquityType ? parseFloat(formikValues.accruedInterest, 10) : undefined,
    portfolio_id: formikValues.portfolio_id?.id,
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
    userId: formikValues?.entityGroupUserId, // FIX THIS
    entityId: undefined,
    entityGroupUserId: undefined,
    principalAmount: !formikValues.principalAmount
      ? 0
      : parseFloat(formikValues.principalAmount, 10),
    accruedInterest: isEquityType
      ? undefined
      : !formikValues.accruedInterest
      ? 0
      : parseFloat(formikValues.accruedInterest, 10),
    entityGroup: undefined,
    internalTradeRef: formikValues.internalTradeRef === "" ? "--" : formikValues.internalTradeRef, // otherwise even when internalRef isn't amended appears on audit log
  };

  console.log(requestPayload);

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
      .filter((item) => item?.longName)
      .filter((item) => item?.name)
      .filter((item) => item.status === "Active")
      .map((item) => ({
        label: item.name,
        value: { ...item, isin: getAttribute(item?.attributes, "isin") ?? item?.isin },
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
    portfolio_id: "",
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
  const currentSafeAccounts = useSelector(reportsSelectors.selectSafeAccountsData);
  console.log(currentSafeAccounts);
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
  const activeSafeAccounts = currentSafeAccounts.filter((account) => account.status === "Active");
  /*
              Note that if Settlement Type is set to DFOP or RFOP then
              the Price and Settlement Amount fields should be greyed out and not populated by the user
            */
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={addSettlementInstructionFormSchema}
    >
      {({ values, setFieldValue, resetForm }) => {
        let curSetType = values.externalSecuritySelectOption?.value?.assetTypeName?.key;
        let isEquityType = curSetType === "equity";
        let settlementType = values.settlementTypeSelectOption?.label ?? "";
        const currencyExists = values.externalSecuritySelectOption?.value?.currencyName;
        const isSettlementTypeDFOPorRFOP = ["DFOP", "RFOP"].includes(
          values.settlementTypeSelectOption?.label
        );
        const isVariantfilled = currencyExists && !isSettlementTypeDFOPorRFOP;
        return (
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
                    value={
                      values?.entityGroup?.entity?.corporateEntityName ||
                      currentEntityGroup?.entity?.corporateEntityName
                    }
                    disabled
                  />
                </InlineFormField>
              )}
              <InlineFormField label={"Safekeeping Account"}>
                <Select
                  {...baseSelectProps}
                  placeholder={"Select Safekeeping Account"}
                  options={activeSafeAccounts}
                  getOptionLabel={(option) =>
                    `${option.name} | ${option.securitiesAccount.accountNumber}`
                  }
                  getOptionValue={(option) => option}
                  value={values?.portfolio_id}
                  onChange={(newValue) => {
                    setFieldValue("portfolio_id", newValue);
                  }}
                />
                <ErrorMessage
                  component={Typography}
                  variant="caption"
                  color="error"
                  className="ml-4"
                  name="portfolio_id"
                />
              </InlineFormField>
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
                <ErrorMessage
                  component={Typography}
                  variant="caption"
                  color="error"
                  className="ml-4"
                  name="settlementTypeSelectOption"
                />
              </InlineFormField>

              <InlineFormField label="Security">
                <Select
                  {...baseSelectProps}
                  placeholder={"Select Security"}
                  value={values.externalSecuritySelectOption}
                  options={externalSecurityOptionsList}
                  onChange={(newValue, triggeredAction) => {
                    setFieldValue("externalSecuritySelectOption", newValue);
                    let curValue = newValue?.value?.assetTypeName?.key;
                    if (curValue && curSetType && curValue !== curSetType)
                      clearFormCalculation(setFieldValue, values); //Reset form if security type is changed to avoid miscalculation
                    if (triggeredAction.action === "clear") {
                      resetForm();
                    }
                  }}
                  isDisabled={editable}
                />
                <ErrorMessage
                  component={Typography}
                  variant="caption"
                  color="error"
                  className="ml-4"
                  name="externalSecuritySelectOption"
                />
              </InlineFormField>
              {/* {inProd && ( */}
              <Grid container item justifyContent="flex-end">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpenRealtimeSecuritySearchDialog(true);
                    }}
                    disabled={editable}
                  >
                    <Typography variant="caption">Security lookup</Typography>
                  </Button>
                </Grid>
              </Grid>
              {/* )} */}

              <InlineFormField label={"ISIN"}>
                <Field
                  className={classes.input}
                  fullWidth
                  component={CustomTextField}
                  label="ISIN"
                  name="isin"
                  variant="filled"
                  type="text"
                  value={values.externalSecuritySelectOption?.value?.isin ?? ""}
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
                    setFieldValue("tradeDate", date);
                  }}
                  inputProps={{
                    shrink: "false",
                    size: "small",
                    variant: "filled",
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      variant: "filled",
                    },
                  }}
                  value={values.tradeDate ? moment(values.tradeDate) : null}
                  format={DEFAULT_DATE_FORMAT}
                  fullWidth
                  inputVariant="filled"
                  label={DEFAULT_DATE_FORMAT}
                  name="tradeDate"
                  variant="dialog"
                />
                <ErrorMessage
                  component={Typography}
                  variant="caption"
                  color="error"
                  className="ml-4"
                  name="tradeDate"
                />
              </InlineFormField>

              <InlineFormField label="Settlement Date">
                <Field
                  component={DatePicker}
                  onChange={(date) => {
                    setFieldValue("settlementDate", date);
                  }}
                  value={values.settlementDate ? moment(values.settlementDate) : null}
                  format={DEFAULT_DATE_FORMAT}
                  fullWidth
                  inputVariant="filled"
                  label={DEFAULT_DATE_FORMAT}
                  minDate={moment(values.tradeDate)}
                  name="settlementDate"
                  inputProps={{
                    shrink: "false",
                    size: "small",
                    variant: "filled",
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      variant: "filled",
                    },
                  }}
                  variant="dialog"
                  disabled={!values.tradeDate}
                />
                <ErrorMessage
                  component={Typography}
                  variant="caption"
                  color="error"
                  className="ml-4"
                  name="settlementDate"
                />
              </InlineFormField>

              <InlineFormField label={"Quantity"} name="quantity">
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
                  inputProps={{ decimalScale: 6 }}
                />
              </InlineFormField>

              <InlineFormField label={`Price ${isEquityType ? "" : "%"}`} name={"price"}>
                <Field
                  component={CustomTextField}
                  fullWidth
                  label="Price"
                  name="price"
                  value={values.price}
                  variant={isVariantfilled ? "filled" : "filled"}
                  disabled={!currencyExists || isSettlementTypeDFOPorRFOP}
                  InputProps={{
                    inputComponent: CustomNumberInputField,
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
                    decimalScale: 6,
                  }}
                />
              </InlineFormField>

              <InlineFormField label={"Principal Amount"}>
                <DependentAmountField
                  label="Principal Amount"
                  name="principalAmount"
                  valueA={{ key: "quantity", value: values?.quantity }}
                  valueB={{ key: "price", value: values?.price }}
                  calculatedValue={
                    isEquityType
                      ? currencyRenderer(values.price * Number(values?.quantity))
                      : currencyRenderer((values.price / 100) * Number(values?.quantity))
                  }
                />
              </InlineFormField>

              <InlineFormField label={isEquityType ? "Commission / Charges" : "Accrued Interest"}>
                <Field
                  fullWidth
                  component={CustomTextField}
                  label={isEquityType ? "Commission / Charges" : "Accrued Interest"}
                  name="accruedInterest"
                  variant={isVariantfilled ? "filled" : "filled"}
                  disabled={!currencyExists || isSettlementTypeDFOPorRFOP}
                  value={values.accruedInterest}
                  InputProps={{
                    inputComponent: CustomNumberInputField,
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
                    decimalScale: isEquityType ? 0 : undefined,
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
                    isEquityType
                      ? settlementType === "DVP"
                        ? Number(values?.principalAmount) - Number(values?.accruedInterest)
                        : Number(values?.principalAmount) + Number(values?.accruedInterest)
                      : Number(values?.principalAmount) + Number(values?.accruedInterest)
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
                <ErrorMessage
                  component={Typography}
                  variant="caption"
                  color="error"
                  className="ml-4"
                  name="counterpartySelectOption"
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
                <ErrorMessage
                  component={Typography}
                  variant="caption"
                  color="error"
                  className="ml-4"
                  name="counterpartySSISelectOption"
                />
              </InlineFormField>

              <InlineFormField label={"Client Settlement Reference"}>
                <Field
                  fullWidth
                  component={CustomTextField}
                  label="Client Settlement Reference"
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
                  <Button color="primary" variant="filled" onClick={handleCloseDialog}>
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
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

RaiseSettlementInstructionForm.defaultProps = {
  editable: false,
};

export default RaiseSettlementInstructionForm;
