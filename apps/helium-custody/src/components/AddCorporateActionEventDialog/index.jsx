import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import makeAnimated from "react-select/animated";

import { MySelect as Select } from "@emrgo-frontend/shared-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ErrorMessage, Field, Formik } from "formik";
import { TextField } from "formik-mui";
import moment from "moment";

import { useTheme } from "../../context/theme-context";
import * as CAEventsActionCreators from "../../redux/actionCreators/corporateActionEvents";
import * as dropdownActionCreators from "../../redux/actionCreators/dropdown";
import * as formActionCreators from "../../redux/actionCreators/form";
import * as authSelectors from "../../redux/selectors/auth";
import * as CAEventsSelectors from "../../redux/selectors/corporateActionEvents";
import * as dropdownSelectors from "../../redux/selectors/dropdown";
import * as externalSecuritiesSelectors from "../../redux/selectors/externalSecurities";
import * as selectFormValues from "../../redux/selectors/form";
import selectStyles from "../../styles/cssInJs/reactSelect";
import addCorporateActionEventFormSchema from "../../validationSchemas/addCorporateActionEventFormSchema";
import AutoSaveFields from "../AutoSaveFields";
import RealtimeSecSearchDialog from "../RealtimeSecSearchDialog";

const animatedComponents = makeAnimated();

const PREFIX = "AddCounterpartySSIDialog";

const classes = {
  disabledText: `${PREFIX}-disabledText`,
};

const StyledDialog = styled(Dialog)(() => ({
  [`& .${classes.disabledText}`]: {
    color: "#979797",
  },
}));

const initial = {
  eventType: null,
  linkedEventId: "",
  exDate: null,
  recordDate: null,
  externalSecuritySelectOption: null,
  paymentDate: null,
  eventStatus: null,
  eventTerms: "",
  additionalInfo: "",
  mandatoryOrVoluntary: null,
  responseDeadline: null,
};

const mandatoryOrVoluntaryOptions = [
  { value: "voluntary", label: "Voluntary" },
  { value: "mandatory", label: "Mandatory" },
];

export const generateExternalSecurityOptionsList = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return (
      data
        // .filter((item) => item?.isin)
        .map((item) => ({
          label: item.isin ?? item?.attributes[0]?.value,
          value: item,
        }))
    );
  }

  return [];
};

const AddCorporateActionEventDialog = ({ open, handleClose, selectedRow, setSelectedRow }) => {
  const [initialValues, setInitialValues] = useState(initial);
  const [openRealtimeSecuritySearchDialog, setOpenRealtimeSecuritySearchDialog] = useState(false);
  const formvalues = useSelector(selectFormValues.selectFormValues);
  const fetchingValues = useSelector(selectFormValues.formValuesFetching);
  const dispatch = useDispatch();
  const isEdit = selectedRow !== null;

  // selectors
  const dropdownDataOptions = useSelector(dropdownSelectors.selectDropdownOptions);
  const corporateActionEvents = useSelector(CAEventsSelectors.selectCorporateActionEventsList);
  const externalSecuritiesList = useSelector(
    externalSecuritiesSelectors.selectExternalSecuritiesData
  );
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);

  const { theme } = useTheme();
  const currentEntityGroupID = currentEntityGroup?.id;

  const corporateActionEventTypeOptions = dropdownDataOptions?.corporateActionEventType?.map(
    (eventType) => ({ label: eventType.name, value: eventType.id })
  );
  const corporateActionEventStatusOptions = dropdownDataOptions?.corporateActionEventStatus?.map(
    (eventStatus) => ({ label: eventStatus.name, value: eventStatus.id })
  );
  const externalSecurityOptionsList = generateExternalSecurityOptionsList(externalSecuritiesList);

  const selectedCorporateActionEvent = corporateActionEvents?.find(
    ({ id }) => selectedRow?.id === id
  );
  const fetchCorporateActionEventsList = () => dispatch(CAEventsActionCreators.doFetchCAEvents());

  let corporateActionLinkedEventOptions = [];
  if (isEdit) {
    corporateActionLinkedEventOptions = corporateActionEvents
      .filter((event) => event.id !== selectedCorporateActionEvent.id)
      .map((linkEvent) => ({ label: linkEvent.eventId, value: linkEvent.id }));
  } else {
    corporateActionLinkedEventOptions = corporateActionEvents.map((linkEvent) => ({
      label: linkEvent.eventId,
      value: linkEvent.id,
    }));
  }

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }
  const formatParsedValues = (payload) => {
    const dateFields = ["exDate", "recordDate", "paymentDate", "responseDeadline"];
    dateFields.forEach((field) => {
      if (payload[field]) {
        payload[field] = moment(payload[field]);
      }
    });
    return payload;
  };

  useEffect(() => {
    if (selectedRow || selectedCorporateActionEvent) {
      setInitialValues({
        eventType: selectedCorporateActionEvent?.eventType
          ? {
              label: selectedCorporateActionEvent?.eventType?.label,
              value: selectedCorporateActionEvent?.eventType?.id,
            }
          : "",
        externalSecuritySelectOption: selectedCorporateActionEvent?.externalSecurity
          ? {
              label: selectedCorporateActionEvent?.externalSecurity?.isin,
              value: selectedCorporateActionEvent?.externalSecurity,
            }
          : "",
        eventStatus: selectedCorporateActionEvent?.eventStatus
          ? {
              label: selectedCorporateActionEvent?.eventStatus?.label,
              value: selectedCorporateActionEvent?.eventStatus?.id,
            }
          : "",
        linkedEventId: selectedCorporateActionEvent?.linkedEvent
          ? {
              label: selectedCorporateActionEvent?.linkedEvent?.eventId,
              value: selectedCorporateActionEvent?.linkedEvent?.id,
            }
          : "",
        exDate: moment(selectedCorporateActionEvent?.exDate) || null,
        recordDate: moment(selectedCorporateActionEvent?.recordDate),
        paymentDate: moment(selectedCorporateActionEvent?.paymentDate),
        eventTerms: selectedCorporateActionEvent?.eventTerms || "",
        additionalInfo: selectedCorporateActionEvent?.additionalInfo || "",
        mandatoryOrVoluntary: selectedCorporateActionEvent?.voluntary
          ? mandatoryOrVoluntaryOptions.find((option) => option.value === "voluntary")
          : mandatoryOrVoluntaryOptions.find((option) => option.value === "mandatory"),
        responseDeadline: moment(selectedCorporateActionEvent?.clientResponseDeadline),
      });
    } else {
      if (!formvalues?.settings) return;
      const data = formvalues?.settings[0];
      if (
        !fetchingValues &&
        data?.value &&
        data?.value !== "null" &&
        data?.key === "AddCorporateActionEventForm"
      ) {
        const payload = formatParsedValues(JSON.parse(data.value));
        setInitialValues(payload);
        // setInitialValues(JSON.parse(data.value));
      }
    }
  }, [formvalues, fetchingValues, selectedCorporateActionEvent, selectedRow]);

  const saveFormValues = (value) => {
    const obj = {
      settings: [
        {
          key: "AddCorporateActionEventForm",
          value: JSON.stringify(value),
          isActive: false,
        },
      ],
    };
    dispatch(formActionCreators.doPostFormRequested(obj));
  };

  useEffect(() => {
    const dropdownOptions = ["corporateActionEventType", "corporateActionEventStatus"];

    const fetchDropdownOptions = (payload) =>
      dispatch(dropdownActionCreators.doFetchDropdownOptions(payload));

    fetchDropdownOptions({
      options: dropdownOptions,
    });
  }, [dispatch, currentEntityGroupID]);

  const buildRequestPayload = (formikValues) => {
    const requestPayload = {
      eventTypeId: formikValues?.eventType?.value,
      linkedEventId: formikValues?.linkedEventId?.value,
      externalSecurityId: formikValues?.externalSecuritySelectOption?.value?.id, //isin
      securityName: formikValues?.externalSecuritySelectOption?.value?.longName,
      exDate: formikValues?.exDate,
      recordDate: formikValues?.recordDate,
      paymentDate: formikValues?.paymentDate,
      status: formikValues?.eventStatus?.value,
      eventTerms: formikValues?.eventTerms,
      additionalInfo: formikValues?.additionalInfo,
      voluntary: formikValues?.mandatoryOrVoluntary?.value === "voluntary",
      clientResponseDeadline: formikValues?.responseDeadline,
    };

    // id 933 if mandatory remove clientResponseDeadline
    if (!requestPayload.voluntary) {
      delete requestPayload.clientResponseDeadline;
    }

    return { ...requestPayload };
  };

  useEffect(() => {
    if (open) {
      const fetchFormValues = (payload) => dispatch(formActionCreators.doFetchForm(payload));
      fetchFormValues({ keys: ["AddCorporateActionEventForm"] });
    }
  }, [open]);

  return (
    <StyledDialog
      fullWidth
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="form-dialog-title"
      scroll="body"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={addCorporateActionEventFormSchema}
        enableReinitialize
        onSubmit={async (values, actions) => {
          let requestPayload;

          if (isEdit) {
            const editObject = {
              requestPayload: buildRequestPayload(values),
              corporateActionEventId: selectedRow?.id,
            };
            requestPayload = editObject;
          } else {
            const formObject = {
              requestPayload: buildRequestPayload(values),
            };
            requestPayload = formObject;
          }

          const payload = {
            requestPayload,
            successCallback: () => {
              actions.setSubmitting(false);
              saveFormValues(values);
              fetchCorporateActionEventsList();
              handleClose();
              setSelectedRow(null);
            },
          };

          if (isEdit) {
            dispatch(CAEventsActionCreators.doEditCAEvent(payload));
          } else {
            dispatch(CAEventsActionCreators.doAddCAEvent(payload));
          }
          saveFormValues(values);
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit} onKeyDown={onKeyDown}>
            <AutoSaveFields formKey="AddCorporateActionEventForm" initial={initial} />
            <DialogTitle id="form-dialog-title">
              {isEdit ? "Edit Corporate Action Event" : "Add Corporate Action Event"}
            </DialogTitle>
            <DialogContent>
              <Box mb={2}>
                <Grid container>
                  <InlineFormField label={"Event Type"}>
                    <Select
                      closeMenuOnSelect
                      placeholder="Select Event Type"
                      components={{
                        ...animatedComponents,
                      }}
                      isSearchable
                      styles={selectStyles}
                      value={values.eventType}
                      isClearable
                      options={corporateActionEventTypeOptions}
                      onChange={(selected) => {
                        setFieldValue("eventType", selected);
                      }}
                    />
                    <ErrorMessage
                      component={Typography}
                      variant="caption"
                      color="error"
                      className="ml-4"
                      name="eventType"
                    />
                  </InlineFormField>

                  <InlineFormField label={"Linked Event ID"}>
                    <Select
                      closeMenuOnSelect
                      placeholder="Select Linked Event ID"
                      components={{
                        ...animatedComponents,
                      }}
                      isSearchable
                      styles={selectStyles}
                      value={values.linkedEventId}
                      isClearable
                      options={corporateActionLinkedEventOptions}
                      onChange={(selected) => {
                        setFieldValue("linkedEventId", selected);
                      }}
                    />
                    <ErrorMessage
                      component={Typography}
                      variant="caption"
                      color="error"
                      className="ml-4"
                      name="linkedEventId"
                    />
                  </InlineFormField>

                  <Grid container item justifyContent="flex-end" mb={2}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenRealtimeSecuritySearchDialog(true)}
                      >
                        <Typography variant="caption">Security lookup</Typography>
                      </Button>
                    </Grid>
                  </Grid>

                  <InlineFormField label={"Security ISIN"}>
                    <Select
                      closeMenuOnSelect
                      placeholder="Select Security ISIN"
                      components={{
                        ...animatedComponents,
                      }}
                      isSearchable
                      styles={selectStyles}
                      value={values.externalSecuritySelectOption}
                      isClearable
                      options={externalSecurityOptionsList}
                      onChange={(newValue) => {
                        setFieldValue("externalSecuritySelectOption", newValue);
                      }}
                    />
                    <ErrorMessage
                      component={Typography}
                      variant="caption"
                      color="error"
                      className="ml-4"
                      name="externalSecuritySelectOption"
                    />
                  </InlineFormField>

                  <Grid container className="my-4">
                    <InlineFormField label={"Security Name"}>
                      <Field
                        fullWidth
                        component={TextField}
                        placeholder="Security Long Name"
                        name="securityName"
                        variant="filled"
                        size="small"
                        type="text"
                        value={
                          values.externalSecuritySelectOption
                            ? values.externalSecuritySelectOption.value?.longName
                            : ""
                        }
                        disabled
                      />
                    </InlineFormField>
                    {/* <ErrorMessage component={Typography} variant="caption" color="error" className="ml-4" name="securityName" /> */}
                  </Grid>

                  <InlineFormField label={"Ex Date"}>
                    <Field
                      fullWidth
                      format="DD/MM/YYYY"
                      size="small"
                      inputVariant="filled"
                      variant="dialog"
                      placeholder="DD/MM/YYYY"
                      component={DatePicker}
                      inputProps={{
                        shrink: "false",
                        size: "small",
                        variant: "filled",
                      }}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          variant: "filled",
                        },
                      }}
                      name="exDate"
                      value={values.exDate}
                      onChange={(date) => {
                        setFieldValue("exDate", date);
                      }}
                    />
                    <ErrorMessage
                      component={Typography}
                      variant="caption"
                      color="error"
                      className="ml-4"
                      name="exDate"
                    />
                  </InlineFormField>

                  <InlineFormField label={"Record Date"}>
                    <Field
                      fullWidth
                      format="DD/MM/YYYY"
                      inputVariant="filled"
                      variant="dialog"
                      placeholder="DD/MM/YYYY"
                      minDate={values.exDate}
                      component={DatePicker}
                      inputProps={{
                        shrink: "false",
                        size: "small",
                        variant: "filled",
                      }}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          variant: "filled",
                        },
                      }}
                      name="recordDate"
                      value={values.recordDate}
                      onChange={(date) => {
                        setFieldValue("recordDate", date);
                      }}
                    />
                    <ErrorMessage
                      component={Typography}
                      variant="caption"
                      color="error"
                      className="ml-4"
                      name="recordDate"
                    />
                  </InlineFormField>

                  <InlineFormField label={"Payment Date"}>
                    <Field
                      fullWidth
                      format="DD/MM/YYYY"
                      inputVariant="filled"
                      variant="dialog"
                      placeholder="DD/MM/YYYY"
                      minDate={values.exDate}
                      component={DatePicker}
                      inputProps={{
                        shrink: "false",
                        size: "small",
                        variant: "filled",
                      }}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          variant: "filled",
                        },
                      }}
                      name="paymentDate"
                      value={values.paymentDate}
                      onChange={(date) => {
                        setFieldValue("paymentDate", date);
                      }}
                    />
                    <ErrorMessage
                      component={Typography}
                      variant="caption"
                      color="error"
                      className="ml-4"
                      name="paymentDate"
                    />
                  </InlineFormField>

                  <InlineFormField label={"Event Status"}>
                    <Select
                      closeMenuOnSelect
                      placeholder="Select Event Status"
                      components={{
                        ...animatedComponents,
                      }}
                      isSearchable
                      styles={selectStyles}
                      value={values.eventStatus}
                      isClearable
                      options={corporateActionEventStatusOptions}
                      onChange={(selected) => {
                        setFieldValue("eventStatus", selected);
                      }}
                    />
                    <ErrorMessage
                      component={Typography}
                      variant="caption"
                      color="error"
                      className="ml-4"
                      name="eventStatus"
                    />
                  </InlineFormField>

                  <InlineFormField label={"Event Status"}>
                    <Field
                      fullWidth
                      label="Event Terms"
                      component={TextField}
                      name="eventTerms"
                      multiline
                      onKeyDown={(event) => {
                        if (event.which === 13)
                          setFieldValue("eventTerms", event.target.value + "\n");
                      }}
                      rows={2}
                      variant="filled"
                      type="textarea"
                      inputProps={{
                        maxLength: 100,
                      }}
                      value={values.eventTerms}
                    />
                  </InlineFormField>

                  <InlineFormField label={"Additional Information"}>
                    <Field
                      fullWidth
                      label="Additional Information"
                      component={TextField}
                      name="additionalInfo"
                      multiline
                      onKeyDown={(event) => {
                        if (event.which === 13)
                          setFieldValue("additionalInfo", event.target.value + "\n");
                      }}
                      rows={2}
                      variant="filled"
                      type="text"
                      inputProps={{
                        maxLength: 100,
                      }}
                      value={values.additionalInfo}
                    />
                  </InlineFormField>

                  <InlineFormField label={"Voluntary/Mandatory"}>
                    <Select
                      closeMenuOnSelect
                      placeholder="Select.."
                      components={{
                        ...animatedComponents,
                      }}
                      isSearchable
                      menuPortalTarget={document.body}
                      styles={selectStyles}
                      value={values.mandatoryOrVoluntary}
                      isClearable
                      options={mandatoryOrVoluntaryOptions}
                      onChange={(selected) => {
                        setFieldValue("mandatoryOrVoluntary", selected);
                      }}
                    />
                    <ErrorMessage
                      component={Typography}
                      variant="caption"
                      color="error"
                      className="ml-4"
                      name="mandatoryOrVoluntary"
                    />
                  </InlineFormField>

                  <InlineFormField label={" Client Response Deadline"}>
                    <Field
                      fullWidth
                      format="DD/MM/YYYY"
                      inputVariant="filled"
                      variant="dialog"
                      placeholder="DD/MM/YYYY"
                      component={DatePicker}
                      inputProps={{
                        shrink: "false",
                        size: "small",
                        variant: "filled",
                      }}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          variant: "filled",
                        },
                      }}
                      disabled={values.mandatoryOrVoluntary?.value === "mandatory"}
                      name="responseDeadline"
                      minDate={moment()}
                      value={values.responseDeadline}
                      onChange={(date) => {
                        setFieldValue("responseDeadline", date);
                      }}
                    />
                    <ErrorMessage
                      component={Typography}
                      variant="caption"
                      color="error"
                      className="ml-4"
                      name="responseDeadline"
                    />
                  </InlineFormField>
                </Grid>
              </Box>
            </DialogContent>

            <DialogActions>
              <Grid container justifyContent="flex-end" className="w-full">
                <Grid item lg={4}>
                  <Button
                    fullWidth
                    onClick={() => {
                      setInitialValues(initial);
                      saveFormValues(values);
                      handleClose();
                    }}
                    color="primary"
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>

              <Grid item lg={4}>
                <Button fullWidth type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </DialogActions>
            {openRealtimeSecuritySearchDialog && (
              <RealtimeSecSearchDialog
                open={openRealtimeSecuritySearchDialog}
                handleClose={() => {
                  setOpenRealtimeSecuritySearchDialog(false);
                }}
                handleSecurityResultItemSelect={(row) => {
                  const found = externalSecurityOptionsList.find(
                    (item) => item.value.id === row?.externalSecurityId
                  );

                  if (found) {
                    setFieldValue("externalSecuritySelectOption", found);
                  }
                }}
                assetTypeFilterValue="Fixed Income"
              />
            )}
          </form>
        )}
      </Formik>
    </StyledDialog>
  );
};

export default AddCorporateActionEventDialog;
