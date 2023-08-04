import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "@emrgo-frontend/shared-ui";

import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import PropTypes from "prop-types";

import Button from "../../../../../components/Button";
// import DropdownSelect from '../../../../../components/DropdownSelect';
import FileUploadField from "../../../../../components/FileUploadField";
import Required from "../../../../../components/Required";
import DEFAULT_ACCEPTABLE_FILE_TYPES from "../../../../../constants/documents/kyc";
// import { addAccountFormSchema } from '../../../../../validationSchemas';
import { useTheme } from "../../../../../context/theme-context";
// import InputField from '../../../../../components/InputField';
// import TextArea from '../../../../../components/TextArea';
import useWethaqAPIParams from "../../../../../hooks/useWethaqAPIParams";
import * as issuanceActionCreators from "../../../../../redux/actionCreators/issuance";
import * as kycActionCreators from "../../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../../../redux/selectors/entities";
import * as issuanceSelectors from "../../../../../redux/selectors/issuance";
import * as kycSelectors from "../../../../../redux/selectors/kyc";
import selectStyles from "../../../../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../../../../utils/form";
import { kycSchema } from "../../../../../validationSchemas";
import style from "./style.module.scss";

const AddPaymentAccountForm = ({ initialValues, handleSubmit, disableSelectCurrencyField }) => {
  const formOptions = useSelector(issuanceSelectors.selectDropDowns);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { locale } = theme;
  const { t } = useTranslation(["cash_management"]);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isSubmitting = useSelector(kycSelectors.selectIsSubmitting);
  const uploadStatus = useSelector(kycSelectors.selectUploadStatus);

  const entitiesList = useSelector(entitiesSelectors.selectEntities);

  const currentEntityGroupID = currentEntityGroup?.id;
  const currentEntityGroupEntityType = currentEntityGroup?.entityType;
  const isWethaqUser = currentEntityGroupEntityType === "EMRGO_SERVICES";

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchFormOptions = (payload) =>
      dispatch(issuanceActionCreators.doFetchFormOptions(payload));

    fetchFormOptions({
      options: ["country"],
    });
    fetchFormOptions({
      options: ["currency"],
    });
  }, [dispatch]);

  const handleSingleFileUpload = ({ files, name }) => {
    const doUploadFile = (payload) =>
      dispatch(kycActionCreators.doUploadSupportingDocumentForPaymentAccount(payload));

    const payload = {
      requestPayload: {
        originalFileName: files[0]?.name,
        name,
        fileName: files[0]?.name,
        type: "accountSupporting",
      },
      file: files[0],
      keyName: name,
    };

    doUploadFile(payload);
  };

  const entitiesDropdown = isWethaqUser
    ? entitiesList.map((entity) => ({
        value: entity.id,
        label: entity.corporateEntityName,
        groups: entity.groups,
      }))
    : null;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={kycSchema.paymentAccountSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => {
        const isUSDCurrencySelected = values?.currency?.label === "USD";
        const isGBPCurrencySelected = values?.currency?.label === "GBP";
        const isINRCurrencySelected = values?.currency?.label === "INR";
        const isAUDCurrencySelected = values?.currency?.label === "AUD";
        const isNZDCurrencySelected = values?.currency?.label === "NZD";

        return (
          <Form noValidate>
            <Grid container spacing={2}>
              {isWethaqUser && (
                <Grid item container xs={12} md={12} lg={12}>
                  <Grid item xs={4} container direction="column" justifyContent="center">
                    <Typography>
                      {t("PaymentAccountManagement.AddPaymentAccountForm.Entity")}
                      <Required />
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl className={style.input__form_control}>
                      <Select
                        closeMenuOnSelect
                        placeholder={t("components:Select.Select")}
                        isSearchable
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        value={values.sourceEntity}
                        isClearable
                        options={entitiesDropdown}
                        onChange={(selectedEntity) => {
                          setFieldValue("entityGroupId", selectedEntity.groups[0].id);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              )}

              <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justifyContent="center">
                  <Typography>
                    {t("PaymentAccountManagement.AddPaymentAccountForm.Currency")}
                    <Required />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <FormControl className={style.input__form_control}>
                    <Select
                      closeMenuOnSelect
                      placeholder={t("components:Select.Select")}
                      isSearchable
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                      value={values.sourceEntity}
                      isDisabled={disableSelectCurrencyField}
                      isClearable
                      options={getDropdownValues(formOptions?.currency, locale)}
                      onChange={(selectedCurrency) => {
                        setFieldValue("currency", selectedCurrency);
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

              <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justifyContent="center">
                  <Typography>
                    {t("PaymentAccountManagement.AddPaymentAccountForm.Full Name")}
                    <Required />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Field fullWidth component={TextField} name="name" variant="filled" type="text" />
                </Grid>
              </Grid>

              <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justifyContent="center">
                  <Typography>
                    {t("PaymentAccountManagement.AddPaymentAccountForm.Label")}
                    <Required />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Field
                    fullWidth
                    component={TextField}
                    name="label"
                    variant="filled"
                    type="text"
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justifyContent="center">
                  <Typography>
                    {t("PaymentAccountManagement.AddPaymentAccountForm.Bank Name")}
                    <Required />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Field
                    fullWidth
                    component={TextField}
                    name="bankName"
                    variant="filled"
                    type="text"
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justifyContent="center">
                  <Typography>
                    {t("PaymentAccountManagement.AddPaymentAccountForm.IBAN")}
                    <Required />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Field fullWidth component={TextField} name="iban" variant="filled" type="text" />
                </Grid>
              </Grid>

              <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justifyContent="center">
                  <Typography>
                    {t("PaymentAccountManagement.AddPaymentAccountForm.SWIFT/BIC")}
                    <Required />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Field
                    fullWidth
                    component={TextField}
                    name="swift"
                    variant="filled"
                    type="text"
                  />
                </Grid>
              </Grid>

              {isUSDCurrencySelected || isGBPCurrencySelected ? (
                <Grid item container xs={12} md={12} lg={12}>
                  <Grid item xs={4} container direction="column" justifyContent="center">
                    <Typography>
                      {t("PaymentAccountManagement.AddPaymentAccountForm.Account Number")}
                      <Required />
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      fullWidth
                      component={TextField}
                      name="accountNo"
                      variant="filled"
                      type="text"
                    />
                  </Grid>
                </Grid>
              ) : null}

              {isUSDCurrencySelected ? (
                <Grid item container xs={12} md={12} lg={12}>
                  <Grid item xs={4} container direction="column" justifyContent="center">
                    <Typography>
                      {t("PaymentAccountManagement.AddPaymentAccountForm.Routing Number")}
                      <Required />
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      fullWidth
                      component={TextField}
                      name="routingNo"
                      variant="filled"
                      type="text"
                    />
                  </Grid>
                </Grid>
              ) : null}

              {isGBPCurrencySelected ? (
                <Grid item container xs={12} md={12} lg={12}>
                  <Grid item xs={4} container direction="column" justifyContent="center">
                    <Typography>
                      {t("PaymentAccountManagement.AddPaymentAccountForm.Sort Code")}
                      <Required />
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      fullWidth
                      component={TextField}
                      name="sortCode"
                      variant="filled"
                      type="text"
                    />
                  </Grid>
                </Grid>
              ) : null}

              {isINRCurrencySelected ? (
                <Grid item container xs={12} md={12} lg={12}>
                  <Grid item xs={4} container direction="column" justifyContent="center">
                    <Typography>
                      {t("PaymentAccountManagement.AddPaymentAccountForm.IFSC Code")}
                      <Required />
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      fullWidth
                      component={TextField}
                      name="ifscCode"
                      variant="filled"
                      type="text"
                    />
                  </Grid>
                </Grid>
              ) : null}

              {isAUDCurrencySelected || isNZDCurrencySelected ? (
                <Grid item container xs={12} md={12} lg={12}>
                  <Grid item xs={4} container direction="column" justifyContent="center">
                    <Typography>
                      {t("PaymentAccountManagement.AddPaymentAccountForm.BSB Code")}
                      <Required />
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      fullWidth
                      component={TextField}
                      name="bsbCode"
                      variant="filled"
                      type="text"
                    />
                  </Grid>
                </Grid>
              ) : null}

              <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justifyContent="center">
                  <Typography>
                    {t("PaymentAccountManagement.AddPaymentAccountForm.Address")}
                    <Required />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Field
                    fullWidth
                    multiline
                    rows={5}
                    component={TextField}
                    name="address"
                    variant="filled"
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justifyContent="center">
                  <Typography>
                    {t("PaymentAccountManagement.AddPaymentAccountForm.Country")}
                    <Required />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <FormControl className={style.input__form_control}>
                    <Select
                      closeMenuOnSelect
                      placeholder={t("components:Select.Select")}
                      isSearchable
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                      value={values.country}
                      isClearable
                      options={getDropdownValues(formOptions?.country, locale)}
                      onChange={(selectedCountry) => {
                        setFieldValue("country", selectedCountry);
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

              <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justifyContent="center">
                  <Typography>
                    {t("PaymentAccountManagement.AddPaymentAccountForm.City")}
                    <Required />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Field fullWidth component={TextField} name="city" variant="filled" type="text" />
                </Grid>
              </Grid>

              <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justifyContent="center">
                  <Typography>
                    {t("PaymentAccountManagement.AddPaymentAccountForm.Post Code")}
                    <Required />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Field
                    fullWidth
                    component={TextField}
                    name="postcode"
                    variant="filled"
                    type="text"
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justifyContent="center">
                  <Typography>
                    {t("PaymentAccountManagement.AddPaymentAccountForm.Supporting Document")}
                    <Required />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <FileUploadField
                    name="supportingDoc"
                    acceptableFileTypes={DEFAULT_ACCEPTABLE_FILE_TYPES.join(",")}
                    isLoading={uploadStatus?.supportingDoc}
                    fullWidth
                    customHandleChange={(e) =>
                      handleSingleFileUpload({ files: e, name: "supportingDoc" })
                    }
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12} md={12} lg={12} justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  data-testid="submit"
                  disabled={isSubmitting || uploadStatus?.supportingDoc}
                >
                  {t("PaymentAccountManagement.AddPaymentAccountForm.SubmitButtonText")}
                </Button>
              </Grid>
            </Grid>

            {/* {isUSDCurrencySelected || isGBPCurrencySelected ? <InputField name="accountNo" label={t('PaymentAccountManagement.AddPaymentAccountForm.Account Number')} /> : null}
            {isUSDCurrencySelected ? <InputField name="routingNo" label={t('PaymentAccountManagement.AddPaymentAccountForm.Routing Number')} /> : null}
            {isGBPCurrencySelected ? <InputField name="sortCode" label={t('PaymentAccountManagement.AddPaymentAccountForm.Sort Code')} /> : null}
            {isINRCurrencySelected ? <InputField name="ifscCode" label={t('PaymentAccountManagement.AddPaymentAccountForm.IFSC Code')} /> : null}
            {isAUDCurrencySelected || isNZDCurrencySelected ? <InputField name="bsbCode" label={t('PaymentAccountManagement.AddPaymentAccountForm.BSB Code')} /> : null}
            <TextArea name="address" label={t('PaymentAccountManagement.AddPaymentAccountForm.Address')} rows={5} />
            <InputField name="city" label={t('PaymentAccountManagement.AddPaymentAccountForm.City')} />
            <DropdownSelect name="country" label={t('PaymentAccountManagement.AddPaymentAccountForm.Country')} options={getDropdownValues(formOptions?.country, locale)} fullWidth />
            <InputField name="postcode" label={t('PaymentAccountManagement.AddPaymentAccountForm.Post Code')} /> */}
            {/* <FileUploadField
                name="supportingDoc"
                label={t('PaymentAccountManagement.AddPaymentAccountForm.Supporting Document')}
                isLoading={uploadStatus?.supportingDoc}
                customHandleChange={(e) => handleSingleFileUpload({ files: e, name: 'supportingDoc' })}
              />
              <Button type="submit" variant="contained" size="large" data-testid="submit" disabled={isSubmitting || uploadStatus?.supportingDoc}>
                {t('PaymentAccountManagement.AddPaymentAccountForm.SubmitButtonText')}
              </Button> */}
          </Form>
        );
      }}
    </Formik>
  );
};

AddPaymentAccountForm.propTypes = {
  initialValues: PropTypes.exact({
    currency: PropTypes.shape({
      label: PropTypes.string,
      option: PropTypes.string,
    }),
    label: PropTypes.string,
    name: PropTypes.string,
    iban: PropTypes.string,
    swift: PropTypes.string,
    accountNo: PropTypes.string,
    routingNo: PropTypes.string,
    sortCode: PropTypes.string,
    ifscCode: PropTypes.string,
    bsbCode: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.shape({
      label: PropTypes.string,
      option: PropTypes.string,
    }),
    postcode: PropTypes.string,
    supportingDoc: PropTypes.string,
  }),
  handleSubmit: PropTypes.func.isRequired,
  disableSelectCurrencyField: PropTypes.bool,
};

AddPaymentAccountForm.defaultProps = {
  initialValues: {
    currency: null,
    label: "",
    name: "",
    bankName: "",
    iban: "",
    swift: "",
    accountNo: undefined,
    routingNo: undefined,
    sortCode: undefined,
    ifscCode: undefined,
    bsbCode: undefined,
    address: "",
    city: "",
    country: null,
    postcode: "",
  },
  disableSelectCurrencyField: false,
};

export default AddPaymentAccountForm;
