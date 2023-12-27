import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment/moment";

import { isValidDate } from "../../../../../client-custody/src/helpers/table";
import * as paymentAndSettlementActionCreators from "../../../../../client-custody/src/redux/actionCreators/paymentAndSettlement";
import * as paymentAndSettlementSelectors from "../../../../../client-custody/src/redux/selectors/paymentAndSettlement";
import CorporateActionEventsTable, {
  generateCAEventsTableRowData,
} from "../../../components/CorporateActionEventsTable";
import LoadingPage from "../../../components/LoadingPage";
import ViewCorporateActionEventDialog from "../../../components/ViewCorporateActionEventDialog";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as CAEventsActionCreators from "../../../redux/actionCreators/corporateActionEvents";
import * as authSelectors from "../../../redux/selectors/auth";
import * as CAEventsSelectors from "../../../redux/selectors/corporateActionEvents";

const CorporateActionEvents = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [openViewCorporateActionEventDialog, setOpenViewCorporateActionEventDialog] =
    useState(false);
  const [title, setTitle] = useState("Corporate Action Event");
  const [isReadOnly, setIsReadOnly] = useState(true);

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
    const actualSettlementDate = moment(item?.actualSettlementDate).startOf("day").toISOString();
    const recordDate = moment(item?.recordDate).startOf("day").toISOString();
    const exDate = moment(item?.exDate).startOf("day").toISOString();
    //*Event should not be displayed when SI settled after Record date & Ex date
    // Check if actualSettlementDate does not exceed recordDate or exDate
    if (isValidDate(actualSettlementDate)) {
      return (
        moment(actualSettlementDate).isSameOrBefore(moment(recordDate)) ||
        moment(actualSettlementDate).isSameOrBefore(moment(exDate))
      );
    }

    return false;
  });
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    // fetches those where inv holds position in security (BE filtering it based on entityId?)
    const fetchCorporateActionEventsList = () => dispatch(CAEventsActionCreators.doFetchCAEvents());
    fetchCorporateActionEventsList();

    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());
    fetchPaymentsList();
  }, [dispatch]);

  // !change label based on BRD
  const defaultTableActions = [
    {
      id: 1,
      label: "View",
      callback: () => {
        setTitle("Corporate Action Event");
        setIsReadOnly(true);
        setOpenViewCorporateActionEventDialog(true);
      },
      disabled: false,
    },
    {
      id: 2,
      label: "Respond",
      callback: () => {
        setTitle("Corporate Action Event");
        setIsReadOnly(false);
        setOpenViewCorporateActionEventDialog(true);
      },
      disabled: currentlySelectedRowData?.mandatoryOrVoluntary === "M", // this action is enabled only for voluntary CA events inv
    },
  ];

  if (isFetchingCAEvents) return <LoadingPage />;

  return (
    <Fragment>
      <CorporateActionEventsTable
        actions={defaultTableActions}
        anchorEl={anchorEl}
        data={filteredTableData}
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        currentlySelectedRowData={currentlySelectedRowData}
      />

      {openViewCorporateActionEventDialog && (
        <ViewCorporateActionEventDialog
          currentlySelectedRowData={currentlySelectedRowData}
          open={openViewCorporateActionEventDialog}
          title={title}
          currentEntityType={currentEntityType}
          handleClose={() => {
            setOpenViewCorporateActionEventDialog(false);
            setCurrentlySelectedRowData(null);
            setTitle("");
            handleCloseMenu();
          }}
          isReadOnly={isReadOnly}
          setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        />
      )}
    </Fragment>
  );
};

export default CorporateActionEvents;
