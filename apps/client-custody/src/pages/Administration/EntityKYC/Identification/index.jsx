import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { RadioGroup, TextField } from "formik-mui";
import { KeyboardDatePicker } from "formik-material-ui-pickers";
import sortby from "lodash.sortby";
import moment from "moment";

import ChangeRequest from "../../../../components/ChangeRequest";
import LoadingPage from "../../../../components/LoadingPage";
import Required from "../../../../components/Required";
import StyledPageTitle from "../../../../components/StyledPageTitle";
import UnsavedFormDataGuard from "../../../../components/UnsavedFormDataGuard";
import accessControlsList from "../../../../constants/accessControlsList";
import { useTheme } from "../../../../context/theme-context";
import normalisedCountries from "../../../../helpers/countries";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as kycActionCreators from "../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as kycSelectors from "../../../../redux/selectors/kyc";
import selectStyles from "../../../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../../../utils/form";
import { kycSchema } from "../../../../validationSchemas";

const animatedComponents = makeAnimated();

const Identification = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["translation", "kyc", "components"]);
  const { theme } = useTheme();
  const { entityId } = useParams();
  const { locale } = theme;

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const entityType = currentEntityGroup?.entityType;
  const hasManageKYCAccessControl = currentEntityGroup?.accessControls.some(
    (acl) => acl?.key === "KYC/Manage"
  );
  const isIssuer = currentEntityGroup?.accessControls.some(
    (acl) => acl?.key === accessControlsList.SECURITIES_SERVICES_ISSUER.view.key
  );
  const isComplianceOfficer = hasManageKYCAccessControl && entityType === "EMRGO_SERVICES";

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const fetchPageData = () => {
    dispatch(
      kycActionCreators.doFetchKYCData({
        entityId,
        requestPayload: {
          keys: ["entityType", "registeredAddress", "tradingAddress"],
          includeSignedUrl: true,
          sectionChanges: "identification",
        },
      })
    );
  };

  useEffect(() => {
    dispatch(
      kycActionCreators.doFetchDropdowns({
        options: ["country", "legalForm", "industryBusinessActvity", "sectorBusinessActvity"],
      })
    );
    fetchPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  const dropdowns = useSelector(kycSelectors.selectdropdownData);
  const kycData = useSelector(kycSelectors.selectKYCData);
  const isFetchingDropdownOptions = useSelector(kycSelectors.selectIsFetching);
  const isFetchingKYCData = useSelector(kycSelectors.selectIsFetchingKycData);

  const countriesDropdown = normalisedCountries(dropdowns?.country);
  const countries = getDropdownValues(countriesDropdown, locale);

  let legalForms = getDropdownValues(dropdowns?.legalForm, locale);
  // const industryBusinessActvity = getDropdownValues(dropdowns?.industryBusinessActvity, locale);
  const sectorBusinessActvity = sortby(
    getDropdownValues(dropdowns?.sectorBusinessActvity, locale, false, "industries"),
    ["label"]
  );

  const selectedLegalForm = legalForms?.find(
    (legalForm) => legalForm?.value === kycData?.legalFormId
  );
  const selectedRegisteredAddressCountry = countries?.find(
    (country) => country?.value === kycData?.registeredAddress?.countryId
  );
  const selectedTradeAddressCountry = countries?.find(
    (country) => country?.value === kycData?.tradingAddress?.countryId
  );

  const selectedSectorBusinessActvity = sectorBusinessActvity?.find(
    (sector) => sector?.value === kycData?.businessActivitySectorId
  );
  const selectedIndustriesBySector = getDropdownValues(selectedSectorBusinessActvity?.meta, locale);
  const selectedIndustryBusinessActvity = selectedIndustriesBySector?.find(
    (industry) => industry?.value === kycData?.businessActivityIndustryId
  );

  if (isIssuer) {
    legalForms = legalForms?.filter(
      (legalForm) => legalForm.label === "Trust" && legalForm.label === "Other"
    );
  }

  if (isIssuer) {
    legalForms = legalForms?.filter(
      (legalForm) => legalForm.label === "Trust" || legalForm.label === "Other"
    );
  }

  const processIdentificationFormData = (formData) => {
    const processData = {
      ...formData,
      legalFormId: formData?.legalForm?.value,
      tradingNames: formData?.tradingNames?.filter((tradingName) => tradingName !== ""),
      registeredAddress: {
        ...formData?.registeredAddress,
        countryId: formData?.registeredAddress?.country?.value,
        country: null,
      },
      tradingAddress: {
        ...formData?.tradingAddress,
        countryId: formData?.tradingAddress?.country?.value,
        country: null,
      },
      businessActivityIndustryId: formData?.businessActivityIndustry?.value,
      businessActivitySectorId: formData?.businessActivitySector?.value,
      partOfGroup: formData?.partOfGroup === null ? null : formData?.partOfGroup === "yes",
      supervisedByFinancialServicesRegulatory:
        formData?.supervisedByFinancialServicesRegulatory === null
          ? null
          : formData?.supervisedByFinancialServicesRegulatory === "yes",
    };

    delete processData.changeRequests.test;
    delete processData?.tradingAddress?.country;
    delete processData?.registeredAddress?.country;
    delete processData?.legalForm;
    delete processData?.businessActivityIndustry;
    delete processData?.businessActivitySector;

    processData.tradingNames =
      processData.tradingNames.length === 0 ? null : processData.tradingNames;

    const isTradingAddressEmpty = Object.keys(processData.tradingAddress).every(
      (k) => !processData.tradingAddress[k]
    );
    if (isTradingAddressEmpty) processData.tradingAddress = null;

    return processData;
  };

  if (isFetchingDropdownOptions || isFetchingKYCData) {
    return <LoadingPage />;
  }

  const getYesNoValue = (val) => {
    if (val === true) {
      return "yes";
    }
    if (val === false) {
      return "no";
    }
    return null;
  };

  if (isIssuer) {
    // legalForms.filter(())
  }

  return (
    <Fragment>
      <MuiPickersUtilsProvider utils={MomentUtils} locale={theme.locale.altLocale}>
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12}>
            <StyledPageTitle title={t("kyc:Identification.Identification Details of the Entity")} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">
              {t(
                "kyc:Identification.Please provide the Legal Form and constitutional details that BEST describes your entity"
              )}
            </Typography>
          </Grid>
        </Grid>
        {kycData ? (
          <Formik
            initialValues={{
              entityName: kycData?.entityName || "",
              legalForm: selectedLegalForm,
              legalFormOther: kycData?.legalFormOther,
              tradingNames: kycData.tradingNames || [""],
              incorporationDate: kycData?.incorporationDate,
              incorporationPlace: kycData?.incorporationPlace || "",
              legalEntityIdentifier: kycData?.legalEntityIdentifier || "",
              commercialRegNo: kycData?.commercialRegNo || "",
              taxIdentificationNumber: kycData?.taxIdentificationNumber || "",
              registeredAddress: {
                addressLine1: kycData?.registeredAddress?.addressLine1 || "",
                addressLine2: kycData?.registeredAddress?.addressLine2 || "",
                city: kycData?.registeredAddress?.city || "",
                country: selectedRegisteredAddressCountry,
                pinCode: kycData?.registeredAddress?.pinCode || "",
                businessPhone: kycData?.registeredAddress?.businessPhone || "",
              },
              tradingAddress: {
                addressLine1: kycData?.tradingAddress?.addressLine1 || "",
                addressLine2: kycData?.tradingAddress?.addressLine2 || "",
                city: kycData?.tradingAddress?.city || "",
                country: selectedTradeAddressCountry,
                pinCode: kycData?.tradingAddress?.pinCode || "",
                businessPhone: kycData?.tradingAddress?.businessPhone || "",
              },
              pocBusinessPhone: kycData?.pocBusinessPhone,
              pocWebsite: kycData?.pocWebsite,
              pocEmail: kycData?.pocEmail,
              numberOfEmployees: kycData?.numberOfEmployees,
              businessActivityIndustry: selectedIndustryBusinessActvity,
              businessActivitySector: selectedSectorBusinessActvity,
              partOfGroup: getYesNoValue(kycData?.partOfGroup),
              supervisedByFinancialServicesRegulatory: getYesNoValue(
                kycData?.supervisedByFinancialServicesRegulatory
              ),
              supervisoryAuthorityName: kycData?.supervisoryAuthorityName,
              regulatoryLicenseNumber: kycData?.regulatoryLicenseNumber,
              externalAuditor: kycData?.externalAuditor,
              changeRequests: kycData?.sectionChanges
                ? kycData?.sectionChanges?.changesRequested
                : {},
            }}
            enableReinitialize
            validationSchema={
              isIssuer
                ? kycSchema.identificationDetailsIssuerSchema
                : kycSchema.identificationDetailsSchema
            }
            validateOnMount={false}
            onSubmit={(values, { setSubmitting }) => {
              const identificationSubmitData = processIdentificationFormData(values);

              delete identificationSubmitData.changeRequests.test;

              const isLocked = isComplianceOfficer
                ? Object.keys(identificationSubmitData.changeRequests).length === 0
                : true;

              identificationSubmitData.updateSection = {
                sectionKey: "identification",
                changesRequested: identificationSubmitData.changeRequests,
                isLocked,
              };

              const payload = {
                entityId,
                requestPayload: identificationSubmitData,
                successCallback: () => {
                  setSubmitting(false);
                  fetchPageData();
                  // history.push(reverse(routes.dashboard.administration.kyc.entities.entity.edit.banking, { entityId }));
                },
              };
              dispatch(kycActionCreators.doPostKYCData(payload));
            }}
          >
            {({ handleSubmit, values, setFieldValue, isSubmitting, dirty }) => {
              const saveForm = () => {
                const identificationSaveData = processIdentificationFormData(values);

                const isRegisteredAddressEmpty = Object.keys(
                  identificationSaveData.registeredAddress
                ).every((k) => !identificationSaveData.registeredAddress[k]);
                if (isRegisteredAddressEmpty) identificationSaveData.registeredAddress = null;

                const payload = {
                  entityId,
                  requestPayload: identificationSaveData,
                  successCallback: () => {
                    fetchPageData();
                  },
                };
                dispatch(kycActionCreators.doPostKYCData(payload));
              };

              const industryBusinessActvity = sortby(
                getDropdownValues(values?.businessActivitySector?.meta, locale),
                ["label"]
              );

              return (
                <form onSubmit={handleSubmit} noValidate className="pb-16 py-8">
                  <UnsavedFormDataGuard dirty={dirty && !kycData?.sectionChanges?.isLocked} />
                  <Grid container className="pb-8">
                    <Grid item xs={12}>
                      <Grid container justifyContent="flex-end">
                        <Grid item xs={12} md={6} lg={2}>
                          <Grid container direction="column">
                            {isComplianceOfficer ? (
                              <Button
                                variant="contained"
                                size="small"
                                color="secondary"
                                onClick={() => {
                                  saveForm();
                                }}
                                disabled={!dirty}
                              >
                                {t("Miscellaneous.Save Form")}
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                size="small"
                                color="secondary"
                                onClick={() => {
                                  saveForm();
                                }}
                                disabled={kycData?.sectionChanges?.isLocked || !dirty}
                              >
                                {t("Miscellaneous.Save Form")}
                              </Button>
                            )}

                            <Typography variant="caption" align="center" className="text-gray-500">
                              {t("Miscellaneous.Last Saved", {
                                date: kycData?.sectionChanges?.updatedAt
                                  ? moment(kycData?.sectionChanges?.updatedAt).format(
                                      "DD/MM/YYYY HH:mm"
                                    )
                                  : "N.A",
                              })}{" "}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                        <Typography className="mt-4">
                          {t(`kyc:Identification.Form Fields.Registered Name`)}
                          <Required />
                        </Typography>
                      </Grid>
                      <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Identification.Form Fields.Registered Name`)}
                          name="entityName"
                          variant="filled"
                          type="text"
                        />
                      </Grid>
                      <Grid
                        xs={12}
                        md={4}
                        lg={4}
                        container
                        justifyContent="flex-end"
                        alignContent="flex-start"
                        className="px-1"
                      >
                        <ChangeRequest
                          setFieldValue={setFieldValue}
                          changeRequests={values.changeRequests}
                          fieldKey="entityName"
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                        <Typography className="mt-4">
                          {t(`kyc:Identification.Form Fields.Legal Form`)}
                          <Required />
                        </Typography>
                      </Grid>
                      <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <Select
                            closeMenuOnSelect
                            isSearchable
                            placeholder={`${t("components:Select.Select")}...`}
                            components={{
                              ...animatedComponents,
                            }}
                            styles={selectStyles}
                            value={values.legalForm}
                            options={legalForms}
                            onChange={(selectedEntity) => {
                              setFieldValue("legalForm", selectedEntity);
                            }}
                          />
                          <ErrorMessage
                            component={Typography}
                            variant="caption"
                            color="error"
                            className="ml-4"
                            name="legalForm"
                          />
                        </FormControl>
                        {values.legalForm?.label === "Other" ? (
                          <div className="mt-4 w-full">
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(`kyc:Identification.Form Fields.Other Legal Form`)}
                              name="legalFormOther"
                              variant="filled"
                              type="text"
                            />
                          </div>
                        ) : (
                          ""
                        )}
                      </Grid>

                      <Grid
                        xs={12}
                        md={4}
                        lg={4}
                        container
                        justifyContent="flex-end"
                        alignContent="flex-start"
                        className="px-1"
                      >
                        <ChangeRequest
                          setFieldValue={setFieldValue}
                          changeRequests={values.changeRequests}
                          fieldKey="legalForm"
                        />
                      </Grid>
                    </Grid>
                    {!isIssuer ? (
                      <Grid item xs={12} lg={12} container className="mt-4">
                        <Grid
                          item
                          xs={12}
                          md={4}
                          lg={4}
                          container
                          alignContent="flex-start"
                          className="py-2"
                        >
                          <Typography className="w-full">
                            {t(`kyc:Identification.Form Fields.Trading Name(s)`)}
                          </Typography>
                          <Typography variant="caption" className="w-full text-gray-500">
                            {t(`kyc:Identification.Form Fields.If Different from Registered Name`)}
                          </Typography>
                        </Grid>
                        <Grid
                          xs={12}
                          md={4}
                          lg={4}
                          container
                          alignContent="center"
                          className="px-1"
                        >
                          <FieldArray
                            name="tradingNames"
                            render={(arrayHelpers) => (
                              <div className="w-full">
                                {values.tradingNames.map((tradingName, index) => (
                                  <Grid xs={12}>
                                    <Field
                                      fullWidth
                                      component={TextField}
                                      label={t(`kyc:Identification.Form Fields.Trading Name`)}
                                      name={`tradingNames.${index}`}
                                      variant="filled"
                                      type="text"
                                      className="mb-4"
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            {index !== 0 ? (
                                              <IconButton
                                                onClick={() => arrayHelpers.remove(index)}
                                                size="large"
                                              >
                                                <CloseIcon />
                                              </IconButton>
                                            ) : (
                                              ""
                                            )}
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                  </Grid>
                                ))}
                                <Grid xs={12} container justifyContent="flex-end">
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => arrayHelpers.push("")}
                                  >
                                    {t(`kyc:Identification.Buttons.Add`)}
                                  </Button>
                                </Grid>
                              </div>
                            )}
                          />
                        </Grid>
                        <Grid
                          xs={12}
                          md={4}
                          lg={4}
                          container
                          justifyContent="flex-end"
                          alignContent="flex-start"
                          className="px-1"
                        >
                          <ChangeRequest
                            setFieldValue={setFieldValue}
                            changeRequests={values.changeRequests}
                            fieldKey="tradingNames"
                          />
                        </Grid>
                        <Grid
                          xs={8}
                          container
                          justifyContent="flex-end"
                          alignContent="center"
                          className="px-1"
                        ></Grid>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Date of Incorporation`)}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                      <Field
                        fullWidth
                        format="DD/MM/yyyy"
                        inputVariant="filled"
                        inputProps={{
                          shrink: "false",
                        }}
                        maxDate={moment()}
                        variant="dialog"
                        placeholder="DD/MM/YYYY"
                        component={KeyboardDatePicker}
                        name="incorporationDate"
                        label={t("kyc:Identification.Form Fields.Date of Incorporation")}
                      />
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="incorporationDate"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Place of Incorporation`)}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t(`kyc:Identification.Form Fields.Place of Incorporation`)}
                        name="incorporationPlace"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="incorporationPlace"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Legal Entity Identifier (LEI)`)}
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t(`kyc:Identification.Form Fields.Legal Entity Identifier (LEI)`)}
                        name="legalEntityIdentifier"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="legalEntityIdentifier"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Commercial Licence Number`)}
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t(`kyc:Identification.Form Fields.Commercial Licence Number`)}
                        name="commercialRegNo"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="commercialRegNo"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Tax Identitfication Number`)}
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t(`kyc:Identification.Form Fields.Tax Identitfication Number`)}
                        name="taxIdentificationNumber"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="taxIdentificationNumber"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-8">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Registered Address`)}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                      <div className="w-full">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Identification.Form Fields.Address Line 1`)}
                          name="registeredAddress.addressLine1"
                          variant="filled"
                          type="text"
                        />
                      </div>
                      <div className="mt-4 w-full">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Identification.Form Fields.Address Line 2`)}
                          name="registeredAddress.addressLine2"
                          variant="filled"
                          type="text"
                        />
                      </div>
                      <div className="mt-4 w-full">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Identification.Form Fields.City`)}
                          name="registeredAddress.city"
                          variant="filled"
                          type="text"
                        />
                      </div>
                      <div className="mt-4 w-full">
                        <FormControl className="w-full">
                          <Select
                            closeMenuOnSelect
                            isSearchable
                            placeholder={`${t("kyc:Identification.Form Fields.Country")}`}
                            components={{
                              ...animatedComponents,
                            }}
                            styles={selectStyles}
                            value={values.registeredAddress.country}
                            options={countries}
                            onChange={(selected) => {
                              setFieldValue("registeredAddress.country", selected);
                            }}
                          />
                        </FormControl>
                      </div>
                      <div className="mt-4 w-full">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Identification.Form Fields.Post Code`)}
                          name="registeredAddress.pinCode"
                          variant="filled"
                          type="text"
                        />
                      </div>
                      <div className="mt-4 w-full">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Identification.Form Fields.Telephone Number`)}
                          name="registeredAddress.businessPhone"
                          variant="filled"
                          type="text"
                        />
                      </div>
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="registeredAddress"
                      />
                    </Grid>
                  </Grid>
                  {!isIssuer ? (
                    <Grid item xs={12} lg={12} container className="mt-8">
                      <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                        <Typography className="">
                          {t(`kyc:Identification.Form Fields.Trading Address`)}
                        </Typography>
                        <Typography variant="caption" className="w-full text-gray-500">
                          {t(`kyc:Identification.Form Fields.If different from Registered Address`)}
                        </Typography>
                      </Grid>
                      <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                        <div className="w-full">
                          <Field
                            fullWidth
                            component={TextField}
                            label={t(`kyc:Identification.Form Fields.Address Line 1`)}
                            name="tradingAddress.addressLine1"
                            variant="filled"
                            type="text"
                          />
                        </div>
                        <div className="mt-4 w-full">
                          <Field
                            fullWidth
                            component={TextField}
                            label={t(`kyc:Identification.Form Fields.Address Line 2`)}
                            name="tradingAddress.addressLine2"
                            variant="filled"
                            type="text"
                          />
                        </div>
                        <div className="mt-4 w-full">
                          <Field
                            fullWidth
                            component={TextField}
                            label={t(`kyc:Identification.Form Fields.City`)}
                            name="tradingAddress.city"
                            variant="filled"
                            type="text"
                          />
                        </div>
                        <div className="mt-4 w-full">
                          <FormControl className="w-full">
                            <Select
                              closeMenuOnSelect
                              isSearchable
                              placeholder={`${t("kyc:Identification.Form Fields.Country")}`}
                              components={{
                                ...animatedComponents,
                              }}
                              styles={selectStyles}
                              value={values.tradingAddress.country}
                              options={countries}
                              onChange={(selected) => {
                                setFieldValue("tradingAddress.country", selected);
                              }}
                            />
                          </FormControl>
                        </div>
                        <div className="mt-4 w-full">
                          <Field
                            fullWidth
                            component={TextField}
                            label={t(`kyc:Identification.Form Fields.Post Code`)}
                            name="tradingAddress.pinCode"
                            variant="filled"
                            type="text"
                          />
                        </div>
                        <div className="mt-4 w-full">
                          <Field
                            fullWidth
                            component={TextField}
                            label={t(`kyc:Identification.Form Fields.Telephone Number`)}
                            name="tradingAddress.businessPhone"
                            variant="filled"
                            type="text"
                          />
                        </div>
                      </Grid>
                      <Grid
                        xs={12}
                        md={4}
                        lg={4}
                        container
                        justifyContent="flex-end"
                        alignContent="flex-start"
                        className="px-1"
                      >
                        <ChangeRequest
                          setFieldValue={setFieldValue}
                          changeRequests={values.changeRequests}
                          fieldKey="tradingAddress"
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    ""
                  )}
                  <Grid item xs={12} lg={12} container className="mt-8">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Contact Details`)}
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                      <div className="w-full">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Identification.Form Fields.Telephone`)}
                          name="pocBusinessPhone"
                          variant="filled"
                          type="text"
                        />
                      </div>
                      <div className="mt-4 w-full">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Identification.Form Fields.Email`)}
                          name="pocEmail"
                          variant="filled"
                          type="text"
                        />
                      </div>
                      <div className="mt-4 w-full">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Identification.Form Fields.Website`)}
                          name="pocWebsite"
                          variant="filled"
                          type="text"
                        />
                      </div>
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="contactDetails"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Number of Employees`)}
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                      <Field
                        fullWidth
                        component={TextField}
                        label={t(`kyc:Identification.Form Fields.Number of Employees`)}
                        name="numberOfEmployees"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="numberOfEmployees"
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Business Activity - Sector`)}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isSearchable
                          placeholder={`${t("components:Select.Select")}...`}
                          components={{
                            ...animatedComponents,
                          }}
                          styles={selectStyles}
                          value={values.businessActivitySector}
                          options={sectorBusinessActvity}
                          onChange={(selected) => {
                            setFieldValue("businessActivityIndustry", null);
                            setFieldValue("businessActivitySector", selected);
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="businessActivitySector"
                      />
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="businessActivitySector"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Business Activity - Industry`)}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={4} lg={4} container alignContent="center" className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isSearchable
                          placeholder={`${t("components:Select.Select")}...`}
                          components={{
                            ...animatedComponents,
                          }}
                          styles={selectStyles}
                          value={values.businessActivityIndustry}
                          options={industryBusinessActvity}
                          onChange={(selected) => {
                            setFieldValue("businessActivityIndustry", selected);
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="businessActivityIndustry"
                      />
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="businessActivityIndustry"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Is the Entity part of a Group`)}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      direction="column"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <Field component={RadioGroup} name="partOfGroup">
                        <FormControlLabel
                          value="yes"
                          control={<Radio disabled={isSubmitting} />}
                          label={t(`kyc:Identification.Yes`)}
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio disabled={isSubmitting} />}
                          label={t(`kyc:Identification.No`)}
                          disabled={isSubmitting}
                        />
                      </Field>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="partOfGroup"
                      />
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="partOfGroup"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(
                          `kyc:Identification.Form Fields.Is the Entity supervised by a Financial Services Regulator?`
                        )}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      direction="column"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <Field component={RadioGroup} name="supervisedByFinancialServicesRegulatory">
                        <FormControlLabel
                          value="yes"
                          control={<Radio disabled={isSubmitting} />}
                          label={t(`kyc:Identification.Yes`)}
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio disabled={isSubmitting} />}
                          label={t(`kyc:Identification.No`)}
                          disabled={isSubmitting}
                        />
                      </Field>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="supervisedByFinancialServicesRegulatory"
                      />
                    </Grid>

                    <Grid
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="supervisedByFinancialServicesRegulatory"
                      />
                    </Grid>
                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                        <Typography className="mt-4">
                          {t(
                            `kyc:Identification.Form Fields.If yes, name of the Financial Services Regulator`
                          )}
                        </Typography>
                      </Grid>
                      <Grid
                        xs={12}
                        md={4}
                        lg={4}
                        container
                        alignContent="flex-start"
                        className="px-1"
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Identification.Form Fields.Name of FSR`)}
                          name="supervisoryAuthorityName"
                          variant="filled"
                          type="text"
                        />
                      </Grid>
                      <Grid
                        xs={12}
                        md={4}
                        lg={4}
                        container
                        justifyContent="flex-end"
                        alignContent="flex-start"
                        className="px-1"
                      >
                        <ChangeRequest
                          setFieldValue={setFieldValue}
                          changeRequests={values.changeRequests}
                          fieldKey="supervisoryAuthorityName"
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                        <Typography className="mt-4">
                          {t(`kyc:Identification.Form Fields.if yes, Regulatory License Number`)}
                        </Typography>
                      </Grid>
                      <Grid
                        xs={12}
                        md={4}
                        lg={4}
                        container
                        alignContent="flex-start"
                        className="px-1"
                      >
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Identification.Form Fields.Regulatory License Number`)}
                          name="regulatoryLicenseNumber"
                          variant="filled"
                          type="text"
                        />
                      </Grid>
                      <Grid
                        xs={12}
                        md={4}
                        lg={4}
                        container
                        justifyContent="flex-end"
                        alignContent="flex-start"
                        className="px-1"
                      >
                        <ChangeRequest
                          setFieldValue={setFieldValue}
                          changeRequests={values.changeRequests}
                          fieldKey="regulatoryLicenseNumber"
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`kyc:Identification.Form Fields.Name of External Auditor`)}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      alignContent="center"
                      className="px-1"
                    >
                      <Field
                        fullWidth
                        component={TextField}
                        label={t(`kyc:Identification.Form Fields.Name of External Auditor`)}
                        name="externalAuditor"
                        variant="filled"
                        type="text"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={4}
                      lg={4}
                      container
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      className="px-1"
                    >
                      <ChangeRequest
                        setFieldValue={setFieldValue}
                        changeRequests={values.changeRequests}
                        fieldKey="externalAuditor"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container justifyContent="flex-end" className="mt-8">
                    <Grid item xs={12} md={6} lg={2}>
                      <Grid container direction="column">
                        {isComplianceOfficer ? (
                          <Button variant="contained" type="submit" size="small" color="primary">
                            {t("Miscellaneous.Submit")}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            disabled={kycData?.sectionChanges?.isLocked}
                            type="submit"
                            size="small"
                            color="primary"
                          >
                            {t("Miscellaneous.Submit")}
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              );
            }}
          </Formik>
        ) : (
          ""
        )}
      </MuiPickersUtilsProvider>
    </Fragment>
  );
};

export default Identification;
