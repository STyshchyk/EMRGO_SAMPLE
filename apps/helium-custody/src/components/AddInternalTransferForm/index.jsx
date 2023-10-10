import { createRef } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { useSelector } from "react-redux";

import { Select } from "@emrgo-frontend/shared-ui";
import { TextField as TextFieldMui } from "@mui/material";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik, useFormikContext } from "formik";
import { TextField } from "formik-mui";
import moment from "moment";
import PropTypes from "prop-types";

import * as billingAndPaymentsSelectors from "../../redux/selectors/cashManagement";
import selectStyles from "../../styles/cssInJs/reactSelect";
import ReactSelectCurrencyOption from "../ReactSelectCurrencyOption";

// !INTERNAL TRANSFER PAGE COMPONENT

const baseSelectProps = {
  closeMenuOnSelect: true,
  isClearable: true,
  isSearchable: true,
  menuPortalTarget: document.body,
  styles: selectStyles,
};

const errorWaringMsg = {
  insufficentBalance:
    "Warning: Selected source account has insufficient balance for requested action",
  negativeBalance: "Warning: Selected source account has negative balance",
  similarAccountBalance: "Warning: Destination Account can not be same as Selected Account",
};
const InlineFormField = ({ label, children }) => (
  <Grid item container md={12}>
    <Grid item md={5} xs={12} container direction="column">
      <Typography>{label}</Typography>
    </Grid>
    <Grid item md={7} xs={12}>
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
  const { setFieldTouched } = useFormikContext();
  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: parseFloat(values.value, 10),
          },
        });
        setFieldTouched(props.name);
      }}
      thousandSeparator
      decimalScale={20}
      allowNegative={true}
    />
  );
};

CustomNumberInputField.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const buildAddInternalTransferRequestPayload = {};

export const generateEntityOptionsList = (data) =>
  data.map((entity) => ({ value: entity.id, label: entity.entityName }));
export const generateWethaqAccountOptionsList = (data) =>
  data.map((account) => ({
    value: {
      accountId: account.id,
      entityId: account.group.entity?.id,
      currencyId: account.currency?.id,
      currency: account.currency?.name,
      accountBalance: account.accountBalance,
    },
    label: account.accountNo,
  }));

const AddInternalTransferForm = ({
  handleCloseDialog,
  initialValues = {
    sourceEntity: null,
    sourceAccount: null,
    destinationEntity: null,
    destinationAccount: null,
    transferAmount: "",
    description: "",
  },
  handleSubmit,
}) => {
  const { t } = useTranslation(["cash_management", "components"]);

  const sourceEntityRef = createRef();
  const sourceAccountRef = createRef();
  const destinationEntityRef = createRef();
  const destinationAccountRef = createRef();
  const formattedDate = moment().format("DD/MM/YYYY");

  const sourceOwners = useSelector(billingAndPaymentsSelectors.selectSourceOwners);
  const emrgoOwners = useSelector(billingAndPaymentsSelectors.selectEmrgoOwners);
  const destinationOwners = useSelector(billingAndPaymentsSelectors.selectDestinationOwners);
  const sourceAccounts = useSelector(billingAndPaymentsSelectors.selectSourceAccounts);
  const destinationAccounts = useSelector(billingAndPaymentsSelectors.selectDestinationAccounts);
  const sourceEntitiesDropdown = generateEntityOptionsList(sourceOwners);
  const destinationEntitiesDropdown = generateEntityOptionsList(destinationOwners);
  let sourceAccountsDropdown = generateWethaqAccountOptionsList(sourceAccounts);
  let destinationAccountsDropdown = generateWethaqAccountOptionsList(destinationAccounts);
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ values, setFieldValue, isSubmitting }) => {
        const sourceEntityChange = (selectedEntity) => {
          setFieldValue("sourceEntity", selectedEntity);
          setFieldValue("sourceAccount", null);
          sourceAccountsDropdown = generateWethaqAccountOptionsList(
            sourceAccounts.filter((account) =>
              selectedEntity ? account.group.entity.id === selectedEntity.value : true
            )
          );
        };

        const sourceAccountChange = (selectedAccount) => {
          setFieldValue("sourceAccount", selectedAccount);
          const tempEntitiesList = generateEntityOptionsList(
            sourceOwners.filter((entity) =>
              selectedAccount ? entity.id === selectedAccount.value.entityId : true
            )
          );

          if (selectedAccount) {
            setFieldValue("sourceEntity", tempEntitiesList[0]);
          }

          if (selectedAccount) {
            destinationAccountsDropdown = generateWethaqAccountOptionsList(
              destinationAccounts
                .filter((account) =>
                  values.destinationEntity
                    ? account.group.entity.id === values.destinationEntity.value
                    : true
                )
                .filter((account) =>
                  selectedAccount ? account.currencyId === selectedAccount.value.currencyId : true
                )
                .filter((account) =>
                  selectedAccount ? account.id !== selectedAccount.value.accountId : false
                )
            );

            if (selectedAccount.value.currencyId !== values.destinationAccount?.value.currencyId) {
              setFieldValue("destinationAccount", null);
            }
          }
        };

        const destinationEntityChange = (selectedEntity) => {
          setFieldValue("destinationEntity", selectedEntity);
          setFieldValue("destinationAccount", null);
          destinationAccountsDropdown = generateWethaqAccountOptionsList(
            destinationAccounts
              .filter((account) =>
                selectedEntity ? account.group.entity.id === selectedEntity.value : true
              )
              .filter((account) =>
                values.sourceAccount
                  ? account.currencyId === values.sourceAccount.value.currencyId
                  : true
              )
          );
        };

        const destinationAccountChange = (selectedAccount) => {
          setFieldValue("destinationAccount", selectedAccount);
          const tempEntities = generateEntityOptionsList(
            destinationOwners.filter((entity) =>
              selectedAccount ? entity.id === selectedAccount.value.entityId : true
            )
          );

          if (selectedAccount) {
            sourceAccountsDropdown = generateWethaqAccountOptionsList(
              sourceAccounts
                .filter((account) =>
                  values.sourceEntity ? account.group.entity.id === values.sourceEntity.value : true
                )
                .filter((account) =>
                  selectedAccount ? account.currencyId === selectedAccount.value.currencyId : true
                )
                .filter((account) =>
                  selectedAccount ? account.id !== selectedAccount.value.accountId : false
                )
            );

            setFieldValue("destinationEntity", tempEntities[0]);
          }
        };

        const showSelectedCurrency = () => {
          let currency = "";
          // values.sourceAccount.value.currency
          if (values.sourceAccount || values.destinationAccount) {
            currency =
              values.sourceAccount?.value.currency || values.destinationAccount?.value.currency;
          }
          return currency;
        };

        const validateSourceAccountTransfer = () => {
          let hasSufficientBalance = "";
          if (
            values.sourceAccount &&
            values.destinationAccount &&
            values.destinationAccount.label === values.sourceAccount.label
          ) {
            return "similarAccountBalance";
          }
          // if either source account or transfer amount is not set in the form then skip the checking logic
          if (!values.sourceAccount || !values.transferAmount) {
            return "";
          }
          const parsedtransferAmount = parseFloat(values.transferAmount, 10);
          const parsedAccountBalance = parseFloat(values.sourceAccount?.value?.accountBalance, 10);
          if (parsedAccountBalance < 0) return "negativeBalance";
          const difference = parsedAccountBalance - parsedtransferAmount;

          if (difference < 0) {
            hasSufficientBalance = "insufficentBalance";
          }

          return hasSufficientBalance;
        };
        const checkIfSourceAccBalanceIsNegative = () => {
          let hasSufficientBalance = true;

          // if either source account or transfer amount is not set in the form then skip the checking logic
          if (!values.sourceAccount) {
            return hasSufficientBalance;
          }
          const sourceAccountBanace = values.sourceAccount?.value?.accountBalance;
          console.log("sourceAccountBanace", sourceAccountBanace);
          if (sourceAccountBanace < 0) {
            hasSufficientBalance = false;
          }

          return hasSufficientBalance;
        };
        return (
          <Form>
            <Grid container spacing={2}>
              <InlineFormField label={"Date"}>
                <Typography>{formattedDate}</Typography>
              </InlineFormField>

              <InlineFormField label={t("Internal Transfer.Source Account Owner")}>
                <Select
                  ref={sourceEntityRef}
                  {...baseSelectProps}
                  placeholder={t("components:Select.Select")}
                  value={values.sourceEntity}
                  options={sourceEntitiesDropdown}
                  onChange={(selectedEntity) => {
                    sourceEntityChange(selectedEntity);
                  }}
                />
              </InlineFormField>

              <InlineFormField label={t("Internal Transfer.Source Account")}>
                <Select
                  {...baseSelectProps}
                  ref={sourceAccountRef}
                  components={{ Option: ReactSelectCurrencyOption }}
                  placeholder={t("components:Select.Select")}
                  value={values.sourceAccount}
                  options={sourceAccountsDropdown}
                  onChange={(selectedAccount) => {
                    sourceAccountChange(selectedAccount);
                  }}
                />
              </InlineFormField>

              <InlineFormField label="Source Account Balance">
                <TextFieldMui
                  disabled
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={values.sourceAccount?.value?.accountBalance}
                  InputProps={{
                    inputComponent: CustomNumberInputField,
                    "data-testid": "total-coupon-amount-input-field",
                    endAdornment: (
                      <InputAdornment disableTypography position="end">
                        <span
                          style={{
                            fontSize: "0.75em",
                            padding: "0 1rem",
                          }}
                        >
                          {showSelectedCurrency()}
                        </span>
                      </InputAdornment>
                    ),
                  }}
                />
              </InlineFormField>

              <InlineFormField label={t("Internal Transfer.Destination Account Owner")}>
                <Select
                  {...baseSelectProps}
                  ref={destinationEntityRef}
                  // isDisabled={values.sourceAccount === null}
                  placeholder={t("components:Select.Select")}
                  value={values.destinationEntity}
                  options={destinationEntitiesDropdown}
                  onChange={(selectedEntity) => {
                    destinationEntityChange(selectedEntity);
                  }}
                />
              </InlineFormField>

              <InlineFormField label={t("Internal Transfer.Destination Account")}>
                <Select
                  {...baseSelectProps}
                  ref={destinationAccountRef}
                  components={{ Option: ReactSelectCurrencyOption }}
                  // isDisabled={values.sourceAccount === null}
                  placeholder={t("components:Select.Select")}
                  value={values.destinationAccount}
                  options={destinationAccountsDropdown}
                  onChange={(selectedAccount) => {
                    destinationAccountChange(selectedAccount);
                  }}
                />
              </InlineFormField>

              <InlineFormField label="Destination Account Balance">
                <TextFieldMui
                  disabled
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={values.destinationAccount?.value?.accountBalance}
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
                          {showSelectedCurrency()}
                        </span>
                      </InputAdornment>
                    ),
                  }}
                />
              </InlineFormField>

              <InlineFormField label={t("Internal Transfer.Transfer Amount")}>
                <Field
                  fullWidth
                  component={TextField}
                  name="transferAmount"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    inputComponent: CustomNumberInputField,
                    endAdornment: (
                      <InputAdornment position="end">{showSelectedCurrency()}</InputAdornment>
                    ),
                  }}
                />
              </InlineFormField>

              <InlineFormField label={t("Internal Transfer.Description")}>
                <Field
                  fullWidth
                  multiline
                  rows={4}
                  component={TextField}
                  name="description"
                  variant="outlined"
                />
              </InlineFormField>

              <Grid container item justifyContent="center">
                {errorWaringMsg[`${validateSourceAccountTransfer()}`] && (
                  <Typography
                    color="error"
                    variant="body2"
                    style={{
                      fontWeight: "Bold",
                    }}
                  >
                    {errorWaringMsg[`${validateSourceAccountTransfer()}`]}
                  </Typography>
                )}
              </Grid>
              <Grid item container spacing={2} justifyContent="flex-end">
                <Grid item>
                  <Button color="primary" variant="outlined" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    disabled={
                      isSubmitting ||
                      values.sourceEntity === undefined ||
                      values.sourceAccount === null ||
                      values.destinationAccount === null ||
                      values.transferAmount === 0 ||
                      !values.transferAmount ||
                      errorWaringMsg[`${validateSourceAccountTransfer()}`]
                    }
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddInternalTransferForm;
