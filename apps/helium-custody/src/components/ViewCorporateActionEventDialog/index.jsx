import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { DialogActions } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import * as CAEventsActionCreators from "../../redux/actionCreators/corporateActionEvents";
import * as CAEventsSelectors from "../../redux/selectors/corporateActionEvents";
import { dateFormatter } from "../../utils/formatter";
import StyledDialogHeader from "../StyledDialogHeader";
import CorporateActionEventDetail from "./CorporateActionEventDetail";
import CorporateActionEventsResponses, {
  generateTableRowData,
} from "./CorporateActionEventResponses";

const InlineFormField = ({ label, children }) => (
  <Box mb={4}>
    <Grid item container>
      <Grid item md={3}>
        <Typography>{label}</Typography>
      </Grid>

      <Grid item md={9}>
        <FormControl
          style={{
            width: "100%",
          }}
        >
          {children}
        </FormControl>
      </Grid>
    </Grid>
  </Box>
);

const Section = ({ label, value }) => (
  <Box mb={2}>
    <Grid container>
      <Grid container item justifyContent="center">
        <Typography variant="subtitle1">{label}</Typography>
      </Grid>

      <Grid item>
        <Typography style={{ color: "gray" }} variant="subtitle1" className="break-all">
          {value}
        </Typography>{" "}
      </Grid>
    </Grid>
  </Box>
);

const DataGridRow = ({ label, value }) => (
  <Box mb={2}>
    <Grid container>
      <Grid item xs={3}>
        <Typography variant="subtitle1">{label}</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography style={{ color: "gray" }} variant="subtitle1">
          {value}
        </Typography>
      </Grid>
    </Grid>
  </Box>
);

const ViewCorporateActionEventDialog = ({
  open,
  handleClose,
  currentlySelectedRowData,
  setCurrentlySelectedRowData,
  currentEntityType,
  title,
  showResponses,
  isReadOnly,
}) => {
  const isUserInvestor = currentEntityType === "INVESTOR";
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const fetchCorporateActionEventsList = () => dispatch(CAEventsActionCreators.doFetchCAEvents());

  // selectors
  const corporateActionEvent = useSelector(CAEventsSelectors.selectCorporateActionEvent);
  const isFetchingEvent = useSelector(CAEventsSelectors.selectIsFetchingEvent);

  const validInvestors = corporateActionEvent?.validInvestors;
  const allResponses = corporateActionEvent?.responses;

  const isVoluntaryEvent = currentlySelectedRowData?.mandatoryOrVoluntary === "V";

  useEffect(() => {
    if (Array.isArray(validInvestors) && validInvestors.length > 0) {
      const updatedTableData = validInvestors?.map((inv) => {
        const foundResponse = allResponses?.find(
          (res) => inv.entityId === res?.entityGroup?.entityId
        );
        return generateTableRowData(foundResponse || inv);
      });

      setTableData(updatedTableData);
    }

    return () => {
      setTableData([]);
    };
  }, [allResponses, validInvestors, currentlySelectedRowData]);

  useEffect(() => {
    const fetchCorporateActionEvent = (payload) =>
      dispatch(CAEventsActionCreators.doFetchCAEventbyId(payload));

    const resetCAEventState = () => dispatch(CAEventsActionCreators.doResetCAEventState());

    if (
      currentEntityType === "EMRGO_SERVICES" &&
      currentlySelectedRowData?.mandatoryOrVoluntary === "V"
    ) {
      fetchCorporateActionEvent({
        requestPayload: { corporateActionEventId: currentlySelectedRowData?.id },
      });
    }

    return () => resetCAEventState();
  }, [
    currentlySelectedRowData?.id,
    dispatch,
    currentEntityType,
    currentlySelectedRowData?.mandatoryOrVoluntary,
  ]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="view-corporate-action-event-dialog"
    >
      <Formik
        initialValues={{ clientResponse: null }}
        enableReinitialize
        onSubmit={(values, actions) => {
          const formObject = {
            requestPayload: { response: values?.clientResponse },
            corporateActionEventId: currentlySelectedRowData?.id,
          };

          const payload = {
            requestPayload: formObject,
            successCallback: () => {
              actions.setSubmitting(false);
              handleClose();
              fetchCorporateActionEventsList();
              setCurrentlySelectedRowData(null);
            },
          };

          dispatch(CAEventsActionCreators.doSubmitClientResponse(payload));
        }}
      >
        {({ values, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <StyledDialogHeader title={title} handleClose={handleClose} />
            <DialogContent>
              {/* Details */}
              <CorporateActionEventDetail currentlySelectedRow={currentlySelectedRowData} />
              {!showResponses && (
                <>
                  <Section label="Event Terms" value={currentlySelectedRowData?.eventTerms} />

                  <Section
                    label="Additional Information"
                    value={currentlySelectedRowData?.additionalInfo}
                  />

                  <DataGridRow
                    label={"Voluntary/Mandatory"}
                    value={currentlySelectedRowData?.mandatoryOrVoluntary}
                  />
                </>
              )}

              {isVoluntaryEvent && (
                <>
                  <DataGridRow
                    label={"Client Response Deadline"}
                    value={dateFormatter(
                      currentlySelectedRowData?.responseDeadline,
                      DEFAULT_DATE_FORMAT
                    )}
                  />

                  <DataGridRow
                    label={"Market Deadline"}
                    value={
                      currentlySelectedRowData?.marketDeadline
                        ? dateFormatter(
                            currentlySelectedRowData?.marketDeadline,
                            DEFAULT_DATE_FORMAT
                          )
                        : "--"
                    }
                  />
                </>
              )}

              {showResponses && (
                <CorporateActionEventsResponses
                  tableData={tableData}
                  isFetchingEvent={isFetchingEvent}
                />
              )}

              {/* !! Textfield for investors to respond for VOLUNTARY events so disable it BASED ON THE VALUE OF ROW.VOLUNTARY on actions */}
              {isUserInvestor && !isReadOnly && (
                <InlineFormField label="Response">
                  <Field
                    fullWidth
                    component={TextField}
                    name="clientResponse"
                    value={values.clientResponse}
                    variant="filled"
                    type="text"
                    multiline
                    onKeyDown={(event) => {
                      if (event.which === 13)
                        setFieldValue("clientResponse", event.target.value + "\n");
                    }}
                    rows={4}
                  />
                </InlineFormField>
              )}
              <DialogActions>
                <Grid container justifyContent="flex-end" className="w-full">
                  <Grid item lg={2}>
                    <Button
                      fullWidth
                      onClick={() => {
                        handleClose();
                      }}
                      variant="outlined"
                      color="primary"
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {isUserInvestor && !isReadOnly && (
                  <Grid item lg={2}>
                    <Button fullWidth type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                  </Grid>
                )}
              </DialogActions>
            </DialogContent>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ViewCorporateActionEventDialog;
