import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import moment from "moment/moment";

import AddCorporateActionEventDialog from "../../../components/AddCorporateActionEventDialog";
import CorporateActionEventsTable, {
  generateCAEventsTableRowData,
} from "../../../components/CorporateActionEventsTable";
import LoadingPage from "../../../components/LoadingPage";
import ViewCorporateActionEventDialog from "../../../components/ViewCorporateActionEventDialog";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as CAEventsActionCreators from "../../../redux/actionCreators/corporateActionEvents";
import * as paymentAndSettlementActionCreators from "../../../redux/actionCreators/paymentAndSettlement";
import * as authSelectors from "../../../redux/selectors/auth";
import * as CAEventsSelectors from "../../../redux/selectors/corporateActionEvents";
import * as paymentAndSettlementSelectors from "../../../redux/selectors/paymentAndSettlement";
import { isValidDate } from "../../../utils/dates";

const CorporateActionEvents = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openAddCorporateActionEventDialog, setOpenAddCorporateActionEventDialog] = useState(false);
  const [openViewCorporateActionEventDialog, setOpenViewCorporateActionEventDialog] =
    useState(false);
  const [title, setTitle] = useState("Corporate Action Event");

  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [showResponses, setShowResponses] = useState(true); // to render ui on dialog content based on action callback clicked

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const currentEntityType = currentEntityGroup?.entityType;

  const corporateActionEvents = useSelector(CAEventsSelectors.selectCorporateActionEventsList);
  const isFetchingCAEvents = useSelector(CAEventsSelectors.selectIsFetching);
  const paymentsList = useSelector(paymentAndSettlementSelectors.selectPaymentsList);
  const tableData = corporateActionEvents?.map((item) =>
    generateCAEventsTableRowData(item, paymentsList)
  );
  const filteredTableData = tableData?.filter((item) => {
    const actualSettlementDate = item?.actualSettlementDate;
    const recordDate = item?.recordDate;
    const exDate = item?.exDate;

    //*Event should not be displayed when SI settled after Record date & Ex date
    // Check if actualSettlementDate does not exceed recordDate or exDate
    if (isValidDate(actualSettlementDate)) {
      return (
        moment(actualSettlementDate).isSameOrBefore(moment(recordDate)) ||
        moment(actualSettlementDate).isSameOrBefore(moment(exDate))
      );
    }

    return true;
  });
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchCorporateActionEventsList = () => dispatch(CAEventsActionCreators.doFetchCAEvents());

    fetchCorporateActionEventsList();

    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());
    fetchPaymentsList();
  }, [dispatch]);

  const defaultTableActions = [
    {
      id: 1,
      label: "View",
      callback: () => {
        setTitle("Corporate Action Event");
        setShowResponses(false);
        setOpenViewCorporateActionEventDialog(true);
      },
      disabled: false,
    },
    {
      id: 2,
      label: "Amend",
      callback: () => {
        setTitle("Amend Corporate Action Event");
        setOpenAddCorporateActionEventDialog(true);
        handleCloseMenu();
      },
      disabled: false,
    },
    {
      id: 3,
      label: "Cancel",
      callback: () => {
        const cancelCorporateActionEvent = (payload) =>
          dispatch(CAEventsActionCreators.doCancelCAEvent(payload));
        const fetchCorporateActionEventsList = () =>
          dispatch(CAEventsActionCreators.doFetchCAEvents());

        cancelCorporateActionEvent({
          requestPayload: { corporateActionEventId: currentlySelectedRowData?.id },
          successCallback: () => {
            handleCloseMenu();
            fetchCorporateActionEventsList();
          },
        });
      },
      disabled: false,
    },
    {
      id: 4,
      label: "View Responses", // this is only for OPs users
      callback: () => {
        setTitle("Corporate Action Event Responses");
        setShowResponses(true);
        setOpenViewCorporateActionEventDialog(true);
      },
      // disabled: false,
      disabled: currentlySelectedRowData?.mandatoryOrVoluntary === "M", // this action is enabled only for voluntary CA events
    },
  ];

  if (isFetchingCAEvents) return <LoadingPage />;

  return (
    <Fragment>
      <Grid
        container
        alignItems="center"
        justifyContent="flex-end"
        style={{
          marginBottom: "1rem",
        }}
      >
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setOpenAddCorporateActionEventDialog(true);
            }}
          >
            <Typography> {`+ Add Corporate Action Event`}</Typography>
          </Button>
        </Grid>
      </Grid>

      <CorporateActionEventsTable
        actions={defaultTableActions}
        anchorEl={anchorEl}
        // ops should see all the CA events at all times.
        data={tableData} // based on the comment on ebme-1775
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        currentlySelectedRowData={currentlySelectedRowData}
      />
      {openAddCorporateActionEventDialog && (
        <AddCorporateActionEventDialog
          selectedRow={currentlySelectedRowData}
          setSelectedRow={setCurrentlySelectedRowData}
          open={openAddCorporateActionEventDialog}
          handleClose={() => {
            setOpenAddCorporateActionEventDialog(false);
            handleCloseMenu();
            setCurrentlySelectedRowData(null);
          }}
        />
      )}

      {openViewCorporateActionEventDialog && (
        <ViewCorporateActionEventDialog
          currentlySelectedRowData={currentlySelectedRowData}
          open={openViewCorporateActionEventDialog}
          title={title}
          currentEntityType={currentEntityType}
          handleClose={() => {
            setOpenViewCorporateActionEventDialog(false);
            setCurrentlySelectedRowData(null);
            handleCloseMenu();
            setTitle("");
          }}
          showResponses={showResponses}
        />
      )}
    </Fragment>
  );
};

export default CorporateActionEvents;
