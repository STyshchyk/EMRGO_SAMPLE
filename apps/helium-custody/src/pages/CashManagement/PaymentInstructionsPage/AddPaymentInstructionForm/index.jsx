import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import { MySelect as Select } from "@emrgo-frontend/shared-ui";
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
import { addExternalPaymentSchema } from "../../../../validationSchemas";
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
  const [selectedCurrencyName, setSelectedCurrencyName] = useState(
    initialValues.paymentAccount?.value?.currency ?? ""
  );

  const [filteredSourceAccountOptions, setFilteredSourceAccountOptions] = useState(
    allSourceAccountOptions.filter((i) => initialValues.sourceEntity?.value === i.value.entityId)
  );
  const [filteredPaymentAccountOptions, setFilteredPaymentAccountOptions] = useState(
    isWethaqUser
      ? allPaymentAccountOptions.filter(
          (i) => initialValues.sourceEntity?.value === i.value.entityId
        )
      : allPaymentAccountOptions
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={addExternalPaymentSchema}
    >
      {({ values, setFieldValue, resetForm }) => {
        return (
          <Form className={cx(style.formWrapper)}>
            {initial && (
              <AutoSaveFields formKey="AddPaymentInstructionDialogForm" initial={initial} />
            )}
            <Box mb={2}>
              {isWethaqUser && (
                <Fragment>
                  <Box my={1} className="w-full">
                    <Select
                      name="sourceEntity"
                      closeMenuOnSelect
                      placeholder={t(
                        "Payment Instructions.Modals.Placeholders.Select Source Entity"
                      )}
                      isSearchable
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                      value={values.sourceEntity}
                      isClearable
                      options={sourceEntityOptions}
                      onChange={(selectedOption, triggeredAction) => {
                        if (triggeredAction.action === "clear") {
                          setFilteredSourceAccountOptions([]);
                          setFieldValue("sourceEntity", null);
                        }

                        if (triggeredAction.action === "select-option") {
                          setFieldValue("sourceEntity", selectedOption);
                          setFilteredSourceAccountOptions(
                            allSourceAccountOptions.filter(
                              (i) => i.value.entityId === selectedOption.value
                            )
                          );
                          // id-1018
                          setFilteredPaymentAccountOptions(
                            allPaymentAccountOptions.filter(
                              (i) => i.value.entityId === selectedOption.value
                            )
                          );
                        }
                        setFieldValue("sourceAccount", null);
                      }}
                    />
                    <ErrorMessage
                      component={Typography}
                      variant="caption"
                      color="error"
                      className="ml-4"
                      name="sourceEntity"
                    />
                  </Box>
                  <Box my={1} className="w-full">
                    <Select
                      name="sourceAccount"
                      placeholder={t(
                        "Payment Instructions.Modals.Placeholders.Select Source Account"
                      )}
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
                        }
                      }}
                    />
                  </Box>
                  <ErrorMessage
                    component={Typography}
                    variant="caption"
                    color="error"
                    className="ml-4"
                    name="sourceAccount"
                  />
                </Fragment>
              )}

              <Box my={1} className="w-full">
                <Select
                  name="paymentAccount"
                  components={{ Option: ReactSelectCurrencyOption }}
                  closeMenuOnSelect
                  placeholder={t("Payment Instructions.Modals.Fields.Payment Account")}
                  isSearchable
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  value={values.paymentAccount}
                  isClearable
                  options={filteredPaymentAccountOptions}
                  onChange={(selectedOption, triggeredAction) => {
                    if (triggeredAction.action === "clear") {
                      setSelectedCurrencyName("");
                      setFieldValue("paymentAccount", null);
                    }

                    if (triggeredAction.action === "select-option") {
                      setFieldValue("paymentAccount", selectedOption);
                      setSelectedCurrencyName(selectedOption?.value?.currency);
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
                {/* <Datepicker
                  minDate={Date()}
                  label={t("Payment Instructions.Modals.Fields.Value Date")}
                  name="valueDate"
                  materialLabel
                  fullWidth
                /> */}
                <Grid item xs={12}>
                  <Field
                    fullWidth
                    component={(props) => (
                      <DatePicker
                        {...props}
                        inputProps={{
                          shrink: "false",
                          size: "small",
                        }}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            variant: "filled",
                          },
                        }}
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
                    size={"small"}
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
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    {t("Entity Accounts.Submit")}
                  </Button>
                </Grid>
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddPaymentInstructionForm;
