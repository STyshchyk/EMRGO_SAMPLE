import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "@emrgo-frontend/shared-ui";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import InfoIcon from "@mui/icons-material/Info";
import MuiButton from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import cx from "classnames";
import { Field, Form, Formik } from "formik";

import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import CustomTextField from "../../components/CustomTextField";
import Flex from "../../components/Flex";
import LoadingPage from "../../components/LoadingPage";
import normalisedCountries from "../../helpers/countries";
import regionSwitcher from "../../helpers/regions";
import useQuery from "../../hooks/useQuery";
import * as actionCreators from "../../redux/actionCreators/onboarding";
import * as selectors from "../../redux/selectors/onboarding";
import { onboardingFormSchema } from "../../validationSchemas";
import style from "./style.module.scss";

const SubmissionSuccess = ({ email }) => {
  const { t } = useTranslation(["onboarding"]);
  const onboardingData = useSelector(selectors.selectOnboardingData);
  const dispatch = useDispatch();
  const onboardingId = onboardingData?.onboardingId;

  const resendEmail = () => {
    const payload = {
      onboardingId,
    };
    dispatch(actionCreators.doResendOnboardingEmailRequest(payload));
  };

  return (
    <div className={style.successContainer}>
      <div dir="ltr" className={style["svg-box"]}>
        <svg className={cx(style.circular, style["green-stroke"])}>
          <circle
            className={style.path}
            cx="75"
            cy="75"
            r="50"
            fill="none"
            strokeWidth="5"
            strokeMiterlimit="10"
          />
        </svg>
        <svg className={cx(style.checkmark, style["green-stroke"])}>
          <g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-489.57,-205.679)">
            <path
              className={style.checkmark__check}
              fill="none"
              d="M616.306,283.025L634.087,300.805L673.361,261.53"
            />
          </g>
        </svg>
      </div>
      <Typography className={style.submitLabel}>
        {t("onboarding:Thank you for your interest in the Emrgo Platform")}
      </Typography>
      {email ? (
        <Typography className={style.submitLabel}>
          {t(
            "onboarding:We have sent an email to with further instructions to complete your onboarding",
            { email }
          )}
        </Typography>
      ) : (
        <Typography className={style.submitLabel}>
          {t(
            "onboarding:We have sent an email to your email id with further instructions to complete your onboarding"
          )}
        </Typography>
      )}
      <div className="mt-48" />
      <p className="text-gray-500 mb-0">{t("onboarding:If you haven’t received an email")}:</p>
      <div>
        <span className="text-gray-500 mt-0 float-left">
          {t("onboarding:Please check your junk/spam mailbox, or wait 30 seconds and click")}
        </span>
        <MuiButton
          onClick={() => resendEmail()}
          className="float-left p-0 pl-1"
          size="small"
          color="primary"
        >
          <Typography className="normal-case">Resend Email</Typography>
        </MuiButton>
      </div>
    </div>
  );
};

const RetailClientMessage = () => {
  const { t } = useTranslation(["onboarding"]);
  return (
    <div className={style.retailClientBox}>
      <p className={style.submitLabel}>
        {t(
          "onboarding:The platform is only accessible by Professional Clients and Market Counterparties"
        )}
      </p>
    </div>
  );
};

const SanctionedCountryMessage = () => {
  const { t } = useTranslation(["onboarding"]);
  return (
    <div className={style.retailClientBox}>
      <p className={style.submitLabel}>
        {t("onboarding:We currently do not support this Jurisdiction")}
      </p>
    </div>
  );
};

const OptionWithCallout = ({ label, calloutText, selected, setFieldValue, name }) => {
  const handleClick = () => {
    setFieldValue("selfAssessment", name, true);
  };
  return (
    <div className={style.optionRow}>
      {selected ? (
        <CheckBoxIcon fontSize="small" />
      ) : (
        <CheckBoxOutlineBlankIcon fontSize="small" onClick={handleClick} />
      )}
      <p className={style.optionRowLabel}>{label}</p>
      <Tooltip title={calloutText} aria-label="add" placement="right">
        <InfoIcon fontSize="small" color="disabled" aria-haspopup="true" />
      </Tooltip>
    </div>
  );
};

const OnboardingForm = ({ formPage, values, setFieldValue, countries }) => {
  const { t } = useTranslation(["onboarding"]);

  const ENTITY_TYPES = [
    { label: t("onboarding:Client"), value: "CLIENT" },
    { label: t("onboarding:Service Provider"), value: "SERVICE_PROVIDER" },
  ];

  const countriesDropdown = normalisedCountries(countries);
  const JURISDICTIONS =
    countriesDropdown?.map((country) => ({ label: country?.name || "", value: country })) ?? [];

  return (
    <Form className={style.form} id="onboarding-form">
      {formPage === 1 && (
        <Grid container spacing={4} direction="column">
          <Grid item container xs={12} md={12} lg={12}>
            <Grid item xs={4}>
              <Typography>{t("onboarding:First Name")}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Field
                required
                fullWidth
                component={CustomTextField}
                name="firstName"
                variant="filled"
                type="text"
                inputProps={{
                  maxLength: 40,
                }}
              />
            </Grid>
          </Grid>

          <Grid item container xs={12} md={12} lg={12}>
            <Grid item xs={4}>
              <Typography>{t("onboarding:Middle Name")}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Field
                fullWidth
                component={CustomTextField}
                name="middleName"
                variant="filled"
                type="text"
                inputProps={{
                  maxLength: 40,
                }}
              />
            </Grid>
          </Grid>

          <Grid item container xs={12} md={12} lg={12}>
            <Grid item xs={4}>
              <Typography>{t("onboarding:Last Name")}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Field
                required
                fullWidth
                component={CustomTextField}
                name="lastName"
                variant="filled"
                type="text"
                inputProps={{
                  maxLength: 40,
                }}
              />
            </Grid>
          </Grid>

          <Grid item container xs={12} md={12} lg={12}>
            <Grid item xs={4}>
              <Typography>{t("onboarding:Entity Name")}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Field
                required
                fullWidth
                component={CustomTextField}
                name="entityName"
                variant="filled"
                type="text"
                inputProps={{
                  maxLength: 40,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        title="Please provide the full Entity Name as per Legal Documents"
                        aria-label="add"
                        placement="right"
                      >
                        <InfoIcon className="text-gray-500 cursor-help" fontSize="small" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Grid item container xs={12} md={12} lg={12}>
            <Grid item xs={4}>
              <Typography>{t("onboarding:Corporate Email")}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Field
                required
                fullWidth
                component={CustomTextField}
                name="entityEmail"
                variant="filled"
                type="text"
                inputProps={{
                  maxLength: 40,
                }}
              />
            </Grid>
          </Grid>

          <Flex>
            <p className={style.termsText}>
              <strong>{t("Disclaimer")}: </strong>
              {regionSwitcher({
                sa: t("DISCLAIMER_TEXT_SA"),
                ae: t("DISCLAIMER_TEXT_AE"),
              })}
              {}.
            </p>
          </Flex>
        </Grid>
      )}
      {formPage === 2 && (
        <div>
          <p className={style.labelText}>
            {regionSwitcher({
              sa: t("onboarding:Entity/Individual Jurisdiction"),
              ae: t("onboarding:What jurisdiction is your entity incorporated in?"),
            })}
          </p>
          <Select
            id="jurisdiction"
            closeMenuOnSelect
            placeholder={`${t("onboarding:Choose jurisdiction")}`}
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
            value={values.jurisdiction}
            options={JURISDICTIONS}
            onChange={(selected) => {
              setFieldValue("jurisdiction", selected, true);
            }}
          />
          <p className={style.labelText}>
            {regionSwitcher({
              ae: t("onboarding:Select Entity Type Question"),
              sa: t("onboarding:Entity/Individual Type"),
            })}
          </p>
          <Select
            id="entity-type"
            closeMenuOnSelect
            placeholder={`${t("onboarding:Select Entity Type")}`}
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
            value={values.entityType}
            options={ENTITY_TYPES}
            onChange={(selected) => {
              setFieldValue("entityType", selected, true);
              if (selected.value === "SERVICE_PROVIDER") {
                setFieldValue("selfAssessment", "", true);
              }
            }}
          />
          {values?.entityType?.value === "CLIENT" ? (
            <Fragment>
              <p className={style.labelText}>
                {regionSwitcher({
                  ae: t("onboarding:How do you self-assess your entity?"),
                  sa: t("onboarding:Entity/Individual Self-Assessment"),
                })}
              </p>
              {regionSwitcher({
                ae: (
                  <OptionWithCallout
                    setFieldValue={setFieldValue}
                    name="Market Counter Party"
                    selected={values.selfAssessment === "Market Counter Party"}
                    label={t("onboarding:Market Counter-Party")}
                    calloutText={t("onboarding:MCP_CALLOUT")}
                  />
                ),
              })}
              {regionSwitcher({
                sa: (
                  <OptionWithCallout
                    setFieldValue={setFieldValue}
                    name="Qualified Client"
                    selected={values.selfAssessment === "Qualified Client"}
                    label={t("onboarding:Qualified Client")}
                    calloutText={t("onboarding:QC_CALLOUT")}
                  />
                ),
                ae: (
                  <OptionWithCallout
                    setFieldValue={setFieldValue}
                    name="Deemed Professional Client"
                    selected={values.selfAssessment === "Deemed Professional Client"}
                    label={t("onboarding:Deemed Professional Client")}
                    calloutText={t("onboarding:DPC_CALLOUT")}
                  />
                ),
              })}

              {regionSwitcher({
                sa: (
                  <OptionWithCallout
                    setFieldValue={setFieldValue}
                    name="Institutional Client"
                    selected={values.selfAssessment === "Institutional Client"}
                    label={t("onboarding:Institutional Client")}
                    calloutText={t("onboarding:IC_CALLOUT")}
                  />
                ),
                ae: (
                  <OptionWithCallout
                    setFieldValue={setFieldValue}
                    name="Assessed Professional Client"
                    selected={values.selfAssessment === "Assessed Professional Client"}
                    label={t("onboarding:Assessed Professional Client")}
                    calloutText={t("onboarding:APC_CALLOUT")}
                  />
                ),
              })}

              {regionSwitcher({
                sa: (
                  <OptionWithCallout
                    setFieldValue={setFieldValue}
                    name="Retail Client"
                    selected={values.selfAssessment === "Retail Client"}
                    label={t("onboarding:Retail Client")}
                    calloutText={t("onboarding:RC_CALLOUT_SA")}
                  />
                ),
                ae: (
                  <OptionWithCallout
                    setFieldValue={setFieldValue}
                    name="Retail Client"
                    selected={values.selfAssessment === "Retail Client"}
                    label={t("onboarding:Retail Client")}
                    calloutText={t("onboarding:RC_CALLOUT_AE")}
                  />
                ),
              })}
            </Fragment>
          ) : (
            ""
          )}

          {values?.entityType?.value === "SERVICE_PROVIDER" ? (
            <Fragment>
              <div className="mt-5" />
              {regionSwitcher({
                sa: (
                  <OptionWithCallout
                    setFieldValue={setFieldValue}
                    name="Capital Market Institution"
                    selected={values.selfAssessment === "Capital Market Institution"}
                    label={t("onboarding:Capital Market Institution")}
                    calloutText={t("onboarding:CMI_CALLOUT")}
                  />
                ),
              })}
              {regionSwitcher({
                sa: (
                  <OptionWithCallout
                    setFieldValue={setFieldValue}
                    name="Other"
                    selected={values.selfAssessment === "Other"}
                    label={t("onboarding:Other")}
                  />
                ),
              })}
            </Fragment>
          ) : (
            ""
          )}

          <div className={style.acceptTerms}>
            <Checkbox label="" name="acceptedTermsStatus" />
            <p className={style.labelText}>
              {t("onboarding:I have reviewed and accept the")}
              <a
                href={regionSwitcher({
                  sa: "https://objectstorage.me-jeddah-1.oraclecloud.com/n/ax6tx9bvvc5i/b/wethaq-assets/o/documents%2Fplatform_terms_of_use_sa.pdf",
                  ae: "https://wethaq-assets.s3.ap-south-1.amazonaws.com/documents/platform_terms_of_use.pdf",
                })}
                target="_blank"
                rel="noreferrer"
                className={style.labelLinkText}
              >
                {t("onboarding:Platform Terms of Use")}
              </a>
            </p>
          </div>
          <Flex>
            <p className={style.termsText}>
              {regionSwitcher({
                sa: t("onboarding:TERMS_TEXT_SA"),
                ae: t("onboarding:TERMS_TEXT_AE"),
              })}
            </p>
          </Flex>
        </div>
      )}
    </Form>
  );
};

const Onboarding = () => {
  const { t } = useTranslation(["onboarding"]);
  const queryParams = useQuery();
  const token = queryParams.get("token");
  const email = queryParams.get("email");
  const [formPage, setFormPage] = useState(1);
  const dispatch = useDispatch();

  const { country, restrictedJurisdiction } = useSelector(selectors.selectDropdowns);
  const isFetchingDropdownOptions = useSelector(selectors.selectisFetchingDropdowns);

  const handleSuccess = () => {
    setFormPage(3);
  };

  const handleFormSubmit = (submittedValues, resetForm) => {
    const payload = {
      data: {
        entityEmail: submittedValues.entityEmail,
        entityName: submittedValues.entityName,
        entityType: submittedValues.entityType.value,
        firstName: submittedValues.firstName,
        jurisdiction: submittedValues.jurisdiction?.value?.name,
        lastName: submittedValues.lastName,
        middleName: submittedValues.middleName,
        selfAssessment: submittedValues.selfAssessment,
        token: token || undefined,
      },
      successCallback: handleSuccess,
    };

    const showJurisdictionError = restrictedJurisdiction?.filter(
      (obj) => obj.name === submittedValues.jurisdiction.value.name
    ).length;

    if (showJurisdictionError) {
      resetForm();
      setFormPage(5);
    } else if (submittedValues.selfAssessment === "Retail Client") {
      resetForm();
      setFormPage(4);
    } else {
      dispatch(actionCreators.doInvitePublicRequest(payload));
    }
  };

  useEffect(() => {
    const fetchFormOptions = (payload) => dispatch(actionCreators.doFetchDropdownRequest(payload));
    fetchFormOptions({
      options: ["restrictedJurisdiction", "country"],
    });
  }, [dispatch]);

  if (isFetchingDropdownOptions) {
    return <LoadingPage disableSidebarOffset />;
  }

  return (
    <div className={style.container}>
      <Formik
        initialValues={{
          firstName: "",
          middleName: "",
          lastName: "",
          entityEmail: email || "",
          entityName: "",
          selfAssessment: "",
          jurisdiction: "",
          entityType: "",
          acceptedTermsStatus: null,
          token: token || null,
        }}
        validationSchema={onboardingFormSchema}
      >
        {({ values, setFieldValue, resetForm, isValid, dirty }) => (
          <Fragment>
            {formPage === 3 ? (
              <SubmissionSuccess email={values.entityEmail} />
            ) : (
              <Fragment>
                <div className={style.modalContainer}>
                  {formPage === 1 ? (
                    <div>
                      <h1 className={style.header}>{t("onboarding:Join the Emrgo Platform")}</h1>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className={style.formContainer}>
                    <OnboardingForm
                      countries={country}
                      restrictedCountries={restrictedJurisdiction}
                      formPage={formPage}
                      values={values}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                  {formPage === 4 ? <RetailClientMessage /> : ""}
                  {formPage === 5 ? <SanctionedCountryMessage /> : ""}
                </div>
                <div className={style.formNav}>
                  {formPage === 1 ? (
                    <Button
                      onClick={() => {
                        setFormPage(2);
                      }}
                      color="primary"
                    >
                      {t("onboarding:Next")}
                    </Button>
                  ) : (
                    ""
                  )}
                  {formPage === 2 ? (
                    <Fragment>
                      <Button
                        onClick={() => {
                          setFormPage(1);
                        }}
                        color="primary"
                        variant="text"
                      >
                        {t("onboarding:Back")}
                      </Button>
                      <Button
                        onClick={() => {
                          handleFormSubmit(values, resetForm);
                        }}
                        disabled={!(dirty && isValid && values.acceptedTermsStatus)}
                        color="primary"
                      >
                        {t("onboarding:Submit")}
                      </Button>
                    </Fragment>
                  ) : (
                    ""
                  )}
                  {formPage === 4 || formPage === 5 ? (
                    <Button
                      onClick={() => {
                        setFormPage(1);
                      }}
                      color="primary"
                    >
                      {t("onboarding:Go back to the website")}
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </Fragment>
            )}
          </Fragment>
        )}
      </Formik>
    </div>
  );
};

export default Onboarding;
