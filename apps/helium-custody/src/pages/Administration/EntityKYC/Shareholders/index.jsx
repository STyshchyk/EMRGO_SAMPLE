import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast } from "react-toastify";

import MomentUtils from "@date-io/moment";
import MaterialTable from "@material-table/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ErrorMessage, Field, Formik } from "formik";
import { RadioGroup, TextField } from "formik-mui";
import moment from "moment";

import ChangeRequest from "../../../../components/ChangeRequest";
import FileUploadField from "../../../../components/FileUploadField";
import LoadingPage from "../../../../components/LoadingPage";
import MaterialTableOverflowMenu from "../../../../components/MaterialTableOverflowMenu";
import RegionSwitch from "../../../../components/RegionSwitch";
import Required from "../../../../components/Required";
import StyledPageTitle from "../../../../components/StyledPageTitle";
import UnsavedFormDataGuard from "../../../../components/UnsavedFormDataGuard";
import DEFAULT_ACCEPTABLE_FILE_TYPES from "../../../../constants/documents/kyc";
import { tooltipRenderer } from "../../../../constants/paymentAndStatuses/renderers";
import { useTheme } from "../../../../context/theme-context";
import normalisedCountries from "../../../../helpers/countries";
import regionSwitcher from "../../../../helpers/regions";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as kycActionCreators from "../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as kycSelectors from "../../../../redux/selectors/kyc";
import tableStyles from "../../../../styles/cssInJs/materialTable";
import selectStyles from "../../../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../../../utils/form";
import { kycSchema } from "../../../../validationSchemas";

const animatedComponents = makeAnimated();

const Shareholders = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["translation", "kyc", "components"]);
  const { theme } = useTheme();
  const { entityId } = useParams();
  const { locale } = theme;
  const mtableLocalization = useMaterialTableLocalization();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const isEdit = selectedRow !== null;
  const [shareholdingIndividualModalOpen, setShareholdingIndividualModalOpen] = useState(false);
  const [shareholdingEntityModalOpen, setShareholdingEntityModalOpen] = useState(false);
  const [deleteShareholderModalOpen, setDeleteShareholderModalOpen] = useState(false);

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const entityType = currentEntityGroup?.entityType;
  const hasManageKYCAccessControl = currentEntityGroup?.accessControls.some(
    (acl) => acl?.key === "KYC/Manage"
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
          keys: ["shareholdingEntities", "shareholders"],
          includeSignedUrl: true,
          sectionChanges: "shareholders",
        },
      })
    );
  };

  useEffect(() => {
    dispatch(kycActionCreators.doFetchDropdowns({ options: ["country"] }));
    fetchPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  const dropdowns = useSelector(kycSelectors.selectdropdownData);
  const kycData = useSelector(kycSelectors.selectKYCData);
  const kycFileData = useSelector(kycSelectors.selectFilesUploaded);
  const fetchingKYCData = useSelector(kycSelectors.selectIsFetchingKycData);
  const fetchingDropdownOptions = useSelector(kycSelectors.selectIsFetching);

  const countriesDropdown = normalisedCountries(dropdowns?.country);
  const countries = getDropdownValues(countriesDropdown, locale);

  const selectedCountry = countries?.find((country) => country?.value === selectedRow?.country?.id);

  const handleFileUpload = (params) => {
    const { files, keyName, multiple = false } = params;
    const payload = {
      entityId,
      requestPayload: {
        originalFileName: files[0]?.name,
        name: keyName,
      },
      file: multiple ? files : files[0],
      multiple,
      keyName,
    };
    dispatch(kycActionCreators.doUploadKycFile(payload));
  };

  const handleModifyClick = () => {
    if (selectedRow?.type === "Entity") {
      setShareholdingEntityModalOpen(true);
    } else {
      setShareholdingIndividualModalOpen(true);
    }
  };

  const handleDeleteClick = () => {
    setDeleteShareholderModalOpen(true);
  };

  const deleteShareholder = () => {
    let requestPayload;
    if (selectedRow?.type === "Entity") {
      // const currentEntityShareholders = kycData?.shareholdingEntities;
      // const filteredShareholders = currentEntityShareholders.filter((shareholder) => shareholder.id !== selectedRow?.id);
      requestPayload = { shareholdingEntities: [{ id: selectedRow?.id }] };
    } else {
      // const currentIndividualShareholders = kycData?.shareholders;
      // const filteredShareholders = currentIndividualShareholders.filter((shareholder) => shareholder.id !== selectedRow?.id);
      requestPayload = { shareholders: [{ id: selectedRow?.id }] };
    }
    const payload = {
      entityId,
      requestPayload,
      successCallback: () => {
        fetchPageData();
        setDeleteShareholderModalOpen(false);
      },
    };
    dispatch(kycActionCreators.doPostKYCData(payload));
  };

  const actions = [
    {
      callback: handleModifyClick,
      icon: <EditIcon fontSize="small" />,
      label: t("kyc:Shareholders.Table.Modify"),
    },
    {
      callback: handleDeleteClick,
      icon: <DeleteIcon fontSize="small" />,
      label: t("kyc:Shareholders.Table.Delete"),
    },
  ];

  const getYesNoValue = (val) => {
    if (val === true) {
      return "Yes";
    }
    if (val === false) {
      return "No";
    }
    return null;
  };

  const headCells = [
    {
      title: t("kyc:Shareholders.Table.Individual/Entity"),
      field: "type",
      width: 120,
    },
    {
      title: t("kyc:Shareholders.Table.Name"),
      field: "firstName",
      width: 150,
      render: (rowData) =>
        rowData?.type === "Entity"
          ? rowData?.name
          : `${rowData?.firstName} ${rowData?.middleName} ${rowData?.lastName}`,
    },
    {
      title: t("kyc:Shareholders.Table.Address"),
      field: "address",
      width: 200,
      render: (rowData) => {
        const address = `${rowData?.addressLine1}, ${rowData?.addressLine2}, ${rowData?.city}, , ${rowData?.country?.name}, ${rowData?.pinCode}`;
        return tooltipRenderer(address, address);
      },
    },

    {
      title: t("kyc:Shareholders.Table.PEP"),
      field: "pep",
      width: 100,
      render: (rowData) => getYesNoValue(rowData?.politicallyExposed),
    },
    {
      title: t("kyc:Shareholders.Table.Shareholding %"),
      field: "shareHoldingPercentage",
      width: 100,
    },
  ];

  const entityShareholders =
    kycData?.shareholdingEntities?.map((entity) => {
      const extensibleEntity = { ...entity, type: "Entity" };
      return extensibleEntity;
    }) || [];
  const individualShareholders =
    kycData?.shareholders?.map((entity) => {
      const extensibleEntity = { ...entity, type: "Individual" };
      return extensibleEntity;
    }) || [];

  const shareholders = [...entityShareholders, ...individualShareholders];

  const processShareholderFormData = (formData) => {
    const processData = {
      ...formData,
      changeRequests: { ...formData.changeRequests },
      publiclyListed: formData?.publiclyListed === null ? null : formData?.publiclyListed === "yes",
      publiclyListedShareholderWithTwentyFiveOrMoreInterest:
        formData?.publiclyListedShareholderWithTwentyFiveOrMoreInterest === null
          ? null
          : formData?.publiclyListedShareholderWithTwentyFiveOrMoreInterest === "yes",
    };

    delete processData.changeRequests.test;

    if (processData.publiclyListed === null) delete processData?.publiclyListed;

    return processData;
  };

  if (fetchingKYCData || fetchingDropdownOptions) {
    return <LoadingPage />;
  }

  const validationSchema = regionSwitcher({
    sa: kycSchema.shareholdingIndividualSchemaKSA,
    ae: kycSchema.shareholdingIndividualSchema,
  });

  return (
    <Fragment>
      <MuiPickersUtilsProvider utils={MomentUtils} locale={theme.locale.altLocale}>
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12}>
            <StyledPageTitle
              title={t("kyc:Shareholders.Shareholders / Ultimate Beneficial Owners")}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">
              {t(
                "kyc:Shareholders.Please provide details of shareholders (individuals and companies) and identify all UBO individuals"
              )}
            </Typography>
          </Grid>
        </Grid>
        {kycData ? (
          <Formik
            initialValues={{
              // eslint-disable-next-line no-nested-ternary
              publiclyListed:
                kycData?.publiclyListed !== null ? (kycData?.publiclyListed ? "yes" : "no") : null,
              publiclyListedExchange: kycData?.publiclyListedExchange || "",
              publiclyListedExchangeWebsite: kycData?.publiclyListedExchangeWebsite || "",
              publiclyListedExchangeTicker: kycData?.publiclyListedExchangeTicker || "",
              publiclyListedExchangeListedDate: kycData?.publiclyListedExchangeListedDate,
              publiclyListedShareholderWithTwentyFiveOrMoreInterest:
                // eslint-disable-next-line no-nested-ternary
                kycData?.publiclyListedShareholderWithTwentyFiveOrMoreInterest !== null
                  ? kycData?.publiclyListedShareholderWithTwentyFiveOrMoreInterest
                    ? "yes"
                    : "no"
                  : null,

              changeRequests: kycData?.sectionChanges
                ? kycData?.sectionChanges.changesRequested
                : {},
            }}
            validateOnMount={false}
            onSubmit={(values, { setSubmitting }) => {
              const shareholdersSubmitData = processShareholderFormData(values);

              const isLocked = isComplianceOfficer
                ? Object.keys(shareholdersSubmitData.changeRequests).length === 0
                : true;

              shareholdersSubmitData.updateSection = {
                sectionKey: "shareholders",
                changesRequested: shareholdersSubmitData.changeRequests,
                isLocked,
              };

              const payload = {
                entityId,
                requestPayload: shareholdersSubmitData,
                successCallback: () => {
                  setSubmitting(false);
                  fetchPageData();
                },
              };
              dispatch(kycActionCreators.doPostKYCData(payload));
            }}
          >
            {({ handleSubmit, values, setFieldValue, isSubmitting, dirty }) => {
              const saveForm = () => {
                const shareholdersSaveData = processShareholderFormData(values);

                const payload = {
                  entityId,
                  requestPayload: shareholdersSaveData,
                  successCallback: () => {
                    fetchPageData();
                  },
                };
                dispatch(kycActionCreators.doPostKYCData(payload));
              };

              // const addShareholdingEntity = () => {
              // };

              return (
                <form onSubmit={handleSubmit} noValidate className="pb-16 py-8">
                  {/* <UnsavedFormDataGuard dirty={dirty && !kycData?.sectionChanges?.isLocked} /> */}
                  <Grid container>
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
                                disabled={kycData?.sectionChanges?.isLocked || !dirty}
                                onClick={() => {
                                  saveForm();
                                }}
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
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(
                          `kyc:Shareholders.Form Fields.Is the Entity ( or its holding company or subsidiary ) publicly listed?`
                        )}
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
                      <Field component={RadioGroup} name="publiclyListed">
                        <FormControlLabel
                          value="yes"
                          control={<Radio disabled={isSubmitting} />}
                          label={t(`kyc:Shareholders.Yes`)}
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio disabled={isSubmitting} />}
                          label={t(`kyc:Shareholders.No`)}
                          disabled={isSubmitting}
                        />
                      </Field>
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
                        fieldKey="publiclyListed"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-8">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(
                          `kyc:Shareholders.Form Fields.If yes, provide details of the exchange the Entity is listed on`
                        )}
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
                      <div className="w-full">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Shareholders.Form Fields.Name of the Exchange`)}
                          name="publiclyListedExchange"
                          variant="filled"
                          type="text"
                        />
                      </div>
                      <div className="mt-4 w-full">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Shareholders.Form Fields.Website of the Exchange`)}
                          name="publiclyListedExchangeWebsite"
                          variant="filled"
                          type="text"
                        />
                      </div>
                      <div className="mt-4 w-full">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t(`kyc:Shareholders.Form Fields.Ticker / ISIN`)}
                          name="publiclyListedExchangeTicker"
                          variant="filled"
                          type="text"
                        />
                      </div>
                      <div className="mt-4 w-full">
                        <Field
                          fullWidth
                          format="DD/MM/YYYY"
                          inputVariant="filled"
                          inputProps={{
                            shrink: "false",
                          }}
                          variant="dialog"
                          maxDate={moment()}
                          placeholder="DD/MM/YYYY"
                          component={DatePicker}
                          name="publiclyListedExchangeListedDate"
                          label={t("kyc:Shareholders.Form Fields.Date Listed")}
                        />
                      </div>
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
                        fieldKey="exchangeEntityListedOn"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={4} lg={4} container alignContent="flex-start">
                      {values.publiclyListedShareholderWithTwentyFiveOrMoreInterest === "yes" ? (
                        <Typography className="mt-4">
                          {t(
                            `kyc:Shareholders.Form Fields.If yes, are there any shareholders/controller with 25% or more interest?`
                          )}
                        </Typography>
                      ) : (
                        <Typography className="mt-4">
                          {t(
                            `kyc:Shareholders.Form Fields.If yes, are there any shareholders/controller with 10% or more interest?`
                          )}
                        </Typography>
                      )}
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
                        component={RadioGroup}
                        name="publiclyListedShareholderWithTwentyFiveOrMoreInterest"
                      >
                        <FormControlLabel
                          value="yes"
                          control={<Radio disabled={isSubmitting} />}
                          label={t(`kyc:Shareholders.Yes`)}
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio disabled={isSubmitting} />}
                          label={t(`kyc:Shareholders.No`)}
                          disabled={isSubmitting}
                        />
                      </Field>
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
                        fieldKey="shareholdersWithMoreThan25Percent"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container>
                    <Grid item xs={12} md={8} lg={8} container alignContent="flex-start">
                      {values.publiclyListedShareholderWithTwentyFiveOrMoreInterest === "yes" ? (
                        <Typography variant="caption">
                          *
                          {t(
                            `kyc:Shareholders.Form Fields.Please list below shareholders/UBOs with 25% interest or more`
                          )}
                        </Typography>
                      ) : (
                        <Typography variant="caption">
                          *
                          {t(
                            `kyc:Shareholders.Form Fields.Please list below shareholders/UBOs with 10% interest or more`
                          )}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={12} container justifyContent="flex-end" className="mt-8">
                    <Grid item xs={12} md={6} lg={3} className="px-1">
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => {
                          if (dirty) {
                            toast.warning(
                              "You have unsaved changes. Please save changes before adding shareholding entity",
                              2000
                            );
                          } else {
                            setShareholdingEntityModalOpen(true);
                          }
                        }}
                      >
                        {t("kyc:Shareholders.Form Fields.Add Shareholding Entity")}
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} className="px-1">
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => {
                          if (dirty) {
                            toast.warning(
                              "You have unsaved changes. Please save changes before adding shareholding individual",
                              2000
                            );
                          } else {
                            setShareholdingIndividualModalOpen(true);
                          }
                        }}
                      >
                        {t("kyc:Shareholders.Form Fields.Add Shareholding Individual")}
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={12} className="pt-8">
                    <MaterialTable
                      size="small"
                      title=""
                      columns={headCells}
                      data={shareholders}
                      options={{
                        ...tableStyles,
                        searchFieldVariant: "filled",
                        pageSize: 5,
                        actionsColumnIndex: -1,
                        tableLayout: "fixed",
                        toolbar: false,
                        paging: false,
                      }}
                      actions={[
                        {
                          icon: "more_vert",
                          onClick: (event, rowData) => {
                            setMenuAnchorEl(event.currentTarget);
                            setSelectedRow(rowData);
                          },
                        },
                      ]}
                      localization={mtableLocalization}
                    />
                    <MaterialTableOverflowMenu
                      actions={actions}
                      anchorEl={menuAnchorEl}
                      setAnchorEl={setMenuAnchorEl}
                      selectedRow={selectedRow}
                    />
                  </Grid>

                  <Grid item xs={12} lg={12} container justifyContent="flex-end" className="mt-4">
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
                        fieldKey="shareholdersTable"
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
        <Dialog
          open={shareholdingIndividualModalOpen}
          onClose={() => {
            setShareholdingIndividualModalOpen(false);
            setSelectedRow(null);
          }}
          scroll="body"
          aria-labelledby="assign-role"
          maxWidth="sm"
          fullWidth
        >
          <MuiPickersUtilsProvider utils={MomentUtils} locale={theme.locale.altLocale}>
            <Formik
              initialValues={{
                shareHoldingPercentage: selectedRow?.shareHoldingPercentage || "",
                firstName: selectedRow?.firstName || "",
                middleName: selectedRow?.middleName || "",
                lastName: selectedRow?.lastName || "",
                // eslint-disable-next-line no-nested-ternary
                politicallyExposed:
                  selectedRow?.politicallyExposed !== null
                    ? selectedRow?.politicallyExposed
                      ? "yes"
                      : "no"
                    : null,
                addressLine1: selectedRow?.addressLine1 || "",
                addressLine2: selectedRow?.addressLine2 || "",
                city: selectedRow?.city || "",
                country: selectedRow?.country ? selectedCountry : null,
                pinCode: selectedRow?.pinCode || "",
                businessPhone: selectedRow?.businessPhone || "",
                saudiIdNumber: selectedRow?.saudiIdNumber || "",
                saudiIdExpiry: selectedRow?.saudiIdExpiry || null,
                passportNumber: selectedRow?.passportNumber || "",
                passportExpiry: selectedRow?.passportExpiry || null,
                passportCopyFileName: selectedRow?.passportCopyFileName?.name || null,
                addressProofFileName: selectedRow?.addressProofFileName?.name || null,
                saudiIdFileName: selectedRow?.saudiIdFileName?.name || null,
                shareholderProofFileName: selectedRow?.shareholderProofFileName?.name || null,
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                const processedValues = {
                  ...values,
                  countryId: values.country.value,
                  politicallyExposed:
                    values.politicallyExposed === null ? null : values.politicallyExposed === "yes",
                  passportCopyFileName:
                    kycFileData?.passportCopyFileName?.fileIdentifier ||
                    values.passportCopyFileName,
                  addressProofFileName:
                    kycFileData?.addressProofFileName?.fileIdentifier ||
                    values.addressProofFileName,
                  saudiIdFileName:
                    kycFileData?.saudiIdFileName?.fileIdentifier || values.saudiIdFileName,
                  shareholderProofFileName:
                    kycFileData?.shareholderProofFileName?.fileIdentifier ||
                    values.shareholderProofFileName,
                };
                delete processedValues?.country;

                let requestPayload;
                if (isEdit) {
                  const editObject = { ...processedValues, id: selectedRow?.id };
                  // const editFilteredArray = oldShareholdingIndividual.filter((entity) => entity.id !== selectedRow?.id);
                  requestPayload = { shareholders: [editObject] };
                } else {
                  requestPayload = { shareholders: [processedValues] };
                }

                const payload = {
                  entityId,
                  requestPayload,
                  successCallback: () => {
                    setSubmitting(false);
                    fetchPageData();
                    setShareholdingIndividualModalOpen(false);
                    setSelectedRow(null);
                  },
                };
                dispatch(kycActionCreators.doPostKYCData(payload));
                setSubmitting(false);
              }}
            >
              {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
                <form onSubmit={handleSubmit} noValidate>
                  <DialogTitle id="form-dialog-title">
                    {isEdit
                      ? t("kyc:Shareholders.Form Fields.Edit Shareholding Individual")
                      : t("kyc:Shareholders.Form Fields.Add Shareholding Individual")}
                  </DialogTitle>
                  <DialogContent>
                    <Box mb={2}>
                      <Grid container>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Shareholding Percentage`)}{" "}
                              <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              InputProps={{
                                type: "number",
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              }}
                              component={TextField}
                              label={t(`kyc:Shareholders.Form Fields.Shareholding Percentage`)}
                              name="shareHoldingPercentage"
                              variant="filled"
                              type="text"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.First Name`)} <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(`kyc:Shareholders.Form Fields.First Name`)}
                              name="firstName"
                              variant="filled"
                              type="text"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Middle Name`)}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(`kyc:Shareholders.Form Fields.Middle Name`)}
                              name="middleName"
                              variant="filled"
                              type="text"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Last Name`)} <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(`kyc:Shareholders.Form Fields.Last Name`)}
                              name="lastName"
                              variant="filled"
                              type="text"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Politically Exposed Person`)}{" "}
                              <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field component={RadioGroup} name="politicallyExposed">
                              <FormControlLabel
                                value="yes"
                                control={<Radio disabled={isSubmitting} />}
                                label={t(`kyc:Shareholders.Yes`)}
                                disabled={isSubmitting}
                              />
                              <FormControlLabel
                                value="no"
                                control={<Radio disabled={isSubmitting} />}
                                label={t(`kyc:Shareholders.No`)}
                                disabled={isSubmitting}
                              />
                            </Field>
                            <ErrorMessage
                              component={Typography}
                              variant="caption"
                              color="error"
                              className="ml-4"
                              name="politicallyExposed"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-8">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Address`)} <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <div className="w-full">
                              <Field
                                fullWidth
                                component={TextField}
                                label={t(`kyc:Shareholders.Form Fields.Address Line 1`)}
                                name="addressLine1"
                                variant="filled"
                                type="text"
                              />
                            </div>
                            <div className="mt-4 w-full">
                              <Field
                                fullWidth
                                component={TextField}
                                label={t(`kyc:Shareholders.Form Fields.Address Line 2`)}
                                name="addressLine2"
                                variant="filled"
                                type="text"
                              />
                            </div>
                            <div className="mt-4 w-full">
                              <Field
                                fullWidth
                                component={TextField}
                                label={t(`kyc:Shareholders.Form Fields.City`)}
                                name="city"
                                variant="filled"
                                type="text"
                              />
                            </div>
                            <div className="mt-4 w-full">
                              <FormControl className="w-full">
                                <Select
                                  closeMenuOnSelect
                                  isSearchable
                                  placeholder={`${t("kyc:Shareholders.Form Fields.Country")}`}
                                  components={{
                                    ...animatedComponents,
                                  }}
                                  styles={selectStyles}
                                  value={values.country}
                                  options={countries}
                                  onChange={(selected) => {
                                    setFieldValue("country", selected);
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
                            </div>
                            <div className="mt-4 w-full">
                              <Field
                                fullWidth
                                component={TextField}
                                label={t(`kyc:Shareholders.Form Fields.Post Code`)}
                                name="pinCode"
                                variant="filled"
                                type="text"
                              />
                            </div>
                            <div className="mt-4 w-full">
                              <Field
                                fullWidth
                                component={TextField}
                                label={t(`kyc:Shareholders.Form Fields.Telephone Number`)}
                                name="businessPhone"
                                variant="filled"
                                type="text"
                              />
                            </div>
                          </Grid>
                        </Grid>
                        <RegionSwitch
                          sa={
                            <Fragment>
                              <Grid item xs={12} lg={12} container className="mt-4">
                                <Grid
                                  item
                                  xs={12}
                                  md={6}
                                  lg={6}
                                  container
                                  alignContent="flex-start"
                                >
                                  <Typography className="mt-4">
                                    {t(`kyc:Shareholders.Form Fields.Iqama/Saudi ID Number`)}{" "}
                                    <Required />
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={6}
                                  lg={6}
                                  container
                                  alignContent="center"
                                  className="px-1"
                                >
                                  <Field
                                    fullWidth
                                    component={TextField}
                                    label={t(`kyc:Shareholders.Form Fields.Iqama/Saudi ID Number`)}
                                    name="saudiIdNumber"
                                    variant="filled"
                                    type="text"
                                  />
                                </Grid>
                              </Grid>
                              <Grid item xs={12} lg={12} container className="mt-4">
                                <Grid
                                  item
                                  xs={12}
                                  md={6}
                                  lg={6}
                                  container
                                  alignContent="flex-start"
                                >
                                  <Typography className="mt-4">
                                    {t(`kyc:Shareholders.Form Fields.Iqama/Saudi ID Expiry`)}{" "}
                                    <Required />
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={6}
                                  lg={6}
                                  container
                                  alignContent="center"
                                  className="px-1"
                                >
                                  <Field
                                    fullWidth
                                    format="DD/MM/YYYY"
                                    inputVariant="filled"
                                    variant="dialog"
                                    placeholder="DD/MM/YYYY"
                                    minDate={moment()}
                                    component={DatePicker}
                                    name="saudiIdExpiry"
                                    label={t("kyc:Shareholders.Form Fields.Iqama/Saudi ID Expiry")}
                                  />
                                </Grid>
                              </Grid>
                            </Fragment>
                          }
                          ae=""
                        />
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Passport Number`)} <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(`kyc:Shareholders.Form Fields.Passport Number`)}
                              name="passportNumber"
                              variant="filled"
                              type="text"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Passport Expiry`)} <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              format="DD/MM/YYYY"
                              inputVariant="filled"
                              variant="dialog"
                              placeholder="DD/MM/YYYY"
                              minDate={moment()}
                              component={DatePicker}
                              name="passportExpiry"
                              label={t("kyc:Shareholders.Form Fields.Passport Expiry")}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Upload Passport Copy`)} <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Box className="w-full">
                              <FileUploadField
                                // label="Bulletin Document"
                                // isLoading={filesUploadInProgress}
                                name="passportCopyFileName"
                                fullWidth
                                defaultFiles={
                                  values.passportCopyFileName
                                    ? [{ file: { name: values.passportCopyFileName } }]
                                    : null
                                }
                                downloadParameters={
                                  values.passportCopyFileName
                                    ? {
                                        signedURL: selectedRow?.passportCopyFileName.link,
                                      }
                                    : null
                                }
                                acceptableFileTypes={DEFAULT_ACCEPTABLE_FILE_TYPES.join(",")}
                                customHandleChange={(e) =>
                                  handleFileUpload({ files: e, keyName: "passportCopyFileName" })
                                }
                                dense
                              />
                              <ErrorMessage
                                component={Typography}
                                variant="caption"
                                color="error"
                                className="ml-4"
                                name="passportCopyFileName"
                              />
                            </Box>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Upload Proof of Address`)}{" "}
                              <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Box className="w-full">
                              <FileUploadField
                                // label="Bulletin Document"
                                // isLoading={filesUploadInProgress}
                                name="addressProofFileName"
                                fullWidth
                                defaultFiles={
                                  values.addressProofFileName
                                    ? [{ file: { name: values.addressProofFileName } }]
                                    : null
                                }
                                downloadParameters={
                                  values.addressProofFileName
                                    ? {
                                        signedURL: selectedRow?.addressProofFileName.link,
                                      }
                                    : null
                                }
                                acceptableFileTypes={DEFAULT_ACCEPTABLE_FILE_TYPES.join(",")}
                                customHandleChange={(e) =>
                                  handleFileUpload({ files: e, keyName: "addressProofFileName" })
                                }
                                dense
                              />
                              <ErrorMessage
                                component={Typography}
                                variant="caption"
                                color="error"
                                className="ml-4"
                                name="addressProofFileName"
                              />
                            </Box>
                          </Grid>
                        </Grid>
                        <RegionSwitch
                          sa={
                            <Fragment>
                              <Grid item xs={12} lg={12} container className="mt-4">
                                <Grid
                                  item
                                  xs={12}
                                  md={6}
                                  lg={6}
                                  container
                                  alignContent="flex-start"
                                >
                                  <Typography className="mt-4">
                                    {t(`kyc:Shareholders.Form Fields.Upload Iqama/Saudi ID Copy`)}{" "}
                                    <Required />
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={6}
                                  lg={6}
                                  container
                                  alignContent="center"
                                  className="px-1"
                                >
                                  <Box className="w-full">
                                    <FileUploadField
                                      // label="Bulletin Document"
                                      // isLoading={filesUploadInProgress}
                                      name="saudiIdFileName"
                                      fullWidth
                                      defaultFiles={
                                        values.saudiIdFileName
                                          ? [{ file: { name: values.saudiIdFileName } }]
                                          : null
                                      }
                                      downloadParameters={
                                        values.saudiIdFileName
                                          ? {
                                              signedURL: selectedRow?.saudiIdFileName.link,
                                            }
                                          : null
                                      }
                                      acceptableFileTypes={DEFAULT_ACCEPTABLE_FILE_TYPES.join(",")}
                                      customHandleChange={(e) =>
                                        handleFileUpload({ files: e, keyName: "saudiIdFileName" })
                                      }
                                      dense
                                    />
                                    <ErrorMessage
                                      component={Typography}
                                      variant="caption"
                                      color="error"
                                      className="ml-4"
                                      name="saudiIdFileName"
                                    />
                                  </Box>
                                </Grid>
                              </Grid>
                              <Grid item xs={12} lg={12} container className="mt-4">
                                <Grid
                                  item
                                  xs={12}
                                  md={6}
                                  lg={6}
                                  container
                                  alignContent="flex-start"
                                >
                                  <Typography className="mt-4">
                                    {t(
                                      `kyc:Shareholders.Form Fields.Upload Shareholder Proof from MoC`
                                    )}{" "}
                                    <Required />
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={6}
                                  lg={6}
                                  container
                                  alignContent="center"
                                  className="px-1"
                                >
                                  <Box className="w-full">
                                    <FileUploadField
                                      // label="Bulletin Document"
                                      // isLoading={filesUploadInProgress}
                                      name="shareholderProofFileName"
                                      fullWidth
                                      defaultFiles={
                                        values.shareholderProofFileName
                                          ? [{ file: { name: values.shareholderProofFileName } }]
                                          : null
                                      }
                                      downloadParameters={
                                        values.shareholderProofFileName
                                          ? {
                                              signedURL: selectedRow?.shareholderProofFileName.link,
                                            }
                                          : null
                                      }
                                      acceptableFileTypes={DEFAULT_ACCEPTABLE_FILE_TYPES.join(",")}
                                      customHandleChange={(e) =>
                                        handleFileUpload({
                                          files: e,
                                          keyName: "shareholderProofFileName",
                                        })
                                      }
                                      dense
                                    />
                                    <ErrorMessage
                                      component={Typography}
                                      variant="caption"
                                      color="error"
                                      className="ml-4"
                                      name="shareholderProofFileName"
                                    />
                                  </Box>
                                </Grid>
                              </Grid>
                            </Fragment>
                          }
                          ae=""
                        />
                      </Grid>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Grid container justifyContent="flex-end" className="w-full">
                      <Grid item lg={4}>
                        <Button
                          fullWidth
                          onClick={() => {
                            setShareholdingIndividualModalOpen(false);
                          }}
                          color="primary"
                        >
                          {t("Miscellaneous.Cancel")}
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item lg={4}>
                      <Button fullWidth type="submit" variant="contained" color="primary">
                        {t("Miscellaneous.Save")}
                      </Button>
                    </Grid>
                  </DialogActions>
                </form>
              )}
            </Formik>
          </MuiPickersUtilsProvider>
        </Dialog>

        <Dialog
          open={shareholdingEntityModalOpen}
          onClose={() => {
            setShareholdingEntityModalOpen(false);
            setSelectedRow(null);
          }}
          scroll="body"
          aria-labelledby="assign-role"
          maxWidth="sm"
          fullWidth
        >
          <MuiPickersUtilsProvider utils={MomentUtils} locale={theme.locale.altLocale}>
            <Formik
              initialValues={{
                name: selectedRow?.name || "",
                shareHoldingPercentage: selectedRow?.shareHoldingPercentage || "",
                incorporationDate: selectedRow?.incorporationDate || null,
                incorporationPlace: selectedRow?.incorporationPlace || "",
                legalEntityIdentifier: selectedRow?.legalEntityIdentifier || "",
                commercialRegNo: selectedRow?.commercialRegNo || "",
                addressLine1: selectedRow?.addressLine1 || "",
                addressLine2: selectedRow?.addressLine2 || "",
                city: selectedRow?.city || "",
                country: selectedRow?.country ? selectedCountry : null,
                pinCode: selectedRow?.pinCode || "",
                businessPhone: selectedRow?.businessPhone || "",
              }}
              validationSchema={kycSchema.shareholdingEntitySchema}
              enableReinitialize
              onSubmit={(values, { setSubmitting }) => {
                const processedValues = { ...values, countryId: values.country.value };
                delete processedValues?.country;

                let requestPayload;
                if (isEdit) {
                  const editObject = { ...processedValues, id: selectedRow?.id };
                  requestPayload = { shareholdingEntities: [editObject] };
                } else {
                  requestPayload = { shareholdingEntities: [processedValues] };
                }

                const payload = {
                  entityId,
                  requestPayload,
                  successCallback: () => {
                    setSubmitting(false);
                    fetchPageData();
                    setShareholdingEntityModalOpen(false);
                    setSelectedRow(null);
                  },
                };
                dispatch(kycActionCreators.doPostKYCData(payload));
              }}
            >
              {({ handleSubmit, setFieldValue, values }) => (
                <form onSubmit={handleSubmit} noValidate>
                  <DialogTitle id="form-dialog-title">
                    {selectedRow
                      ? t("kyc:Shareholders.Form Fields.Edit Shareholding Entity")
                      : t("kyc:Shareholders.Form Fields.Add Shareholding Entity")}
                  </DialogTitle>
                  <DialogContent>
                    <Box mb={2}>
                      <Grid container>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4"></Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              InputProps={{
                                type: "number",
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              }}
                              component={TextField}
                              label={t(`kyc:Shareholders.Form Fields.Shareholding Percentage`)}
                              name="shareHoldingPercentage"
                              variant="filled"
                              type="text"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Registered Name`)} <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(`kyc:Shareholders.Form Fields.Registered Name`)}
                              name="name"
                              variant="filled"
                              type="text"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Date of Incorporation`)} <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              format="DD/MM/YYYY"
                              inputVariant="filled"
                              variant="dialog"
                              maxDate={moment()}
                              placeholder="DD/MM/YYYY"
                              component={DatePicker}
                              name="incorporationDate"
                              label={t("kyc:Shareholders.Form Fields.Date of Incorporation")}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Place of Incorporation`)}{" "}
                              <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(`kyc:Shareholders.Form Fields.Place of Incorporation`)}
                              name="incorporationPlace"
                              variant="filled"
                              type="text"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Legal Entity Identifier (LEI)`)}{" "}
                              <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(
                                `kyc:Shareholders.Form Fields.Legal Entity Identifier (LEI)`
                              )}
                              name="legalEntityIdentifier"
                              variant="filled"
                              type="text"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-4">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Commercial License Number`)}{" "}
                              <Required />
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(`kyc:Shareholders.Form Fields.Commercial License Number`)}
                              name="commercialRegNo"
                              variant="filled"
                              type="text"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} container className="mt-8">
                          <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                            <Typography className="mt-4">
                              {t(`kyc:Shareholders.Form Fields.Registered Address`)} <Required />{" "}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            container
                            alignContent="center"
                            className="px-1"
                          >
                            <div className="w-full">
                              <Field
                                fullWidth
                                component={TextField}
                                label={t(`kyc:Shareholders.Form Fields.Address Line 1`)}
                                name="addressLine1"
                                variant="filled"
                                type="text"
                              />
                            </div>
                            <div className="mt-4 w-full">
                              <Field
                                fullWidth
                                component={TextField}
                                label={t(`kyc:Shareholders.Form Fields.Address Line 2`)}
                                name="addressLine2"
                                variant="filled"
                                type="text"
                              />
                            </div>
                            <div className="mt-4 w-full">
                              <Field
                                fullWidth
                                component={TextField}
                                label={t(`kyc:Shareholders.Form Fields.City`)}
                                name="city"
                                variant="filled"
                                type="text"
                              />
                            </div>
                            <div className="mt-4 w-full">
                              <FormControl className="w-full">
                                <Select
                                  closeMenuOnSelect
                                  isSearchable
                                  placeholder={`${t("kyc:Shareholders.Form Fields.Country")}`}
                                  components={{
                                    ...animatedComponents,
                                  }}
                                  styles={selectStyles}
                                  value={values.country}
                                  options={countries}
                                  onChange={(selected) => {
                                    setFieldValue("country", selected);
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
                            </div>
                            <div className="mt-4 w-full">
                              <Field
                                fullWidth
                                component={TextField}
                                label={t(`kyc:Shareholders.Form Fields.Post Code`)}
                                name="pinCode"
                                variant="filled"
                                type="text"
                              />
                            </div>
                            <div className="mt-4 w-full">
                              <Field
                                fullWidth
                                component={TextField}
                                label={t(`kyc:Shareholders.Form Fields.Telephone Number`)}
                                name="businessPhone"
                                variant="filled"
                                type="text"
                              />
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Grid container justifyContent="flex-end" className="w-full">
                      <Grid item lg={4}>
                        <Button
                          fullWidth
                          onClick={() => {
                            setShareholdingEntityModalOpen(false);
                            // handleClose();
                            // resetForm();
                          }}
                          color="primary"
                        >
                          {t("Miscellaneous.Cancel")}
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item lg={4}>
                      <Button fullWidth type="submit" variant="contained" color="primary">
                        {t("Miscellaneous.Save")}
                      </Button>
                    </Grid>
                  </DialogActions>
                </form>
              )}
            </Formik>
          </MuiPickersUtilsProvider>
        </Dialog>
        <Dialog
          open={deleteShareholderModalOpen}
          onClose={() => setDeleteShareholderModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">
            {t("kyc:Shareholders.Form Fields.Delete Shareholder?")}
          </DialogTitle>
          <DialogContent dir={locale.rtl ? "rtl" : "ltr"}>
            <DialogContentText id="alert-dialog-description">
              {t(
                "kyc:Shareholders.Form Fields.This action is non reversible! It will permanently delete the shareholder"
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDeleteShareholderModalOpen(false);
              }}
              color="primary"
            >
              {t("Miscellaneous.Cancel")}
            </Button>
            <Button onClick={deleteShareholder} variant="contained" color="primary">
              {t("Miscellaneous.Yes, Delete it")}
            </Button>
          </DialogActions>
        </Dialog>
      </MuiPickersUtilsProvider>
    </Fragment>
  );
};

export default Shareholders;
