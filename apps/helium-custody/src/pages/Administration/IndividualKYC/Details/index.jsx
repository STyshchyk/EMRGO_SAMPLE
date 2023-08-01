import { Fragment, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Select from "react-select";

import MomentUtils from "@date-io/moment";
import { mdiAccountCheckOutline, mdiCancel, mdiLockOpenOutline } from "@mdi/js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import moment from "moment";
import QRCode from "qrcode.react";

import appConfig from "../../../../appConfig";
import ErrorBanner from "../../../../components/ErrorBanner";
import FileUploadField from "../../../../components/FileUploadField";
import routes from "../../../../constants/routes";
import { useTheme } from "../../../../context/theme-context";
import regionSwitcher from "../../../../helpers/regions";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as authActionCreators from "../../../../redux/actionCreators/auth";
import * as kycActionCreators from "../../../../redux/actionCreators/kyc";
import * as supportActionCreators from "../../../../redux/actionCreators/support";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as kycSelectors from "../../../../redux/selectors/kyc";
import * as supportSelectors from "../../../../redux/selectors/support";
import selectStyles from "../../../../styles/cssInJs/reactSelect";
import { delay, getDropdownValues } from "../../../../utils/form";
import { kycSchema } from "../../../../validationSchemas";
import style from "./style.module.scss";

const ACCEPTABLE_FILE_TYPES = ".pdf";

const buildAbsherURL = (baseURL, successURL, errorURL, currentEntityGroupID) => {
  const params = `redirectUri=${successURL}&errorUri=${errorURL}&currentGroupId=${currentEntityGroupID}`;
  const encodededParams = encodeURI(params);
  const url = `${baseURL}v1/auth/elmAuth?${encodededParams}`;
  return url;
};

const processKSAState = (state) => {
  let defaultState = "externalAuth";
  if (state) {
    if (state === "success") {
      defaultState = "individualKYC";
    } else {
      defaultState = "authFailure";
    }
  }
  return defaultState;
};

const useQuery = () => new URLSearchParams(useLocation().search);

const Details = () => {
  const { t } = useTranslation(["kyc", "auth", "translation"]);
  // const { entityId } = useParams();
  // const { entityId } = { entityId: 'fc03987a-bf95-496a-a538-534852cbc30a' };
  const query = useQuery();
  const state = query.get("state");
  const dispatch = useDispatch();
  const { baseAPIURL } = appConfig;

  const [showRaiseTicketModal, setRaiseTicketModal] = useState(false);
  const defaultState = regionSwitcher({
    sa: processKSAState(state),
    ae: "individualKYC",
  });
  const location = useLocation();
  const windowLocation = window.location;
  const [individualKYCState, setIndividualKYCState] = useState(defaultState); // landingPage, externalAuth, individualKYC, MFASetup, authFailure
  const userAuth = useSelector(authSelectors.selectAuthenticatedUserObject);
  const authCredentials = useSelector(authSelectors.selectAuthCredentials);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isRequesting = useSelector(authSelectors.selectIsRequesting);
  const supportTicketTypes = useSelector(supportSelectors.selectSupportTicketTypeDropdowns);
  const filesUploaded = useSelector(supportSelectors.selectFilesUploaded);
  const MFAPath = useSelector(authSelectors.selectMFAPath);
  const dropdowns = useSelector(kycSelectors.selectdropdownData);
  const isMFAsetup = userAuth.MFAEnabled;
  const currentEntityGroupID = currentEntityGroup?.id;
  const entityId = currentEntityGroup?.entity?.id;
  const absherURL = buildAbsherURL(
    baseAPIURL,
    `${windowLocation.origin}${location.pathname}?state=success`,
    `${windowLocation.origin}${location.pathname}?state=error`,
    currentEntityGroupID
  );
  const { theme } = useTheme();
  const { locale } = theme;

  const keyIndividualCapacity = getDropdownValues(dropdowns?.keyIndividualCapacity, locale);

  const filteredCapacity = [
    ...new Map(keyIndividualCapacity.map((item) => [item.label, item])).values(),
  ];

  const TFATicketType = supportTicketTypes?.filter((type) => type.name === "MFA reset")[0];

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    dispatch(
      kycActionCreators.doFetchKYCData({
        entityId,
        requestPayload: {
          keys: ["individualDetails"],
          includeSignedUrl: true,
        },
      })
    );

    dispatch(kycActionCreators.doFetchDropdowns({ options: ["keyIndividualCapacity"] }));
  }, [entityId, dispatch]);

  const initiateIndividualKYC = () => {
    regionSwitcher({
      sa: () => {
        setIndividualKYCState("externalAuth");
      },
      ae: () => {
        setIndividualKYCState("individualKYC");
      },
    });
  };

  useEffect(() => {
    regionSwitcher({
      sa: () => {
        if (individualKYCState === "individualKYC") {
          dispatch(kycActionCreators.doFetchElmUser());
        }
      },
      ae: () => {},
    });
  }, [individualKYCState, dispatch]);

  useEffect(() => {
    const fetchMFAPath = (payload) => dispatch(authActionCreators.doFetchMFAPath(payload));
    fetchMFAPath();
  }, [dispatch]);

  const submitToken = ({ otp }) => {
    const payload = { otp };
    dispatch(authActionCreators.doSetupMFA(payload));
  };

  const handleLogoutClick = (payload) => dispatch(authActionCreators.doLogoutUser(payload));

  const raiseTicket = () => {
    const requestPayload = {
      email: authCredentials.email,
      type: TFATicketType.name,
      file: filesUploaded?.documentId.key,
    };
    dispatch(supportActionCreators.doCreateTFATicket(requestPayload));
    setRaiseTicketModal(false);
  };

  const handleFileUpload = (params) => {
    const { files, keyName } = params;
    const payload = {
      requestPayload: {
        originalFileName: files[0]?.name,
        email: authCredentials.email,
      },
      file: files[0],
      keyName,
    };

    dispatch(supportActionCreators.doUploadTFADocument(payload));
  };

  const buildRequestPayload = (form) => ({
    ...form,
    typeId: form.typeId.value,
    // documentId: filesUploaded?.documentId.key,
  });

  const kycData = useSelector(kycSelectors.selectKYCData);
  const isFetching = useSelector(kycSelectors.selectIsFetching);

  let elmUser = useSelector(kycSelectors.selectElmUser);
  regionSwitcher({
    sa: () => {},
    ae: () => {
      elmUser = true;
    },
  });
  const details = kycData?.individualKyc || {};

  const formData = regionSwitcher({
    sa: elmUser,
    ae: details,
  });

  const absherFields = [
    {
      fieldLabel: "First Name",
      fieldName: "firstName",
      fieldNameAr: "firstName_ar",
      englishValue: "",
      arabicValue: "",
    },
    {
      fieldLabel: "Middle Name",
      fieldName: "middleName",
      fieldNameAr: "middleName_ar",
      englishValue: "",
      arabicValue: "",
    },
    {
      fieldLabel: "Last Name",
      fieldName: "lastName",
      fieldNameAr: "lastName_ar",
      englishValue: "",
      arabicValue: "",
    },
    {
      fieldLabel: "Birth Date",
      fieldName: "dob",
      fieldNameAr: "dob_ar",
      englishValue: "",
      arabicValue: "",
    },
  ];

  const formFields = regionSwitcher({
    sa: [
      {
        fieldLabel: "Gender",
        fieldKey: "gender",
        type: "text",
        readOnly: true,
      },

      {
        fieldLabel: "ID Number",
        fieldKey: "idNumber",
        type: "text",
        readOnly: true,
      },
      {
        fieldLabel: "Nationality",
        fieldKey: "nationality",
        type: "text",
        readOnly: true,
      },
      {
        fieldLabel: "Mobile Number",
        fieldKey: "mobileNumber",
        type: "text",
      },
      {
        fieldLabel: "Passport Number",
        fieldKey: "passportNumber",
        type: "text",
      },
      {
        fieldLabel: "Passport Expiry",
        fieldKey: "passportExpiry",
        type: "date",
        minDate: moment(),
      },
      {
        fieldLabel: "Designation",
        fieldKey: "designation",
        type: "text",
      },
      {
        fieldLabel: "Corporate Email",
        fieldKey: "corporateEmail",
        type: "text",
      },
    ],
    ae: [
      {
        fieldLabel: "First Name",
        fieldKey: "firstName",
        type: "text",
      },
      {
        fieldLabel: "Middle Name",
        fieldKey: "middleName",
        type: "text",
      },
      {
        fieldLabel: "Last Name",
        fieldKey: "lastName",
        type: "text",
      },
      {
        fieldLabel: "Designation",
        fieldKey: "designation",
        type: "text",
      },
      {
        fieldLabel: "Corporate Email",
        fieldKey: "corporateEmail",
        type: "text",
      },
      {
        fieldLabel: "Mobile Number",
        fieldKey: "mobileNumber",
        type: "text",
      },
    ],
  });

  const initialValues = regionSwitcher({
    sa: {
      firstName: elmUser?.englishFirstName,
      firstName_ar: elmUser?.arabicFirstName,
      middleName: `${elmUser?.englishFatherName} ${elmUser?.englishGrandFatherName}`,
      middleName_ar: `${elmUser?.arabicFatherName} ${elmUser?.arabicGrandFatherName}`,
      lastName: elmUser?.englishFamilyName,
      lastName_ar: elmUser?.arabicFamilyName,
      gender: elmUser?.gender,
      gender_ar: elmUser?.gender,
      dob: moment(elmUser?.dob, "ddd MMM DD HH:mm:ss zz YYYY").format("DD/MM/YYYY"),
      dob_ar: elmUser?.dobHijri,
      idNumber: elmUser?.userid,
      idNumber_ar: elmUser?.userid,
      mobileNumber: elmUser?.mobileNumber || "",
      nationality: elmUser?.nationality || "",
      passportNumber: elmUser?.passportNumber || "",
      passportExpiry: elmUser?.passportExpiry || "",
      designation: elmUser?.designation || "",
      corporateEmail: elmUser?.corporateEmail || "",
    },
    ae: {
      capacity: details?.capacity,
      firstName: details?.firstName,
      middleName: details?.middleName,
      lastName: details?.lastName,
      designation: details?.designation,
      corporateEmail: details?.corporateEmail,
      mobileNumber: details?.mobileNumber,
    },
  });

  const validationSchema = regionSwitcher({
    sa: kycSchema.individualSchemaAr,
    ae: kycSchema.individualSchema,
  });

  return (
    <Fragment>
      {
        {
          landingPage: (
            <Fragment>
              <ErrorBanner
                title={t("auth:Click here to complete User KYC")}
                description=""
                icon={mdiAccountCheckOutline}
              />
              <Grid container justifyContent="center" className="mt-4">
                <Grid
                  xs={12}
                  sm={10}
                  md={8}
                  lg={5}
                  container
                  justifyContent="space-between"
                  className="pt-4"
                >
                  <Button
                    onClick={() => initiateIndividualKYC()}
                    variant="contained"
                    color="primary"
                  >
                    {t("auth:Buttons.Complete User KYC")}
                  </Button>
                  <Button onClick={handleLogoutClick} variant="outlined" color="primary">
                    {t("auth:Buttons.Logout")}
                  </Button>
                </Grid>
              </Grid>
            </Fragment>
          ),
          externalAuth: (
            <Fragment>
              <ErrorBanner
                title={t("auth:User Authentication")}
                description={t(
                  "auth:You will be transferred immediately to the National Single Sign-On page for authentication using your 'Absher' user name and password"
                )}
                icon={mdiLockOpenOutline}
              />

              <Grid container justifyContent="center" className="mt-4">
                <Grid xs={12} sm={10} md={8} lg={7}>
                  <Typography variant="h5" align="center">
                    <Trans i18nKey="auth:If you do not have an Absher account, you can create an account then try again later">
                      If you do not have an{" "}
                      <a
                        href="https://www.moi.gov.sa/wps/portal/Home/Home/!ut/p/z1/pZDBUoMwEEC_pQeu7EKAUG-ZzBjS4kh1UMzFCYrASEMnxTL-vVF709aDe9vd93Z2FxRUoIw-9K2e-tHoweUPKnlcbgTPsihci4AlyCQNr1HGgZAh3P8FKNeOecFlekUCUZQUw0sarXiyFndpdPRPAUj_5zvg08cTwdD56gvhgmURzRHTXMQoWVbeLDeEICNH4MwMdXZJd8NtY2AFqh3G-vunzNQkbUHZ5qWxjfXfrCt307TbX3jo4TzPvu3f9XOtzav_NG49_M3qxv0E1Q8YdtuyrLAvuuGQM7ZYfACvOWoi/dz/d5/L2dBISEvZ0FBIS9nQSEh/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Absher
                      </a>{" "}
                      account, you can{" "}
                      <a
                        href="https://www.absher.sa/portal/landing.html"
                        target="_blank"
                        rel="noreferrer"
                      >
                        create an account
                      </a>{" "}
                      then try again later
                    </Trans>
                  </Typography>
                </Grid>
                <Grid
                  xs={12}
                  sm={10}
                  md={8}
                  lg={7}
                  container
                  justifyContent="center"
                  className="pt-4"
                >
                  <Button href={absherURL} variant="contained" color="primary">
                    {t("auth:Buttons.Proceed to Absher")}
                  </Button>
                </Grid>
              </Grid>
            </Fragment>
          ),

          individualKYC: (
            <Grid container justifyContent="center">
              <Grid item xs={12} sm={12} md={10} lg={6}>
                {kycData && formData && !isFetching ? (
                  <Formik
                    initialValues={initialValues}
                    validateOnMount={false}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={(values, { setSubmitting }) => {
                      const updatedValues = { ...values, capacityId: values?.capacity?.value };

                      delete updatedValues.capacity;

                      const payload = {
                        entityId,
                        requestPayload: { individualDetails: updatedValues },
                        successCallback: () => {
                          setSubmitting(false);
                          setIndividualKYCState("MFASetup");
                          dispatch(authActionCreators.doFetchCurrentUserData());
                          // navigate(reverse(`${routes.dashboard.administration.entityDetails.kyc.entities.home}`));
                        },
                      };
                      dispatch(kycActionCreators.doPostKYCData(payload));
                    }}
                  >
                    {({ handleSubmit, values, setFieldValue }) => (
                      <form onSubmit={handleSubmit} noValidate className="mb-4">
                        <br></br>
                        <Grid container spacing={2}>
                          {regionSwitcher({
                            ae: (
                              <Grid item xs={12} lg={12} container>
                                <Grid item xs={12} md={4} lg={4} container alignContent="center">
                                  <Typography>
                                    {t(`kyc:Individuals Details.Form Fields.Capacity`)}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={8}
                                  lg={8}
                                  container
                                  alignContent="center"
                                  className="px-1 py-2"
                                >
                                  <FormControl className="w-full">
                                    <Select
                                      closeMenuOnSelect
                                      placeholder={t(
                                        "kyc:Individuals Details.Form Fields.Capacity"
                                      )}
                                      isSearchable
                                      styles={selectStyles}
                                      menuPortalTarget={document.body}
                                      value={values.capacity}
                                      isClearable
                                      options={filteredCapacity}
                                      onChange={(selected) => {
                                        setFieldValue("capacity", selected);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            ),
                            sa: absherFields.map((field) => (
                              <Grid key={field.fieldKey} item xs={12} lg={12} container>
                                <Grid item xs={12} md={4} lg={4} container alignContent="center">
                                  <Typography>
                                    {t(`kyc:Individuals Details.Form Fields.${field.fieldLabel}`)}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={4}
                                  lg={4}
                                  container
                                  alignContent="center"
                                  className="px-1 py-2"
                                >
                                  <Field
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                    component={TextField}
                                    label={t("kyc:Individuals Details.Form Fields.English")}
                                    name={field.fieldName}
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
                                  alignContent="center"
                                  className="px-1 py-2"
                                  style={{ paddingLeft: 20 }}
                                >
                                  <Field
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                    component={TextField}
                                    label={t("kyc:Individuals Details.Form Fields.Arabic")}
                                    name={field.fieldNameAr}
                                    variant="filled"
                                    type="text"
                                  />
                                </Grid>
                              </Grid>
                            )),
                          })}

                          {formFields.map((field) => (
                            <Grid key={field.fieldKey} item xs={12} lg={12} container>
                              <Grid item xs={12} md={4} lg={4} container alignContent="center">
                                <Typography>
                                  {t(`kyc:Individuals Details.Form Fields.${field.fieldLabel}`)}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={regionSwitcher({ sa: 4, ae: 8 })}
                                lg={regionSwitcher({ sa: 4, ae: 8 })}
                                container
                                alignContent="center"
                                className="px-1 py-2"
                              >
                                {
                                  {
                                    text: (
                                      <Field
                                        InputProps={{ readOnly: field.readOnly || false }}
                                        fullWidth
                                        component={TextField}
                                        label={t(
                                          `kyc:Individuals Details.Form Fields.${field.fieldLabel}`
                                        )}
                                        name={field.fieldKey}
                                        variant="filled"
                                        type="text"
                                      />
                                    ),
                                    date: (
                                      <Field
                                        fullWidth
                                        format="DD/MM/YYYY"
                                        inputVariant="filled"
                                        inputProps={{
                                          shrink: "true",
                                        }}
                                        minDate={field.minDate}
                                        maxDate={field.maxDate}
                                        variant="dialog"
                                        placeholder="DD/MM/YYYY"
                                        component={DatePicker}
                                        name={field.fieldKey}
                                      />
                                    ),
                                  }[field.type]
                                }
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          lg={12}
                          container
                          justifyContent="flex-end"
                          className="pt-4"
                        >
                          <Grid item xs={12} md={4} lg={3}>
                            <Button
                              onClick={handleSubmit}
                              fullWidth
                              variant="contained"
                              color="primary"
                            >
                              {t("auth:Buttons.Next")}
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    )}
                  </Formik>
                ) : (
                  <CircularProgress />
                )}
              </Grid>
            </Grid>
          ),

          MFASetup: (
            <Fragment>
              {isMFAsetup ? (
                <Fragment>
                  <ErrorBanner
                    title={t("auth:Multi-Factor Authentication enabled")}
                    description=""
                  />
                  <Grid container justifyContent="center">
                    <Grid item xs={12} md={6} container justifyContent="center" className="pt-8">
                      <Button
                        to={routes.dashboard.administration.entityManagement.users.home}
                        component={RouterLink}
                        variant="contained"
                        color="primary"
                      >
                        {t("auth:Buttons.Return to Dashboard")}
                      </Button>
                    </Grid>
                  </Grid>
                </Fragment>
              ) : (
                <Grid
                  container
                  justifyContent="center"
                  alignContent="flex-start"
                  className={style.container}
                >
                  <Grid
                    item
                    xs={12}
                    md={5}
                    container
                    direction="column"
                    justifyContent="flex-start"
                    alignContent="center"
                    className={style.container__section}
                  >
                    {isRequesting ? (
                      <CircularProgress />
                    ) : (
                      <Fragment>
                        <Box mt={2} mb={2}>
                          <Typography align="center" variant="h5">
                            {t("auth:Setup Two Factor Authentication ( 2FA )")}
                          </Typography>
                          <Typography align="center">
                            {t(
                              "auth:Scan the following QR Code with a two-factor authentication app on your phone"
                            )}
                          </Typography>
                        </Box>
                        <Grid container justifyContent="center">
                          {MFAPath ? <QRCode size={200} value={MFAPath} fgColor="#243871" /> : ""}
                        </Grid>
                        <Grid container justifyContent="center" className="pt-4">
                          <Typography className="text-red-500" variant="caption" align="center">
                            {t(
                              "auth:Download one of the supported applications through your mobile phone's App Store~ Google Authenticator, Microsoft Authenticator, Authy or any other 2FA supported app that you currently use"
                            )}
                          </Typography>
                        </Grid>
                      </Fragment>
                    )}
                  </Grid>

                  <Grid item xs={12} md={2} container justifyContent="center" alignContent="center">
                    <Divider orientation="vertical" className={style.divider} />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={5}
                    container
                    direction="column"
                    justifyContent="flex-start"
                    alignContent="center"
                    className={style.container__section}
                  >
                    <Formik
                      initialValues={{ otp: "" }}
                      onSubmit={(values) => {
                        submitToken(values);
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Fragment>
                          <Form className={style.form} data-testid="login-form">
                            <Box mt={2} mb={4}>
                              <Typography align="center" variant="h5">
                                {t("auth:Enter Security Code")}
                              </Typography>
                              <Typography align="center">
                                {t(
                                  "auth:Enter the security code generated by your two-factor authentication app"
                                )}
                                .
                                {t(
                                  "auth:You will be provided a new security code every 30 seconds"
                                )}
                              </Typography>
                            </Box>
                            <Box>
                              <OtpInput
                                value={values.otp}
                                onChange={(value) => setFieldValue("otp", value)}
                                isInputNum
                                numInputs={6}
                                shouldAutoFocus
                                renderSeparator={<span>-</span>}
                                renderInput={(props) => <input {...props} />}
                              />
                              <Box mb={2}>
                                <Button
                                  type="submit"
                                  disabled={values.otp.length !== 6}
                                  fullWidth
                                  variant="contained"
                                  color="primary"
                                >
                                  {t("auth:Buttons.Setup")}
                                </Button>
                              </Box>
                              <Grid container justifyContent="flex-end">
                                <Button onClick={() => setRaiseTicketModal(true)} color="primary">
                                  {t("auth:Buttons.Raise Support Ticket")}
                                </Button>
                              </Grid>
                            </Box>
                          </Form>
                        </Fragment>
                      )}
                    </Formik>
                  </Grid>
                </Grid>
              )}
              <Formik
                initialValues={initialValues}
                // isInitialValid={false}
                onSubmit={async (values, actions) => {
                  const bulletinPayload = buildRequestPayload(values);
                  raiseTicket(bulletinPayload);
                  await delay(1000);
                  actions.setSubmitting(false);
                  actions.resetForm();
                  setRaiseTicketModal(false);
                }}
              >
                {({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} noValidate>
                    <Dialog
                      open={showRaiseTicketModal}
                      onClose={() => setRaiseTicketModal(false)}
                      maxWidth="sm"
                      fullWidth
                    >
                      <DialogTitle id="alert-dialog-title">
                        {t("auth:Reset 2FA Modal.Raise 2FA Ticket")}
                      </DialogTitle>
                      <DialogContent dir={locale.rtl ? "rtl" : "ltr"}>
                        <DialogContentText id="alert-dialog-description">
                          {t(
                            "auth:Reset 2FA Modal.Do you want to raise a ticket to Emrgo support to reset your 2 Factor Authentication credentials"
                          )}
                          .
                          {t(
                            "auth:Reset 2FA Modal.Only do this when you have lost access to your authenticator app"
                          )}
                          .
                          {t(
                            "auth:Reset 2FA Modal.Admin will use the file you upload to verify your account"
                          )}
                          .
                        </DialogContentText>
                        <Box>
                          <FileUploadField
                            label={t("auth:Reset 2FA Modal.Identity Proof")}
                            // isLoading={filesUploadInProgress}
                            name="documentId"
                            fullWidth
                            acceptableFileTypes={ACCEPTABLE_FILE_TYPES}
                            customHandleChange={(e) =>
                              handleFileUpload({ files: e, keyName: "documentId" })
                            }
                          />
                        </Box>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => {
                            setRaiseTicketModal(false);
                          }}
                          color="primary"
                        >
                          {t("auth:Reset 2FA Modal.Cancel")}
                        </Button>
                        <Button onClick={raiseTicket} variant="contained" color="primary">
                          {t("auth:Reset 2FA Modal.Yes, Reset it")}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </form>
                )}
              </Formik>
            </Fragment>
          ),

          authFailure: (
            <Fragment>
              <ErrorBanner
                title={t("auth:Absher Authentication Failed")}
                description={t(
                  "auth:Something went wrong during your Absher authentication Please verify your credentials and try again"
                )}
                icon={mdiCancel}
              />
              <Grid container justifyContent="center" className="mt-8">
                <Button
                  onClick={() => {
                    setIndividualKYCState("externalAuth");
                  }}
                  variant="contained"
                  color="primary"
                >
                  {t("auth:Buttons.Try Again")}
                </Button>
              </Grid>
            </Fragment>
          ),
        }[individualKYCState]
      }
    </Fragment>
  );
};

export default Details;
