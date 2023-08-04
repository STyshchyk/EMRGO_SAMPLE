import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "@emrgo-frontend/shared-ui";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import cx from "classnames";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";

import AutoSaveFields from "../../../../components/AutoSaveFields";
import Datepicker from "../../../../components/Datepicker";
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
          (i) => initialValues.beneficiaryEntityGroupUser?.value?.id === i.value.userId
        )
      : allPaymentAccountOptions
  );

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ values, setFieldValue, resetForm }) => (
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
                    placeholder={t("Payment Instructions.Modals.Placeholders.Select Source Entity")}
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
                      }
                      setFieldValue("sourceAccount", null);
                    }}
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
                <Box my={1} className="w-full">
                  <Select
                    name="beneficiaryEntityGroupUser"
                    closeMenuOnSelect
                    placeholder={t(
                      "Payment Instructions.Modals.Placeholders.Select Beneficiary User"
                    )}
                    isSearchable
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    value={values.beneficiaryEntityGroupUser}
                    isClearable
                    options={beneficiaryUserOptions}
                    onChange={(selectedOption, triggeredAction) => {
                      if (triggeredAction.action === "clear") {
                        setFilteredPaymentAccountOptions([]);
                        setFieldValue("beneficiaryEntityGroupUser", null);
                        setSelectedCurrencyName("");
                      }

                      if (triggeredAction.action === "select-option") {
                        setFieldValue("beneficiaryEntityGroupUser", selectedOption);

                        setFilteredPaymentAccountOptions(
                          allPaymentAccountOptions.filter(
                            (i) => selectedOption?.value?.id === i.value.userId
                          )
                        );
                      }

                      setFieldValue("paymentAccount", null);
                    }}
                  />
                </Box>
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
            </Box>
            <Box my={1} className="w-full">
              <Datepicker
                minDate={Date()}
                label={t("Payment Instructions.Modals.Fields.Value Date")}
                name="valueDate"
                materialLabel
                fullWidth
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">{selectedCurrencyName}</InputAdornment>
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
                <Button type="submit" variant="contained" color="primary">
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
