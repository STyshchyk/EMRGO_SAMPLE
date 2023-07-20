import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";

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
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, Formik } from "formik";
import { RadioGroup, TextField } from "formik-mui";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import ChangeRequest from "../../../../components/ChangeRequest";
import FileUploadField from "../../../../components/FileUploadField";
import LoadingPage from "../../../../components/LoadingPage";
import MaterialTableOverflowMenu from "../../../../components/MaterialTableOverflowMenu";
import RegionSwitch from "../../../../components/RegionSwitch";
import Required from "../../../../components/Required";
import StyledPageTitle from "../../../../components/StyledPageTitle";
import UnsavedFormDataGuard from "../../../../components/UnsavedFormDataGuard";
import accessControlsList from "../../../../constants/accessControlsList";
import DEFAULT_ACCEPTABLE_FILE_TYPES from "../../../../constants/documents/kyc";
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

const ACCEPTABLE_FILE_TYPES = ".pdf";

const KeyIndividuals = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["translation", "kyc"]);
  const { theme } = useTheme();
  const { locale } = theme;
  const { entityId } = useParams();
  const mtableLocalization = useMaterialTableLocalization();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [keyIndividualModalOpen, setKeyIndividualModalOpen] = useState(false);
  const [deleteShareholderModalOpen, setDeleteShareholderModalOpen] = useState(false);
  const isEdit = selectedRow !== null;

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const entityType = currentEntityGroup?.entityType;
  const hasManageKYCAccessControl = currentEntityGroup?.accessControls.some(
    (acl) => acl?.key === "KYC/Manage"
  );
  const isComplianceOfficer = hasManageKYCAccessControl && entityType === "EMRGO_SERVICES";
  const isIssuer = currentEntityGroup?.accessControls.some(
    (acl) => acl?.key === accessControlsList.SECURITIES_SERVICES_ISSUER.view.key
  );
  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const fetchPageData = () => {
    dispatch(
      kycActionCreators.doFetchKYCData({
        entityId,
        requestPayload: {
          keys: ["keyIndividuals"],
          includeSignedUrl: true,
          sectionChanges: "key_individuals",
        },
      })
    );
  };

  useEffect(() => {
    dispatch(kycActionCreators.doFetchDropdowns({ options: ["country", "keyIndividualCapacity"] }));
    fetchPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dropdowns = useSelector(kycSelectors.selectdropdownData);
  const kycData = useSelector(kycSelectors.selectKYCData);
  const kycFileData = useSelector(kycSelectors.selectFilesUploaded);
  const fetchingKYCData = useSelector(kycSelectors.selectIsFetchingKycData);
  const fetchingDropdownOptions = useSelector(kycSelectors.selectIsFetching);

  let filteredCapacities = dropdowns?.keyIndividualCapacity?.filter(
    (currentKeyIndividualCapacity) => currentKeyIndividualCapacity.key !== "admin"
  );

  if (isIssuer) {
    filteredCapacities = filteredCapacities?.filter(
      (currentKeyIndividualCapacity) => currentKeyIndividualCapacity.key !== "director"
    );
  }
  const countriesDropdown = normalisedCountries(dropdowns?.country);
  const countries = getDropdownValues(countriesDropdown, locale);
  const selectedCountry = countries.find((country) => country.value === selectedRow?.country?.id);
  const capacities = getDropdownValues(filteredCapacities, locale);

  const selectedCapacity = capacities?.find(
    (capacity) => capacity?.value === selectedRow?.capacity.id
  );

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
    setKeyIndividualModalOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteShareholderModalOpen(true);
  };

  const deleteKeyIndividual = () => {
    const requestPayload = { keyIndividuals: [{ id: selectedRow.id }] };
    const payload = {
      entityId,
      requestPayload,
      successCallback: () => {
        fetchPageData();
        setDeleteShareholderModalOpen(false);
        setSelectedRow(null);
      },
    };
    dispatch(kycActionCreators.doPostKYCData(payload));
  };

  const actions = [
    {
      callback: handleModifyClick,
      icon: <EditIcon fontSize="small" />,
      label: t("kyc:Individuals.Table.Modify"),
    },
    {
      callback: handleDeleteClick,
      icon: <DeleteIcon fontSize="small" />,
      label: t("kyc:Individuals.Table.Delete"),
    },
  ];

  const headCells = [
    {
      title: t("kyc:Individuals.Table.Capacity"),
      field: "capacity.name",
      width: 200,
    },
    {
      title: t("kyc:Individuals.Table.First Name"),
      field: "firstName",
      width: 100,
    },
    {
      title: t("kyc:Individuals.Table.Middle Name"),
      field: "middleName",
      width: 100,
    },
    {
      title: t("kyc:Individuals.Table.Last Name"),
      field: "lastName",
      width: 100,
    },
    {
      title: t("kyc:Individuals.Table.PEP"),
      field: "pep",
      width: 120,
      render: (rowData) => (rowData?.politicallyExposed ? "Yes" : "No"),
    },
    {
      title: t("kyc:Individuals.Table.Entity"),
      field: "entity",
      width: 100,
    },
    {
      title: t("kyc:Individuals.Table.Address Line 1"),
      field: "addressLine1",
      width: 150,
    },
    {
      title: t("kyc:Individuals.Table.Address Line 2"),
      field: "addressLine2",
      width: 150,
    },
    {
      title: t("kyc:Individuals.Table.City"),
      field: "city",
      width: 100,
    },
    {
      title: t("kyc:Individuals.Table.Country"),
      field: "country.name",
      width: 100,
    },
    {
      title: t("kyc:Individuals.Table.Post Code"),
      field: "pinCode",
      width: 100,
    },
  ];

  const processKeyIndividualsFormData = (formData) => {
    const processData = {
      ...formData,
    };

    delete processData.changeRequests.test;

    return processData;
  };

  const keyIndividuals = kycData?.keyIndividuals
    ? kycData?.keyIndividuals?.map((individual) => {
        const extensibleEntity = { ...individual };
        return extensibleEntity;
      })
    : [];

  if (fetchingKYCData || fetchingDropdownOptions) {
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

  const validationSchema = regionSwitcher({
    sa: kycSchema.keyIndividualSchemaKSA,
    ae: kycSchema.keyIndividualSchema,
  });

  return (
    <Fragment>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <StyledPageTitle title={t("kyc:Individuals.Key Individuals")} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2">
            {t(
              "kyc:Individuals.Please identify all individuals authorised to sign on behalf of the Entity and all individuals on the Governing Body (eg directors)"
            )}
          </Typography>
        </Grid>
      </Grid>
      {kycData ? (
        <Formik
          initialValues={{
            changeRequests: kycData?.sectionChanges ? kycData?.sectionChanges.changesRequested : {},
          }}
          validateOnMount={false}
          onSubmit={(values, { setSubmitting }) => {
            const keyIndividualsSubmitData = processKeyIndividualsFormData(values);

            const isLocked = isComplianceOfficer
              ? Object.keys(keyIndividualsSubmitData.changeRequests).length === 0
              : true;

            keyIndividualsSubmitData.updateSection = {
              sectionKey: "key_individuals",
              changesRequested: keyIndividualsSubmitData.changeRequests,
              isLocked,
            };

            const payload = {
              entityId,
              requestPayload: keyIndividualsSubmitData,
              successCallback: () => {
                setSubmitting(false);
                fetchPageData();
              },
            };
            dispatch(kycActionCreators.doPostKYCData(payload));
          }}
        >
          {({ handleSubmit, values, setFieldValue, dirty }) => {
            const saveForm = () => {
              const keyIndividualsSaveData = processKeyIndividualsFormData(values);

              const payload = {
                entityId,
                requestPayload: keyIndividualsSaveData,
                successCallback: () => {
                  fetchPageData();
                },
              };
              dispatch(kycActionCreators.doPostKYCData(payload));
            };

            return (
              <form onSubmit={handleSubmit} noValidate className="pb-16 py-8">
                <UnsavedFormDataGuard dirty={dirty && !kycData?.sectionChanges?.isLocked} />
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
                              date: kycData?.updatedAt
                                ? moment(kycData?.updatedAt).format("DD/MM/YYYY HH:mm")
                                : "N.A",
                            })}{" "}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container justifyContent="flex-end" className="mt-8">
                    <Grid item xs={12} md={6} lg={2} className="px-1">
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => setKeyIndividualModalOpen(true)}
                      >
                        {t("kyc:Individuals.Form Fields.Add Individual")}
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} className="pt-8">
                    <MaterialTable
                      size="small"
                      title=""
                      columns={headCells}
                      data={keyIndividuals}
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
                </Grid>
              </form>
            );
          }}
        </Formik>
      ) : (
        ""
      )}
      <Dialog
        open={keyIndividualModalOpen}
        onClose={() => {
          setKeyIndividualModalOpen(false);
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
              capacity: selectedCapacity || null,
              firstName: selectedRow?.firstName || "",
              middleName: selectedRow?.middleName || "",
              lastName: selectedRow?.lastName || "",
              politicallyExposed: getYesNoValue(selectedRow?.politicallyExposed),
              addressLine1: selectedRow?.addressLine1 || "",
              addressLine2: selectedRow?.addressLine2 || "",
              city: selectedRow?.city || "",
              country: selectedCountry || "",
              pinCode: selectedRow?.pinCode || "",
              businessPhone: selectedRow?.businessPhone || "",
              saudiIdNumber: selectedRow?.saudiIdNumber || "",
              saudiIdExpiry: selectedRow?.saudiIdExpiry || null,
              passportNumber: selectedRow?.passportNumber || "",
              passportExpiry: selectedRow?.passportExpiry || null,
              passportCopyFileName: selectedRow?.passportCopyFileName?.name || null,
              addressProofFileName: selectedRow?.addressProofFileName?.name || null,
              chamberOfCommerceAuthorizationFileName:
                selectedRow?.chamberOfCommerceAuthorizationFileName?.name || null,
              corporateAuthorizationFileName:
                selectedRow?.corporateAuthorizationFileName?.name || null,
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const processedValues = {
                ...values,
                countryId: values.country.value,
                capacityId: values.capacity.value,
                politicallyExposed: values.politicallyExposed === "yes",
                passportCopyFileName:
                  kycFileData?.passportCopyFileName?.fileIdentifier || values.passportCopyFileName,
                addressProofFileName:
                  kycFileData?.addressProofFileName?.fileIdentifier || values.addressProofFileName,
                chamberOfCommerceAuthorizationFileName:
                  kycFileData?.chamberOfCommerceAuthorizationFileName?.fileIdentifier ||
                  values.chamberOfCommerceAuthorizationFileName,
                corporateAuthorizationFileName:
                  kycFileData?.corporateAuthorizationFileName?.fileIdentifier ||
                  values.corporateAuthorizationFileName,
              };
              delete processedValues?.country;
              delete processedValues?.capacity;
              // delete processedValues?.saudiIdExpiry;

              let requestPayload;
              if (isEdit) {
                const editObject = { ...processedValues, id: selectedRow.id };
                requestPayload = { keyIndividuals: [editObject] };
              } else {
                requestPayload = { keyIndividuals: [processedValues] };
              }

              const payload = {
                entityId,
                requestPayload,
                successCallback: () => {
                  setSubmitting(false);
                  dispatch(
                    kycActionCreators.doFetchKYCData({
                      entityId,
                      requestPayload: {
                        keys: ["keyIndividuals"],
                        includeSignedUrl: true,
                        sectionChanges: "key_individuals",
                      },
                    })
                  );
                  setKeyIndividualModalOpen(false);
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
                  {t("kyc:Individuals.Form Fields.Add Individual")}
                </DialogTitle>
                <DialogContent>
                  <Box mb={2}>
                    <Grid container>
                      <Grid item xs={12} lg={12} container className="mt-4">
                        <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                          <Typography className="mt-4">
                            {t(`kyc:Individuals.Form Fields.Capacity`)}
                            <Required />
                          </Typography>
                        </Grid>
                        <Grid
                          xs={12}
                          md={6}
                          lg={6}
                          container
                          alignContent="center"
                          className="px-1"
                        >
                          <FormControl className="w-full mt-4">
                            <Select
                              closeMenuOnSelect
                              isSearchable
                              placeholder={`${t("kyc:Individuals.Form Fields.Capacity")}`}
                              components={{
                                ...animatedComponents,
                              }}
                              styles={selectStyles}
                              value={values.capacity}
                              options={capacities}
                              onChange={(selected) => {
                                setFieldValue("capacity", selected);
                              }}
                            />
                          </FormControl>
                          <ErrorMessage
                            component={Typography}
                            variant="caption"
                            color="error"
                            className="ml-4"
                            name="capacity"
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} lg={12} container className="mt-4">
                        <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                          <Typography className="mt-4">
                            {t(`kyc:Individuals.Form Fields.First Name`)}
                            <Required />
                          </Typography>
                        </Grid>
                        <Grid
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
                            label={t(`kyc:Individuals.Form Fields.First Name`)}
                            name="firstName"
                            variant="filled"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} lg={12} container className="mt-4">
                        <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                          <Typography className="mt-4">
                            {t(`kyc:Individuals.Form Fields.Middle Name`)}
                          </Typography>
                        </Grid>
                        <Grid
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
                            label={t(`kyc:Individuals.Form Fields.Middle Name`)}
                            name="middleName"
                            variant="filled"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} lg={12} container className="mt-4">
                        <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                          <Typography className="mt-4">
                            {t(`kyc:Individuals.Form Fields.Last Name`)}
                            <Required />
                          </Typography>
                        </Grid>
                        <Grid
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
                            label={t(`kyc:Individuals.Form Fields.Last Name`)}
                            name="lastName"
                            variant="filled"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} lg={12} container className="mt-4">
                        <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                          <Typography className="mt-4">
                            {t(`kyc:Individuals.Form Fields.Politically Exposed Person`)}
                            <Required />
                          </Typography>
                        </Grid>
                        <Grid
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
                              label={t(`kyc:Individuals.Yes`)}
                              disabled={isSubmitting}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio disabled={isSubmitting} />}
                              label={t(`kyc:Individuals.No`)}
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
                            {t(`kyc:Individuals.Form Fields.Address`)}
                            <Required />
                          </Typography>
                        </Grid>
                        <Grid
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
                              label={t(`kyc:Individuals.Form Fields.Address Line 1`)}
                              name="addressLine1"
                              variant="filled"
                              type="text"
                            />
                          </div>
                          <div className="mt-4 w-full">
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(`kyc:Individuals.Form Fields.Address Line 2`)}
                              name="addressLine2"
                              variant="filled"
                              type="text"
                            />
                          </div>
                          <div className="mt-4 w-full">
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(`kyc:Individuals.Form Fields.City`)}
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
                                placeholder={`${t("kyc:Individuals.Form Fields.Country")}`}
                                components={{
                                  ...animatedComponents,
                                }}
                                styles={selectStyles}
                                value={values?.country}
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
                              label={t(`kyc:Individuals.Form Fields.Post Code`)}
                              name="pinCode"
                              variant="filled"
                              type="text"
                            />
                          </div>
                          <div className="mt-4 w-full">
                            <Field
                              fullWidth
                              component={TextField}
                              label={t(`kyc:Individuals.Form Fields.Telephone Number`)}
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
                              <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                                <Typography className="mt-4">
                                  {t(`kyc:Individuals.Form Fields.Iqama/Saudi ID Number`)}
                                  <Required />
                                </Typography>
                              </Grid>
                              <Grid
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
                                  label={t(`kyc:Individuals.Form Fields.Iqama/Saudi ID Number`)}
                                  name="saudiIdNumber"
                                  variant="filled"
                                  type="text"
                                />
                              </Grid>
                            </Grid>
                            <Grid item xs={12} lg={12} container className="mt-4">
                              <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                                <Typography className="mt-4">
                                  {t(`kyc:Individuals.Form Fields.Iqama/Saudi ID Expiry`)}
                                  <Required />
                                </Typography>
                              </Grid>
                              <Grid
                                xs={12}
                                md={6}
                                lg={6}
                                container
                                alignContent="center"
                                className="px-1"
                              >
                                <Field
                                  fullWidth
                                  format="DD/MM/yyyy"
                                  inputVariant="filled"
                                  inputProps={{
                                    shrink: "false",
                                  }}
                                  minDate={moment()}
                                  variant="dialog"
                                  placeholder="DD/MM/YYYY"
                                  component={DatePicker}
                                  name="saudiIdExpiry"
                                  label={t("kyc:Individuals.Form Fields.Iqama/Saudi ID Expiry")}
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
                            {t(`kyc:Individuals.Form Fields.Passport Number`)}
                            <Required />
                          </Typography>
                        </Grid>
                        <Grid
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
                            label={t(`kyc:Individuals.Form Fields.Passport Number`)}
                            name="passportNumber"
                            variant="filled"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} lg={12} container className="mt-4">
                        <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                          <Typography className="mt-4">
                            {t(`kyc:Individuals.Form Fields.Passport Expiry`)}
                            <Required />
                          </Typography>
                        </Grid>
                        <Grid
                          xs={12}
                          md={6}
                          lg={6}
                          container
                          alignContent="center"
                          className="px-1"
                        >
                          <Field
                            fullWidth
                            format="DD/MM/yyyy"
                            inputVariant="filled"
                            inputProps={{
                              shrink: "false",
                            }}
                            minDate={moment()}
                            variant="dialog"
                            placeholder="DD/MM/YYYY"
                            component={DatePicker}
                            name="passportExpiry"
                            label={t("kyc:Individuals.Form Fields.Passport Expiry")}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} lg={12} container className="mt-4">
                        <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                          <Typography className="mt-4">
                            {t(`kyc:Individuals.Form Fields.Upload Passport Copy`)}
                            <Required />
                          </Typography>
                        </Grid>
                        <Grid
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
                              downloadParameters={
                                values.passportCopyFileName
                                  ? {
                                      signedURL: selectedRow?.passportCopyFileName.link,
                                    }
                                  : null
                              }
                              defaultFiles={
                                values.passportCopyFileName
                                  ? [{ file: { name: values.passportCopyFileName } }]
                                  : null
                              }
                              acceptableFileTypes={DEFAULT_ACCEPTABLE_FILE_TYPES.join(",")}
                              customHandleChange={(e) =>
                                handleFileUpload({ files: e, keyName: "passportCopyFileName" })
                              }
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
                            {t(`kyc:Individuals.Form Fields.Upload Proof of Address`)}
                            <Required />
                          </Typography>
                        </Grid>
                        <Grid
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
                              downloadParameters={
                                values.addressProofFileName
                                  ? {
                                      signedURL: selectedRow?.addressProofFileName.link,
                                    }
                                  : null
                              }
                              defaultFiles={
                                values.addressProofFileName
                                  ? [{ file: { name: values.addressProofFileName } }]
                                  : null
                              }
                              acceptableFileTypes={DEFAULT_ACCEPTABLE_FILE_TYPES.join(",")}
                              customHandleChange={(e) =>
                                handleFileUpload({ files: e, keyName: "addressProofFileName" })
                              }
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
                          <Grid item xs={12} lg={12} container className="mt-4">
                            <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                              <Typography className="mt-4">
                                {t(
                                  `kyc:Individuals.Form Fields.Upload Chamber of Commerce Authorization`
                                )}
                                <Required />
                              </Typography>
                            </Grid>
                            <Grid
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
                                  name="chamberOfCommerceAuthorizationFileName"
                                  fullWidth
                                  downloadParameters={
                                    values.chamberOfCommerceAuthorizationFileName
                                      ? {
                                          signedURL:
                                            selectedRow?.chamberOfCommerceAuthorizationFileName
                                              .link,
                                        }
                                      : null
                                  }
                                  defaultFiles={
                                    values.chamberOfCommerceAuthorizationFileName
                                      ? [
                                          {
                                            file: {
                                              name: values.chamberOfCommerceAuthorizationFileName,
                                            },
                                          },
                                        ]
                                      : null
                                  }
                                  acceptableFileTypes={DEFAULT_ACCEPTABLE_FILE_TYPES.join(",")}
                                  customHandleChange={(e) =>
                                    handleFileUpload({
                                      files: e,
                                      keyName: "chamberOfCommerceAuthorizationFileName",
                                    })
                                  }
                                />
                                <ErrorMessage
                                  component={Typography}
                                  variant="caption"
                                  color="error"
                                  className="ml-4"
                                  name="chamberOfCommerceAuthorizationFileName"
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        }
                        ae=""
                      />

                      <Grid item xs={12} lg={12} container className="mt-4">
                        <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                          <Typography className="mt-4">
                            {t(`kyc:Individuals.Form Fields.Upload Corporate Authorization`)}
                            <Required />
                          </Typography>
                        </Grid>
                        <Grid
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
                              name="corporateAuthorizationFileName"
                              fullWidth
                              downloadParameters={
                                values.corporateAuthorizationFileName
                                  ? {
                                      signedURL: selectedRow?.corporateAuthorizationFileName.link,
                                    }
                                  : null
                              }
                              defaultFiles={
                                values.corporateAuthorizationFileName
                                  ? [{ file: { name: values.corporateAuthorizationFileName } }]
                                  : null
                              }
                              acceptableFileTypes={DEFAULT_ACCEPTABLE_FILE_TYPES.join(",")}
                              customHandleChange={(e) =>
                                handleFileUpload({
                                  files: e,
                                  keyName: "corporateAuthorizationFileName",
                                })
                              }
                            />
                            <ErrorMessage
                              component={Typography}
                              variant="caption"
                              color="error"
                              className="ml-4"
                              name="corporateAuthorizationFileName"
                            />
                          </Box>
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
                          setKeyIndividualModalOpen(false);
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
                    <Button type="submit" fullWidth variant="contained" color="primary">
                      {t("Miscellaneous.Submit")}
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
          {t("kyc:Individuals.Form Fields.Delete Key Individual?")}
        </DialogTitle>
        <DialogContent dir={locale.rtl ? "rtl" : "ltr"}>
          <DialogContentText id="alert-dialog-description">
            {t(
              "kyc:Individuals.Form Fields.This action is non reversible! It will permanently delete the individual"
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
          <Button onClick={deleteKeyIndividual} variant="contained" color="primary">
            {t("Miscellaneous.Yes, Delete it")}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default KeyIndividuals;
