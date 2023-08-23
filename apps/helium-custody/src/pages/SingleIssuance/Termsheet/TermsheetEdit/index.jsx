import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { diff } from "deep-object-diff";
import { Formik, useFormikContext } from "formik";
import moment from "moment";

import Button from "../../../../components/Button";
import Datepicker from "../../../../components/Datepicker";
import DropdownSelect from "../../../../components/DropdownSelect";
import InputField from "../../../../components/InputField";
import LoadingPage from "../../../../components/LoadingPage";
import ReadOnlyInputField from "../../../../components/ReadOnlyInputField";
import TextArea from "../../../../components/TextArea";
import { useTheme } from "../../../../context/theme-context";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import { getDropdownValues } from "../../../../utils/form";
import { issuanceTermsheetSchema } from "../../../../validationSchemas";
import style from "./style.module.scss";

const DEFAULT_DATE_FORMAT = "DD/MM/YYYY HH:mm:ss";

const DetectFormChanges = () => {
  const dispatch = useDispatch();
  const { values } = useFormikContext();

  const termsheetData = useSelector(issuanceSelectors.selectTermsheetData);
  const hasSavedTermsheet = useSelector(issuanceSelectors.selectHasSavedTermsheet);

  const changedValues = diff(termsheetData, values);
  delete changedValues.markAsPublished;

  useEffect(() => {
    if (hasSavedTermsheet && Object.keys(changedValues).length !== 0) {
      dispatch(issuanceActionCreators.doUpdateSaveTermsheetState(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, values]);

  return null;
};

const TermsheetEdit = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["translation", "termsheet"]);
  const { theme } = useTheme();
  const { locale } = theme;
  const { issuanceID } = useParams();
  const formOptions = useSelector(issuanceSelectors.selectDropDowns);

  const termsheetData = useSelector(issuanceSelectors.selectTermsheetData);
  const termsheetInfoEn = useSelector(issuanceSelectors.selectTermsheetInfo);
  const termsheetInfoAr = useSelector(issuanceSelectors.selectTermsheetInfoAr);
  const obligorMember = useSelector(issuanceSelectors.selectProjectTeam)("OBLIGOR");
  const isFetchingTermsheetData = useSelector(issuanceSelectors.selectFetchingTermsheet);
  const hasSavedTermsheet = useSelector(issuanceSelectors.selectHasSavedTermsheet);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);

  const termsheetInfo = locale.altLocale === "ar-sa" ? termsheetInfoAr : termsheetInfoEn;
  const isTermsheetGenerationCompleted =
    termsheetData?.status && termsheetData?.status !== "TermSheetGeneration";
  const entityType = currentEntityGroup?.entityType;
  const { legalCounselPublished, arrangerPublished, arrangerReviewRequired } = termsheetInfo;

  const saveTermsheet = (payload) => dispatch(issuanceActionCreators.doSaveTermsheet(payload));

  // when arr publishes it, if arrpublish true & if lcpublish true set it to false, arrReview false
  // when lc publishes it, lcpublish true and keep arrpublish true so as to allow finalization.
  const publishTermsheet = (payload) =>
    dispatch(issuanceActionCreators.doPublishTermsheet(payload));

  const handleReview = () => {
    const reviewTermsheet = (payload) =>
      dispatch(issuanceActionCreators.doReviewTermsheet(payload));

    reviewTermsheet({ sukukId: issuanceID });
  };

  const minDateMessage = t("translation:Miscellaneous.Date cannot be before todays date");

  useEffect(() => {
    const fetchFormOptions = (payload) =>
      dispatch(issuanceActionCreators.doFetchFormOptions(payload));
    fetchFormOptions({
      options: [
        "jurisdiction",
        "currency",
        "governingLaw",
        "rating",
        "profitRateTerms",
        "dayCountConvention",
        "sellingRestrictions",
        "formOfOffering",
        "useOfProceeds",
        "shariaCompliance",
        "ranking",
        "listing",
        "denomination",
        "frequency",
      ],
    });
  }, [dispatch]);

  const buildRequestPayload = (values) => {
    const requestPayload = diff(termsheetData, values);
    delete requestPayload.numberOfCertificates;
    // check if certificates are integer
    const dateFields = ["tradeDate", "issueDate", "maturityDate"];
    // handle date fields
    dateFields.forEach((field) => {
      if (requestPayload[field]) {
        requestPayload[field] = requestPayload[field].format(DEFAULT_DATE_FORMAT);
      }
    });
    // handle drop downs
    const selectFields = [
      "currency",
      "denomination",
      "profitRateTerms",
      "frequency",
      "dayCountConvention",
      "sellingRestrictions",
      "formOfOffering",
      "useOfProceeds",
      "shariahCompliance",
      "ranking",
      "listing",
      "rating",
      "governingLaw",
      "jurisdiction",
    ];
    selectFields.forEach((field) => {
      if (requestPayload[field]) {
        requestPayload[field] = requestPayload[field].value;
      }
    });
    return requestPayload;
  };

  const getNumberOfCertificates = (values) => {
    let count;
    if (values.issuanceAmount != null && values.denomination && values.denomination.label !== 0) {
      const certCount =
        parseInt(values.issuanceAmount, 10) / parseInt(values.denomination.label, 10);
      count = Number.isNaN(certCount) ? "NA" : certCount;
    }
    return count;
  };

  const getDenominationOptions = (entries) => {
    const options = [];
    if (entries) {
      entries.forEach((entry) => {
        const opt = { ...entry };
        options.push({ label: opt.value, value: opt.id });
      });
    }
    return options;
  };

  const validateNumberOfCertificates = (
    values,
    setFieldValue,
    changedFieldName,
    changedFieldValue
  ) => {
    let amount = parseInt(values.issuanceAmount, 10);
    let denominationValue = values.denomination ? parseInt(values.denomination.label, 10) : null;
    if (changedFieldName === "issuanceAmount") {
      amount = parseInt(changedFieldValue, 10);
    }
    if (changedFieldName === "denomination") {
      denominationValue = parseInt(changedFieldValue, 10);
    }
    let count;
    if (!Number.isNaN(amount) && !Number.isNaN(denominationValue)) {
      count = amount / denominationValue;
    }
    setFieldValue("numberOfCertificates", count);
  };

  const disablePublishButton = () => {
    if (entityType === "ARRANGER") {
      const disable = arrangerReviewRequired ? false : !hasSavedTermsheet;
      return disable;
    }
    if (entityType === "LEGAL_COUNSEL") {
      return legalCounselPublished;
    }
    return null;
  };

  if (isFetchingTermsheetData) {
    return <LoadingPage />;
  }

  return (
    <div style={{ paddingTop: "0em", position: "relative" }}>
      <Formik
        initialValues={termsheetData}
        isInitialValid={false}
        enableReinitialize
        validationSchema={issuanceTermsheetSchema}
        onSubmit={async (values, actions) => {
          if (values?.markAsPublished) {
            publishTermsheet({
              requestPayload: { ...buildRequestPayload(values), markAsPublished: true },
              sukukId: issuanceID,
            });
          } else {
            saveTermsheet({
              requestPayload: buildRequestPayload(values),
              sukukId: issuanceID,
            });
          }

          actions.setSubmitting(false);
        }}
      >
        {({ values, handleSubmit, setFieldValue, touched, errors, dirty }) => (
          <>
            <form onSubmit={handleSubmit} noValidate>
              <Grid container md={12} spacing={2} justifyContent="flex-end">
                {entityType === "ARRANGER" && (
                  <Grid item>
                    <Button
                      id="save-button"
                      disabled={
                        isFetchingTermsheetData || arrangerPublished || arrangerReviewRequired
                      }
                      variant="outlined"
                      color="primary"
                      type="submit"
                      className={style.button}
                      onClick={() => setFieldValue("markAsPublished", false)}
                    >
                      {t("termsheet:Save")}
                    </Button>
                  </Grid>
                )}

                {entityType === "LEGAL_COUNSEL" && (
                  <Grid item>
                    <Button
                      id="review-button"
                      disabled={!legalCounselPublished}
                      variant="outlined"
                      color="primary"
                      onClick={handleReview}
                    >
                      {t("termsheet:Send for Review")}
                    </Button>
                  </Grid>
                )}

                {(entityType === "ARRANGER" || entityType === "LEGAL_COUNSEL") && (
                  <Grid item>
                    <Button
                      id="publish-button"
                      disabled={disablePublishButton()}
                      variant="outlined"
                      color="primary"
                      type="submit"
                      className={style.button}
                      onClick={() => setFieldValue("markAsPublished", true)}
                    >
                      {t("termsheet:Publish")}
                    </Button>
                  </Grid>
                )}
              </Grid>

              <Box className={style.scroll} id="scroll-container">
                <p className={style.sectionHeading}>{t("termsheet:Key Commercial Terms")}</p>
                {/* security name is populated on finalization */}
                <ReadOnlyInputField
                  label={t("termsheet:Security Short Name")}
                  value={termsheetData.securityShortName ? termsheetData.securityShortName : ""}
                />
                {/* use the same as security short name for now */}
                <ReadOnlyInputField
                  label={t("termsheet:Security Long Name")}
                  value={termsheetData.securityShortName ? termsheetData.securityShortName : ""}
                />
                <ReadOnlyInputField
                  label={t("termsheet:Issuance Name")}
                  value={termsheetData.name ? termsheetData.name : ""}
                />
                <ReadOnlyInputField
                  label={t("termsheet:Ticker")}
                  value={termsheetData.ticker ? termsheetData.ticker : ""}
                />
                <InputField
                  label={t("termsheet:ISIN")}
                  name="isin"
                  value={termsheetData.isin ? termsheetData.isin : ""}
                />
                <InputField
                  label={t("termsheet:Exchange Code")}
                  name="exchangeCode"
                  value={termsheetData.exchangeCode ? termsheetData.exchangeCode : ""}
                />
                <ReadOnlyInputField
                  label={t("termsheet:Obligor")}
                  value={obligorMember?.corporateEntityName || ""}
                />
                <DropdownSelect
                  label={t("termsheet:Currency")}
                  name="currency"
                  options={getDropdownValues(formOptions?.currency, locale)}
                  dataTestId="currency"
                  isRequired
                />
                <InputField
                  label={t("termsheet:Issuance Amount")}
                  name="issuanceAmount"
                  customOnchange={(val) =>
                    validateNumberOfCertificates(values, setFieldValue, "issuanceAmount", val)
                  }
                  isRequired
                />
                <DropdownSelect
                  label={t("termsheet:Denomination")}
                  name="denomination"
                  options={getDenominationOptions(formOptions?.denomination)}
                  customOnchange={(field) =>
                    validateNumberOfCertificates(values, setFieldValue, "denomination", field.label)
                  }
                  dataTestId="denomination"
                  isRequired
                />
                <ReadOnlyInputField
                  label={t("termsheet:Number of Certificates")}
                  value={getNumberOfCertificates(values) || "NA"}
                  error={
                    (touched.issuanceAmount || touched.denomination) && errors.numberOfCertificates
                      ? errors.numberOfCertificates
                      : null
                  }
                />
                <InputField label={t("termsheet:Issue Price")} name="issuePrice" />
                <Datepicker
                  label={t("termsheet:Trade Date")}
                  name="tradeDate"
                  minDate={moment()}
                  minDateMessage={minDateMessage}
                  isRequired
                />
                <Datepicker
                  label={t("termsheet:Issue Date")}
                  name="issueDate"
                  minDate={moment()}
                  minDateMessage={minDateMessage}
                  isRequired
                />
                <Datepicker
                  label={t("termsheet:Maturity Date")}
                  name="maturityDate"
                  minDate={moment()}
                  minDateMessage={minDateMessage}
                  isRequired
                />
                <ReadOnlyInputField
                  label={t("termsheet:Type of Sukuk Issuance")}
                  value={
                    termsheetData.sukukTypeName
                      ? termsheetData.sukukTypeName[
                          locale.altLocale === "ar-sa" ? "nameAr" : "name"
                        ]
                      : ""
                  }
                />
                <ReadOnlyInputField
                  label={t("termsheet:Hybrid Sukuk Type")}
                  value={termsheetData.hybridSukukType ? termsheetData.hybridSukukType : ""}
                />
                <TextArea
                  rows={5}
                  label={t("termsheet:Underlying Assets")}
                  name="underlyingAssets"
                  isRequired
                />
                <InputField
                  label={t("termsheet:Maturity Amount")}
                  name="maturityAmount"
                  type="number"
                  isRequired
                />
                <DropdownSelect
                  label={t("termsheet:Profit Rate Terms")}
                  name="profitRateTerms"
                  options={getDropdownValues(formOptions?.profitRateTerms, locale)}
                  dataTestId="profitRateTerms"
                  isRequired
                />
                <p className={style.lightText}>{t("termsheet:Fixed")}</p>
                <InputField label={t("termsheet:Profit Rate")} name="profitRate" isRequired />
                <DropdownSelect
                  label={t("termsheet:Frequency")}
                  name="frequency"
                  options={getDropdownValues(formOptions?.frequency, locale)}
                  dataTestId="frequency"
                  isRequired
                />
                <DropdownSelect
                  label={t("termsheet:Day Count Convention")}
                  name="dayCountConvention"
                  options={getDropdownValues(formOptions?.dayCountConvention, locale)}
                  dataTestId="dayCountConvention"
                  isRequired
                />
                <p className={style.sectionHeading}>
                  {t("termsheet:Primary Distribution Considerations")}
                </p>
                <ReadOnlyInputField
                  label={t("termsheet:Distribution Method")}
                  value={
                    termsheetData.distributionMethodName
                      ? termsheetData.distributionMethodName[
                          locale.altLocale === "ar-sa" ? "nameAr" : "name"
                        ]
                      : ""
                  }
                />
                <ReadOnlyInputField
                  label={t("termsheet:Lead Manager/Arranger")}
                  value={termsheetData.arrangerDetails?.group.entity.corporateEntityName || ""}
                />
                <DropdownSelect
                  label={t("termsheet:Selling Restrictions")}
                  name="sellingRestrictions"
                  options={getDropdownValues(formOptions?.sellingRestrictions, locale)}
                  dataTestId="sellingRestrictions"
                  isRequired
                />
                <ReadOnlyInputField
                  label={t("termsheet:Pricing Method")}
                  value={
                    termsheetData.pricingName
                      ? termsheetData.pricingName[locale.altLocale === "ar-sa" ? "nameAr" : "name"]
                      : ""
                  }
                />
                <p className={style.sectionHeading}>{t("termsheet:Other Terms")}</p>
                <InputField label={t("termsheet:Guarantor")} name="guarantor" />
                <DropdownSelect
                  label={t("termsheet:Form of Offering / Issue Format")}
                  name="formOfOffering"
                  options={getDropdownValues(formOptions?.formOfOffering, locale)}
                  dataTestId="formOfOffering"
                  isRequired
                />
                <DropdownSelect
                  label={t("termsheet:Use of Proceeds")}
                  name="useOfProceeds"
                  options={getDropdownValues(formOptions?.useOfProceeds, locale)}
                  dataTestId="useOfProceeds"
                  isRequired
                />
                <DropdownSelect
                  label={t("termsheet:Shariah Compliance")}
                  name="shariahCompliance"
                  options={getDropdownValues(formOptions?.shariaCompliance, locale)}
                  dataTestId="shariahCompliance"
                  isRequired
                />
                <DropdownSelect
                  label={t("termsheet:Ranking")}
                  name="ranking"
                  options={getDropdownValues(formOptions?.ranking, locale)}
                  dataTestId="ranking"
                  isRequired
                />
                <DropdownSelect
                  label={t("termsheet:Listing")}
                  name="listing"
                  options={getDropdownValues(formOptions?.listing, locale)}
                  dataTestId="listing"
                  isRequired
                />
                <DropdownSelect
                  label={t("termsheet:Rating")}
                  name="rating"
                  options={getDropdownValues(formOptions?.rating, locale)}
                  dataTestId="rating"
                  isRequired
                />
                <DropdownSelect
                  label={t("termsheet:Governing Law")}
                  name="governingLaw"
                  options={getDropdownValues(formOptions?.governingLaw, locale)}
                  dataTestId="governingLaw"
                  isRequired
                />
                <DropdownSelect
                  label={t("termsheet:Relevant Courts / Jurisdiction for Arbitration")}
                  name="jurisdiction"
                  options={getDropdownValues(formOptions?.jurisdiction, locale)}
                  dataTestId="jurisdiction"
                  isRequired
                />
              </Box>

              {dirty && (
                <p style={{ color: "green", fontSize: "0.6rem", marginBottom: "1rem" }}>
                  <strong>{t("termsheet:* Please save your changes before finalizing")}</strong>
                </p>
              )}

              <DetectFormChanges />
            </form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default TermsheetEdit;
