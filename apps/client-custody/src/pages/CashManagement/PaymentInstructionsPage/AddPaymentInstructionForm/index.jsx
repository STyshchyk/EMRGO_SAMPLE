import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Select } from "@emrgo-frontend/shared-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
// import Datepicker from "../../../../components/Datepicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import cx from "classnames";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import moment from "moment";

import AutoSaveFields from "../../../../components/AutoSaveFields";
import ReactSelectCurrencyOption from "../../../../components/ReactSelectCurrencyOption";
import selectStyles from "../../../../styles/cssInJs/reactSelect";
import style from "./style.module.scss";

const AddPaymentInstructionForm = ({
  initialValues,
  handleSubmit,
  handleCancel,
  isWethaqUser,
  options,
  initial,
  isSubmitting,
}) => {
  const { t } = useTranslation(["cash_management", "components"]);

  const {
    allSourceAccountOptions,
    allPaymentAccountOptions,
    sourceEntityOptions,
    beneficiaryUserOptions,
    paymentTransferPurposeOptions,
  } = options;
  // local states

  const [filteredSourceAccountOptions, setFilteredSourceAccountOptions] =
    useState(allSourceAccountOptions);
  const [filteredPaymentAccountOptions, setFilteredPaymentAccountOptions] =
    useState(allPaymentAccountOptions);

  return (
    <Formik
      initialValues={{
        ...initialValues,
      }}
      onSubmit={handleSubmit}
      // validationSchema={addExternalPaymentSchema}
      enableReinitialize
    >
      {({ values, setFieldValue, resetForm }) => (
        <Form className={cx(style.formWrapper)}>
          {initial && (
            <AutoSaveFields formKey="AddPaymentInstructionDialogForm" initial={initial} />
          )}
          <Box mb={2}>
            <Box my={1} className="w-full">
              <Select
                name="sourceAccount"
                placeholder={t("Payment Instructions.Modals.Placeholders.Source Account")}
                components={{ Option: ReactSelectCurrencyOption }}
                closeMenuOnSelect
                isSearchable
                styles={selectStyles}
                menuPortalTarget={document.body}
                value={values.sourceAccount}
                isClearable
                options={filteredSourceAccountOptions}
                onChange={(selectedOption, triggeredAction) => {
                  if (triggeredAction.action === "clear") {
                    setFieldValue("sourceAccount", null);
                  }
                  if (triggeredAction.action === "select-option") {
                    const modifiedOption = {
                      ...selectedOption,
                      label: selectedOption.customLabel,
                    };
                    setFieldValue("sourceAccount", modifiedOption);

                    setFieldValue("paymentAccount", null);

                    setFilteredPaymentAccountOptions(
                      allPaymentAccountOptions.filter(
                        (i) => i.value.currency === selectedOption.value.currency
                      )
                    );
                  }
                }}
              />
              <ErrorMessage
                component={Typography}
                variant="caption"
                color="error"
                className="ml-4"
                name="sourceAccount"
              />
            </Box>

            <Box my={1} className="w-full">
              <Select
                name="paymentAccount"
                components={{ Option: ReactSelectCurrencyOption }}
                closeMenuOnSelect
                placeholder={t("Payment Instructions.Modals.Fields.Payment Account")}
                isSearchable
                styles={selectStyles}
                value={values.paymentAccount}
                isClearable
                options={filteredPaymentAccountOptions}
                onChange={(selectedOption, triggeredAction) => {
                  if (triggeredAction.action === "clear") {
                    setFieldValue("paymentAccount", null);
                  }

                  if (triggeredAction.action === "select-option") {
                    setFieldValue("paymentAccount", selectedOption);
                  }
                }}
              />
              <ErrorMessage
                component={Typography}
                variant="caption"
                color="error"
                className="ml-4"
                name="paymentAccount"
              />
            </Box>
            <Box my={1} className="w-full">
              <Grid item xs={12}>
                <Field
                  fullWidth
                  component={(props) => (
                    <DatePicker
                      {...props}
                      sx={{
                        width: "100%", // Ensure the DatePicker takes full-width
                        ...(props.sx || {}),
                      }}
                    />
                  )}
                  minDate={moment()}
                  onChange={(date) => {
                    setFieldValue("valueDate", date);
                  }}
                  value={values.valueDate ? moment(values.valueDate) : null}
                  format={"DD/MM/YYYY"}
                  inputVariant="filled"
                  label={t("Payment Instructions.Modals.Fields.Value Date")}
                  name="valueDate"
                  validateOnChange
                  validate={(date) => {
                    if (!date) {
                      return "Please select a date";
                    }
                  }}
                />
              </Grid>

              <ErrorMessage
                component={Typography}
                variant="caption"
                color="error"
                className="ml-4"
                name="valueDate"
              />
            </Box>
            <Box my={1} className="w-full">
              <Grid item xs={12}>
                <Field
                  fullWidth
                  component={TextField}
                  label={t("Payment Instructions.Modals.Fields.Payment Amount")}
                  name="paymentAmount"
                  variant="filled"
                  type="number"
                  min="0"
                  onChange={(event) => {
                    const regexTwoDecimal = /^[0-9]*(\.[0-9]{0,2})?$/;
                    if (regexTwoDecimal.test(event.target.value)) {
                      setFieldValue("paymentAmount", event.target.value);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography color="primary" variant="subtitle2">
                          {values.paymentAccount?.value?.currency}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  // eslint-disable-next-line  react/jsx-no-duplicate-props
                  inputProps={{
                    min: 0,
                  }}
                />
              </Grid>
            </Box>
            <Box my={1} className="w-full">
              <Field
                fullWidth
                multiline
                rows={4}
                onKeyDown={(event) => {
                  if (event.which === 13)
                    setFieldValue("paymentDetails", event.target.value + "\n");
                }}
                component={TextField}
                label={t("Payment Instructions.Modals.Fields.Payment Details")}
                name="paymentDetails"
                variant="filled"
              />
            </Box>
            <Box my={1} className="w-full">
              <Select
                name="transferPurpose"
                closeMenuOnSelect
                placeholder={t("Payment Instructions.Modals.Placeholders.Transfer Purpose")}
                isSearchable
                styles={selectStyles}
                menuPortalTarget={document.body}
                value={values.transferPurpose}
                isClearable
                options={paymentTransferPurposeOptions}
                onChange={(selectedOption) => {
                  setFieldValue("transferPurpose", selectedOption);
                }}
              />
              <ErrorMessage
                component={Typography}
                variant="caption"
                color="error"
                className="ml-4"
                name="transferPurpose"
              />
            </Box>

            <Box my={2} className="w-full">
              <Grid container xs={12} justifyContent="flex-end">
                <Button
                  onClick={() => {
                    resetForm();
                    handleCancel();
                  }}
                  color="primary"
                >
                  {t("Entity Accounts.Cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!values?.valueDate || isSubmitting}
                >
                  {t("Entity Accounts.Submit")}
                </Button>
              </Grid>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddPaymentInstructionForm;
