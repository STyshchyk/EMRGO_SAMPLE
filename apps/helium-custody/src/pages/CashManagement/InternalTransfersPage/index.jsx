import { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import AddInternalTransferDialog from "../../../components/AddInternalTransferDialog";
import AmendInternalTransferDialog from "../../../components/AmendInternalTransferDialog";
import InternalTransferTransactionsTable from "../../../components/InternalTransferTransactionsTable";
import { internalTransferStatusEnum } from "../../../constants/wethaqAPI/cashManagement";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as billingAndPaymentsActionCreators from "../../../redux/actionCreators/cashManagement";
import * as journalsActionCreators from "../../../redux/actionCreators/journals";
import * as authSelectors from "../../../redux/selectors/auth";
import * as journalsSelectors from "../../../redux/selectors/journals";

// !INTERNAL TRANSFER PAGE COMPONENT
const InternalTransfersPage = () => {
  const { t } = useTranslation(["cash_management"]);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [openAddInternalTransferDialog, setOpenAddInternalTransferDialog] = useState(false);
  const [openAmendInternalTransferDialog, setOpenAmendInternalTransferDialog] = useState(false);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const internalTransfersList = useSelector(journalsSelectors.selectInternalTransfersList);
  const internalTrasferListIsFetching = useSelector(
    journalsSelectors.selectInternalTransactionsIsFetching
  );

  const fetchInternalTransactions = useCallback(
    () => dispatch(journalsActionCreators.doFetchInternalTransactions()),
    [dispatch]
  );
  const fetchSourceOwners = useCallback(
    () => dispatch(billingAndPaymentsActionCreators.doFetchSourceOwners()),
    [dispatch]
  );
  const fetchEmrgoOwners = useCallback(
    () => dispatch(billingAndPaymentsActionCreators.doFetchEmrgoOwners()),
    [dispatch]
  );
  const fetchDestinationOwners = useCallback(
    () => dispatch(billingAndPaymentsActionCreators.doFetchDestinationOwners()),
    [dispatch]
  );
  const fetchSourceAccounts = useCallback(
    () => dispatch(billingAndPaymentsActionCreators.doFetchSourceAccounts()),
    [dispatch]
  );
  const fetchDestinationAccounts = useCallback(
    () => dispatch(billingAndPaymentsActionCreators.doFetchDestinationAccounts()),
    [dispatch]
  );

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    fetchSourceOwners();
    fetchEmrgoOwners();
    fetchDestinationOwners();
    fetchSourceAccounts();
    fetchDestinationAccounts();
    fetchInternalTransactions();
  }, [
    fetchSourceOwners,
    fetchEmrgoOwners,
    fetchDestinationOwners,
    fetchSourceAccounts,
    fetchDestinationAccounts,
    fetchInternalTransactions,
  ]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const defaultTableActions = [
    {
      id: 1,
      label: "Amend",
      onClick: () => {
        setOpenAmendInternalTransferDialog(true);
        handleCloseMenu();
      },
      disabled: ![internalTransferStatusEnum.AWAITING_APPROVAL].includes(
        currentlySelectedRowData?.journalStatus
      ),
    },
    {
      id: 2,
      label: "Approve",
      onClick: () => {
        const updateInternalJournal = (payload) =>
          dispatch(journalsActionCreators.doUpdateInternalTransactions(payload));

        const requestPayload = {
          status: internalTransferStatusEnum.DONE,
          sourceAccountId: currentlySelectedRowData.sourceAccountId,
          destinationAccountId: currentlySelectedRowData.destinationAccountId,
        };

        updateInternalJournal({
          journalId: currentlySelectedRowData.id,
          requestPayload,
          successCallback: () => {
            handleCloseMenu();
            fetchInternalTransactions();
            fetchSourceOwners();
            fetchEmrgoOwners();
            fetchDestinationOwners();
            fetchSourceAccounts();
            fetchDestinationAccounts();
          },
        });
      },
      disabled: ![internalTransferStatusEnum.AWAITING_APPROVAL].includes(
        currentlySelectedRowData?.journalStatus
      ),
    },
    {
      id: 3,
      label: "Cancel",
      onClick: () => {
        const updateInternalJournal = (payload) =>
          dispatch(journalsActionCreators.doUpdateInternalTransactions(payload));

        const requestPayload = {
          status: internalTransferStatusEnum.CANCELLED,
          sourceAccountId: currentlySelectedRowData.sourceAccountId,
          destinationAccountId: currentlySelectedRowData.destinationAccountId,
        };

        updateInternalJournal({
          journalId: currentlySelectedRowData.id,
          requestPayload,
          successCallback: () => {
            handleCloseMenu();
            fetchInternalTransactions();
          },
        });
      },
      disabled: ![internalTransferStatusEnum.AWAITING_APPROVAL].includes(
        currentlySelectedRowData?.journalStatus
      ),
    },
  ];

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
              setOpenAddInternalTransferDialog(true);
            }}
          >
            <Typography> {"+ New Internal Transfer Request"}</Typography>
          </Button>
        </Grid>
      </Grid>
      <InternalTransferTransactionsTable
        actions={defaultTableActions}
        anchorEl={anchorEl}
        data={internalTransfersList}
        handleCloseMenu={handleCloseMenu}
        handleOpenMenu={handleOpenMenu}
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        showAllFilters
        isLoading={internalTrasferListIsFetching}
      />
      {openAddInternalTransferDialog && (
        <AddInternalTransferDialog
          open={openAddInternalTransferDialog}
          handleClose={() => {
            setOpenAddInternalTransferDialog(false);
          }}
        />
      )}
      {openAmendInternalTransferDialog && (
        <AmendInternalTransferDialog
          currentlySelectedRowData={currentlySelectedRowData}
          open={openAmendInternalTransferDialog}
          handleClose={() => {
            setOpenAmendInternalTransferDialog(false);
          }}
        />
      )}
    </Fragment>
  );
};

export default InternalTransfersPage;
