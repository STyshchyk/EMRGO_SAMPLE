import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Select } from "@emrgo-frontend/shared-ui";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";

// import * as accountsSelectors from '../../../../redux/selectors/accounts';
// import * as accountsActionCreators from '../../../../redux/actionCreators/accounts';
import Button from "../../../../components/Button";
import { useTheme } from "../../../../context/theme-context";
import normalisedCountries from "../../../../helpers/countries";
// import DropdownSelect from '../../../../components/DropdownSelect';
// import FileUploadField from '../../../../components/FileUploadField';
// import InputField from '../../../../components/InputField';
// import TextArea from '../../../../components/TextArea';
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import selectStyles from "../../../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../../../utils/form";
import { addPaymentAccountFormSchema } from "../../../../validationSchemas";

// TODO: SORT OUT THE VALIDATION SCHEMA AND DRY UP THIS MESS

const InlineFormField = ({ label, children, name }) => (
  <Grid item container md={12}>
    {label && (
      <Grid item md={4}>
        <Typography>{label}</Typography>
      </Grid>
    )}
    <Grid item md={8}>
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

const AddPaymentAccountForm = ({
  initialValues = {
    sourceEntity: null,
    accountNo: "",
    address: "",
    bankName: "",
    city: "",
    country: null,
    currency: null,
    hasIntermediaryBank: false,
    iban: "",
    intermediaryBankAccountNo: undefined,
    intermediaryBankAddress: undefined,
    intermediaryBankBIC: undefined,
    intermediaryBankCity: undefined,
    intermediaryBankCountry: null,
    intermediaryBankIBAN: undefined,
    intermediaryBankName: undefined,
    intermediaryBankPostCode: undefined,
    intermediaryBankRouteCode: undefined,
    intermediaryBankSortCode: undefined,
    intermediaryBankIfscCode: undefined,
    intermediaryBankBsbCode: undefined,
    label: "",
    name: "",
    postcode: "",
    swift: "",
    routingNo: null,
    sortCode: null,
  },
  handleSubmit,
  entitiesList,
  handleCloseDialog,
  disableSelectCurrencyField,
}) => {
  const formOptions = useSelector(issuanceSelectors.selectDropDowns);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { locale } = theme;
  const { t } = useTranslation(["cash_management"]);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);

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

  // const handleSingleFileUpload = ({ files, name }) => {
  //   const doUploadFile = (payload) => dispatch(accountsActionCreators.doUploadSupportingDocumentForPaymentAccount(payload));
  //
  //   const payload = {
  //     requestPayload: {
  //       originalFileName: files[0]?.name,
  //       name,
  //       fileName: files[0]?.name,
  //       type: 'accountSupporting',
  //     },
  //     file: files[0],
  //     keyName: name,
  //   };
  //
  //   doUploadFile(payload);
  // };

  const entitiesDropdown = isWethaqUser
    ? entitiesList.map((entity) => ({
        value: entity.id,
        label: entity.corporateEntityName,
        groups: entity.groupId,
      }))
    : null;

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={addPaymentAccountFormSchema}
      enableReinitialize
    >
      {({ values, setFieldValue, errors }) => {
        const isUSDCurrencySelected = values.currency?.label === "USD";
        const isGBPCurrencySelected = values.currency?.label === "GBP";

        const isUSDCountrySelected = values.country?.label === "United States of America";
        const isGBPCountrySelected =
          values.country?.label === "United Kingdom of Great Britain and Northern Ireland";
        const isINRCountrySelected = values.country?.label === "India";
        const isAUDCountrySelected = values.country?.label === "Australia";
        const isNZDCountrySelected = values.country?.label === "New Zealand";

        const isUSDCountryIntermediarySelected =
          values.intermediaryBankCountry?.label === "United States of America";
        const isINRCountryIntermediarySelected = values.intermediaryBankCountry?.label === "India";
        const isGBPCountryIntermediarySelected =
          values.intermediaryBankCountry?.label ===
          "United Kingdom of Great Britain and Northern Ireland";
        const isAUDCountryIntermediarySelected =
          values.intermediaryBankCountry?.label === "Australia";
        const isNZDCountryIntermediarySelected =
          values.intermediaryBankCountry?.label === "New Zealand";

        return (
          <Form noValidate onKeyDown={onKeyDown}>
            <Grid container spacing={2}>
              <Grid item container spacing={2} lg={6}>
                {isWethaqUser && (
                  <InlineFormField label={"Entity"} name="sourceEntity">
                    <Select
                      closeMenuOnSelect
                      placeholder={t("PaymentAccountManagement.AddPaymentAccountForm.Entity")}
                      isSearchable
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                      value={values.sourceEntity}
                      isClearable
                      options={entitiesDropdown}
                      onChange={(newValue, triggeredAction) => {
                        setFieldValue("sourceEntity", newValue);
                        if (triggeredAction.action === "clear") {
                          setFieldValue("sourceEntity", null);
                        }
                      }}
                    />
                  </InlineFormField>
                )}

                <InlineFormField
                  label={t("PaymentAccountManagement.AddPaymentAccountForm.Currency")}
                  name="currency"
                >
                  <Select
                    closeMenuOnSelect
                    placeholder={t("PaymentAccountManagement.AddPaymentAccountForm.Currency")}
                    isSearchable
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    value={values.currency}
                    isDisabled={disableSelectCurrencyField}
                    isClearable
                    options={getDropdownValues(formOptions?.currency, locale)}
                    onChange={(selectedCurrency) => {
                      setFieldValue("currency", selectedCurrency);
                    }}
                  />
                </InlineFormField>

                <InlineFormField
                  label={t("PaymentAccountManagement.AddPaymentAccountForm.Full Name")}
                >
                  <Field
                    fullWidth
                    component={TextField}
                    size="small"
                    name="name"
                    variant="outlined"
                    type="text"
                  />
                </InlineFormField>

                <InlineFormField label={t("PaymentAccountManagement.AddPaymentAccountForm.Label")}>
                  <Field
                    fullWidth
                    component={TextField}
                    size="small"
                    name="label"
                    variant="outlined"
                    type="text"
                  />
                </InlineFormField>

                <InlineFormField label=" ">
                  <Field
                    as={FormControlLabel}
                    type="checkbox"
                    name="hasIntermediaryBank"
                    control={<Checkbox />}
                    disabled={!isUSDCurrencySelected && !isGBPCurrencySelected} // !Dev note: Enable an ability to add intermediary bank details only if selected currency is either USD or GBP
                    label="Add Intermediary Bank Details"
                  />
                </InlineFormField>
              </Grid>

              <div className="w-full">
                <div
                  className={`${values.hasIntermediaryBank ? "w-1/2" : "w-full"} inline-block p-2`}
                >
                  <Grid container spacing={2}>
                    <InlineFormField label={" "}>
                      <Typography>
                        <strong>Beneficiary Bank Details</strong>
                      </Typography>
                    </InlineFormField>
                    <InlineFormField
                      label={t("PaymentAccountManagement.AddPaymentAccountForm.IBAN")}
                    >
                      <Field
                        fullWidth
                        component={TextField}
                        size="small"
                        name="iban"
                        variant="outlined"
                        type="text"
                      />
                    </InlineFormField>

                    <InlineFormField
                      label={t("PaymentAccountManagement.AddPaymentAccountForm.SWIFT/BIC")}
                    >
                      <Field
                        fullWidth
                        component={TextField}
                        size="small"
                        name="swift"
                        variant="outlined"
                        type="text"
                      />
                    </InlineFormField>

                    <InlineFormField
                      label={t("PaymentAccountManagement.AddPaymentAccountForm.Bank Name")}
                    >
                      <Field
                        fullWidth
                        component={TextField}
                        name="bankName"
                        size="small"
                        variant="outlined"
                        type="text"
                      />
                    </InlineFormField>

                    <InlineFormField
                      label={t("PaymentAccountManagement.AddPaymentAccountForm.Address")}
                    >
                      <Field
                        fullWidth
                        multiline
                        rows={5}
                        component={TextField}
                        name="address"
                        size="small"
                        variant="outlined"
                      />
                    </InlineFormField>

                    <InlineFormField
                      label={t("PaymentAccountManagement.AddPaymentAccountForm.City")}
                    >
                      <Field
                        fullWidth
                        component={TextField}
                        name="city"
                        size="small"
                        variant="outlined"
                        type="text"
                      />
                    </InlineFormField>

                    <InlineFormField
                      label={t("PaymentAccountManagement.AddPaymentAccountForm.Post Code")}
                    >
                      <Field
                        fullWidth
                        component={TextField}
                        name="postcode"
                        size="small"
                        variant="outlined"
                        type="text"
                      />
                    </InlineFormField>

                    <InlineFormField
                      label={t("PaymentAccountManagement.AddPaymentAccountForm.Country")}
                      name="country"
                    >
                      <Select
                        closeMenuOnSelect
                        placeholder={t("components:Select.Select")}
                        isSearchable
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        menuPlacement={"auto"}
                        value={values.country} // !WTF
                        isClearable
                        options={getDropdownValues(
                          normalisedCountries(formOptions?.country),
                          locale
                        )}
                        onChange={(newValue) => {
                          setFieldValue("country", newValue);
                        }}
                      />
                    </InlineFormField>

                    {isUSDCountrySelected || isGBPCountrySelected ? (
                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.Account Number")}
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          name="accountNo"
                          variant="filled"
                          type="text"
                        />
                      </InlineFormField>
                    ) : null}

                    {isUSDCountrySelected ? (
                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.Routing Number")}
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          name="routingNo"
                          variant="filled"
                          type="text"
                        />
                      </InlineFormField>
                    ) : null}

                    {isGBPCountrySelected ? (
                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.Sort Code")}
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          name="sortCode"
                          variant="filled"
                          type="text"
                        />
                      </InlineFormField>
                    ) : null}

                    {isINRCountrySelected ? (
                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.IFSC Code")}
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          name="ifscCode"
                          variant="filled"
                          type="text"
                        />
                      </InlineFormField>
                    ) : null}

                    {isAUDCountrySelected || isNZDCountrySelected ? (
                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.BSB Code")}
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          name="bsbCode"
                          variant="filled"
                          type="text"
                        />
                      </InlineFormField>
                    ) : null}
                  </Grid>
                </div>

                <div className="w-1/2 inline-block p-2">
                  {values.hasIntermediaryBank && (
                    <Grid container spacing={2}>
                      <InlineFormField label={" "}>
                        <Typography>
                          <strong>Intermediary Bank Details</strong>
                        </Typography>
                      </InlineFormField>
                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.IBAN")}
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          name="intermediaryBankIBAN"
                          variant="filled"
                          type="text"
                        />
                      </InlineFormField>

                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.SWIFT/BIC")}
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          name="intermediaryBankBIC"
                          variant="filled"
                          type="text"
                        />
                      </InlineFormField>

                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.Bank Name")}
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          name="intermediaryBankName"
                          variant="filled"
                          type="text"
                        />
                      </InlineFormField>

                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.Address")}
                      >
                        <Field
                          fullWidth
                          multiline
                          rows={5}
                          component={TextField}
                          name="intermediaryBankAddress"
                          variant="filled"
                        />
                      </InlineFormField>

                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.City")}
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          name="intermediaryBankCity"
                          variant="filled"
                          type="text"
                        />
                      </InlineFormField>

                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.Post Code")}
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          name="intermediaryBankPostCode"
                          variant="filled"
                          type="text"
                        />
                      </InlineFormField>

                      <InlineFormField
                        label={t("PaymentAccountManagement.AddPaymentAccountForm.Country")}
                        name="intermediaryBankCountry"
                      >
                        <Select
                          closeMenuOnSelect
                          placeholder={t("components:Select.Select")}
                          isSearchable
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                          value={values.intermediaryBankCountry} // !WTF
                          isClearable
                          options={getDropdownValues(
                            normalisedCountries(formOptions?.country),
                            locale
                          )}
                          onChange={(newValue) => {
                            setFieldValue("intermediaryBankCountry", newValue);
                          }}
                        />
                      </InlineFormField>
                      {isUSDCountryIntermediarySelected || isGBPCountryIntermediarySelected ? (
                        <InlineFormField
                          label={t("PaymentAccountManagement.AddPaymentAccountForm.Account Number")}
                        >
                          <Field
                            fullWidth
                            component={TextField}
                            name="intermediaryBankAccountNo"
                            variant="filled"
                            type="text"
                          />
                        </InlineFormField>
                      ) : null}
                      {isUSDCountryIntermediarySelected ? (
                        <InlineFormField
                          label={t("PaymentAccountManagement.AddPaymentAccountForm.Routing Number")}
                        >
                          <Field
                            fullWidth
                            component={TextField}
                            name="intermediaryBankRouteCode"
                            variant="filled"
                            type="text"
                          />
                        </InlineFormField>
                      ) : null}
                      {isGBPCountryIntermediarySelected ? (
                        <InlineFormField
                          label={t("PaymentAccountManagement.AddPaymentAccountForm.Sort Code")}
                        >
                          <Field
                            fullWidth
                            component={TextField}
                            name="intermediaryBankSortCode"
                            variant="filled"
                            type="text"
                          />
                        </InlineFormField>
                      ) : null}
                      {isINRCountryIntermediarySelected ? (
                        <InlineFormField
                          label={t("PaymentAccountManagement.AddPaymentAccountForm.IFSC Code")}
                        >
                          <Field
                            fullWidth
                            component={TextField}
                            name="intermediaryBankIfscCode"
                            variant="filled"
                            type="text"
                          />
                        </InlineFormField>
                      ) : null}
                      {isAUDCountryIntermediarySelected || isNZDCountryIntermediarySelected ? (
                        <InlineFormField
                          label={t("PaymentAccountManagement.AddPaymentAccountForm.BSB Code")}
                        >
                          <Field
                            fullWidth
                            component={TextField}
                            name="intermediaryBankBsbCode"
                            variant="filled"
                            type="text"
                          />
                        </InlineFormField>
                      ) : null}
                    </Grid>
                  )}
                </div>
              </div>
              {/*
                <Grid item container xs={12} md={12} lg={12}>
                <Grid item xs={4} container direction="column" justify="center">
                  <Typography>{t('PaymentAccountManagement.AddPaymentAccountForm.Supporting Document')}</Typography>
                </Grid>
                <Grid item xs={8}>
                  <FileUploadField name="supportingDoc" isLoading={uploadStatus?.supportingDoc} fullWidth customHandleChange={(e) => handleSingleFileUpload({ files: e, name: 'supportingDoc' })} />
                </Grid>
              </Grid>
                */}

              <Grid item container justifyContent="flex-end" spacing={2}>
                <Grid item>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      handleCloseDialog();
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" data-testid="submit">
                    {t("PaymentAccountManagement.AddPaymentAccountForm.SubmitButtonText")}
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

export default AddPaymentAccountForm;
