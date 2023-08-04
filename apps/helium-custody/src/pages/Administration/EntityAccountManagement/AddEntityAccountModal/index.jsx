import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "@emrgo-frontend/shared-ui";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import cx from "classnames";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import PropTypes from "prop-types";

import AutoSaveFields from "../../../../components/AutoSaveFields";
import Checkbox from "../../../../components/Checkbox";
import { useTheme } from "../../../../context/theme-context";
import * as formActionCreators from "../../../../redux/actionCreators/form";
import * as selectFormValues from "../../../../redux/selectors/form";
// import { addAccountSchema } from '../../validationSchemas';
import style from "./style.module.scss";

const initial = {
  entityGroupId: "",
  currencyId: "",
  iban: "",
  isVirtualIBAN: false,
  accountTypeId: "",
  externalAccountNumber: "",
};

const AddEntityAccountModal = ({ isModalOpen, setIsModalOpen, onSubmit, options }) => {
  const dispatch = useDispatch();
  const formvalues = useSelector(selectFormValues.selectFormValues);
  const fetchingValues = useSelector(selectFormValues.formValuesFetching);
  const [initialValues, setInitialValues] = useState(initial);
  const { t } = useTranslation(["administration"]);
  const { theme } = useTheme();
  const { locale } = theme;

  const { currency, bankAccountTypes, entities } = options;
  const handleClose = () => {
    setIsModalOpen(false);
  };
  const filteredCurrency = currency.map((value) => ({
    value,
    label: locale.code === "en-GB" ? value.name : value.nameAr,
  }));
  const filteredAccountTypes = bankAccountTypes?.map((value) => ({
    value,
    label: locale.code === "en-GB" ? value.name : value.nameAr,
  }));
  //    "entityGroupId": "d2626646-4f8e-4809-a321-d1cb6c941fd2",
  //   "currencyId": "bed54716-6ae3-4eac-a9c1-0037ee6d997c",
  //   "iban": "AE420335897749757834672",
  //   "isVirtualIBAN": false,
  //   "accountTypeId": "7087b747-b6da-416d-a5ea-8ced45eefe02"

  useEffect(() => {
    const data = formvalues?.settings[0];
    if (
      !fetchingValues &&
      data?.value &&
      data?.value !== "null" &&
      data?.key === "AddEntityAccountModalForm"
    ) {
      setInitialValues(JSON.parse(data.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formvalues, fetchingValues]);

  const saveFormValues = (value) => {
    const obj = {
      settings: [
        {
          key: "AddEntityAccountModalForm",
          value: JSON.stringify(value),
        },
      ],
    };
    dispatch(formActionCreators.doPostFormRequested(obj));
  };

  useEffect(() => {
    if (isModalOpen) {
      const fetchFormValues = (payload) => dispatch(formActionCreators.doFetchForm(payload));
      fetchFormValues({ keys: ["AddEntityAccountModalForm"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validateOnMount={false}
      onSubmit={(values, { resetForm }) => {
        onSubmit(
          {
            ...values,
            accountTypeId: values.accountTypeId.value.id,
            currencyId: values.currencyId.value.id,
            entityGroupId: values.entityGroupId.id,
            externalAccountNumber: values.externalAccountNumber,
            isVirtualIBAN: values.isVirtualIBAN === true,
          },
          () => {
            saveFormValues(null);
            resetForm();
            setIsModalOpen(false);
          }
        );
      }}
    >
      {({ handleSubmit, values, setFieldValue, resetForm }) => (
        <form onSubmit={handleSubmit} className={cx(style.formWrapper)} noValidate>
          <AutoSaveFields formKey="AddEntityAccountModalForm" initial={initial} />
          <Dialog
            open={isModalOpen}
            onClose={(event, reason) => {
              if (reason && reason === "backdropClick") return;

              handleClose();
            }}
            aria-labelledby="send-onboarding-invitation"
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle id="form-dialog-title">
              {t("EntityAccountManagement.Add Account")}
            </DialogTitle>
            <DialogContent>
              <Box mb={2}>
                <Box my={1} className="w-full">
                  <FormControl className={style.input__form_control}>
                    <Select
                      closeMenuOnSelect
                      placeholder={`${t("EntityAccountManagement.Entity Name")}`}
                      // isDisabled={filteredCountry.length===0}
                      isSearchable
                      styles={{
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
                      }}
                      menuPortalTarget={document.body}
                      value={values.entityGroupId}
                      options={entities}
                      onChange={(entityGroupId) => {
                        setFieldValue("entityGroupId", entityGroupId, false);
                      }}
                    />
                  </FormControl>
                </Box>
                <Box my={1} className="w-full">
                  <FormControl className={style.input__form_control}>
                    <Select
                      closeMenuOnSelect
                      placeholder={`${t("EntityAccountManagement.Account Type")}`}
                      // isDisabled={filteredCountry.length===0}
                      isSearchable
                      styles={{
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
                      }}
                      menuPortalTarget={document.body}
                      value={values.accountTypeId}
                      options={filteredAccountTypes}
                      onChange={(accountTypeId) => {
                        setFieldValue("accountTypeId", accountTypeId, false);
                      }}
                    />
                  </FormControl>
                </Box>
                <Box my={1} className="w-full">
                  <FormControl className={style.input__form_control}>
                    <Select
                      closeMenuOnSelect
                      placeholder={`${t("EntityAccountManagement.Currency")}`}
                      // isDisabled={filteredCountry.length===0}
                      isSearchable
                      styles={{
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
                      }}
                      menuPortalTarget={document.body}
                      value={values.currencyId}
                      options={filteredCurrency}
                      onChange={(currencyId) => {
                        setFieldValue("currencyId", currencyId, false);
                      }}
                    />
                  </FormControl>
                </Box>
                <Box my={1} className="w-full">
                  <Field
                    component={TextField}
                    label={t("EntityAccountManagement.IBAN Number")}
                    name="iban"
                    variant="filled"
                    fullWidth
                  />
                </Box>
                <Box my={1} className="w-full">
                  <Field
                    component={TextField}
                    label={t("EntityAccountManagement.External Account Number")}
                    name="externalAccountNumber"
                    variant="filled"
                    fullWidth
                  />
                </Box>
                <Box my={1} className="w-full">
                  <FormControl className={style.input__form_control}>
                    <Checkbox
                      name="isVirtualIBAN"
                      label={t("EntityAccountManagement.Virtual IBAN")}
                    />
                  </FormControl>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  saveFormValues(null);
                  setInitialValues(initial);
                  handleClose();
                  resetForm();
                }}
                color="primary"
              >
                {t("EntityAccountManagement.Cancel")}
              </Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {t("EntityAccountManagement.Submit")}
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      )}
    </Formik>
  );
};

AddEntityAccountModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddEntityAccountModal;
