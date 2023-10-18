import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import AmendSettlementInstructionDialog from "../../../components/AmendSettlementInstructionDialog";
import CancelSettlementInstructionDialog from "../../../components/CancelSettlementInstructionDialog";
import LoadingPage from "../../../components/LoadingPage";
import RaiseBulkTradesDialog from "../../../components/RaiseBulkTradesDialog/RaiseBulkTradesDialog";
import RaiseSettlementInstructionDialog from "../../../components/RaiseSettlementInstructionDialog";
import ReviewSecurityDialog from "../../../components/ReviewSecurityDialog";
import SecurityTradesTable, {
  generateSecurityTradesTableRowData,
} from "../../../components/SecuritiesTradesTable";
import ImportSecurityTradesTableDataDialog from "../../../components/SecuritiesTradesTable/ImportSecurityTradesTableDataDialog";
import UploadPaymentConfirmationDialog from "../../../components/UploadPaymentConfirmationDialog";
import ViewCounterpartySSIDialog from "../../../components/ViewCounterpartySSIDialog";
import ViewSettlementInstructionAuditHistoryDialog from "../../../components/ViewSettlementInstructionAuditHistoryDialog";
import featureFlags from "../../../constants/featureFlags";
import { settlementInstructionStatusEnum } from "../../../constants/wethaqAPI/securitiesServices";
import { useFeatureToggle } from "../../../context/feature-toggle-context";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as accountsActionCreators from "../../../redux/actionCreators/accounts";
import * as counterpartyActionCreators from "../../../redux/actionCreators/counterparty";
import * as dropdownActionCreators from "../../../redux/actionCreators/dropdown";
import * as externalSecuritiesActionCreators from "../../../redux/actionCreators/externalSecurities";
import * as paymentAndSettlementActionCreators from "../../../redux/actionCreators/paymentAndSettlement";
import * as reportsActionCreators from "../../../redux/actionCreators/reports";
import * as accountsSelectors from "../../../redux/selectors/accounts";
import * as authSelectors from "../../../redux/selectors/auth";
import * as paymentAndSettlementSelectors from "../../../redux/selectors/paymentAndSettlement";

const CustodyAndSettlement = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["custody_and_settlement"]);
  const { checkFeatureFlag } = useFeatureToggle();

  const [isImportFileDialogOpen, setIsImportFileDialogOpen] = useState(false);
  const [isRaiseBulkTradesDialogOpen, setIsRaiseBulkTradesDialogOpen] = useState(false);
  const [hasImportedData, setHasImportedData] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [openAddSettlementInstructionDialog, setOpenAddSettlementInstructionDialog] =
    useState(false);
  const [openAmendSettlementInstructionDialog, setOpenAmendSettlementInstructionDialog] =
    useState(false);
  const [openReviewSecurityInfoDialog, setOpenReviewSecurityInfoDialog] = useState(false);
  const [openUploadPaymentConfirmationDialog, setOpenUploadPaymentConfirmationDialog] =
    useState(false);
  const [openCancelSettlementInstructionDialog, setOpenCancelSettlementInstructionDialog] =
    useState(false);

  // const [openViewNotificationsDialog, setOpenViewNotificationsDialog] = useState(false);
  const [openViewCounterpartySSIDialog, setOpenViewCounterpartySSIDialog] = useState(false);
  const [openViewSIAuditHistoryDialog, setOpenViewSIAuditHistoryDialog] = useState(false);

  const isIntlSecTradeSettlementWorkflowEnabled = checkFeatureFlag(
    featureFlags.intlSecTradeSettlementWorkflow
  );

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const isFetching = useSelector(paymentAndSettlementSelectors.selectIsFetching);
  const paymentAccounts = useSelector(accountsSelectors.selectPaymentAccounts);
  const paymentsList = useSelector(paymentAndSettlementSelectors.selectPaymentsList);
  const currentListOfACLs = useSelector(authSelectors.selectCurrentListOfAcls);
  const currentEntityGroupId = useSelector(authSelectors.selectCurrentEntityGroupId);
  const hasViewSIAuditHistoryACL = currentListOfACLs.includes("Services/Audit/View");

  // const generatedTableData = paymentsList?.map((i) => generateSecurityTradesTableRowData(i));

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const dropdownOptions = ["settlementInstructionType"];

    const fetchSecuritiyReferenceData = () =>
      dispatch(reportsActionCreators.doFetchReferenceData());
    const fetchSafeAcounts = (payload) =>
      dispatch(reportsActionCreators.doFetchSafeAccounts(payload));
    const fetchPaymentAccounts = () => dispatch(accountsActionCreators.doFetchPaymentAccounts());
    const fetchSettlementInstructionTypeOptions = () =>
      dispatch(
        dropdownActionCreators.doFetchDropdownOptions({
          options: dropdownOptions,
        })
      );
    const fetchCounterpartyList = () =>
      dispatch(counterpartyActionCreators.doFetchCounterpartyList());
    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());
    const fetchExternalSecuritiesList = () =>
      dispatch(externalSecuritiesActionCreators.doFetchExternalSecuritiesList());

    fetchSecuritiyReferenceData();
    fetchPaymentAccounts();
    fetchSettlementInstructionTypeOptions();
    fetchCounterpartyList();
    fetchPaymentsList();
    fetchExternalSecuritiesList();
    fetchSafeAcounts({ entityId: currentEntityGroupId });
    return () => {
      const resetDropdownState = () => dispatch(dropdownActionCreators.doResetDropdownState());

      resetDropdownState();
    };
  }, [dispatch, currentEntityGroupID]);

  useEffect(() => {
    const generatedTableData = paymentsList?.map((i) => generateSecurityTradesTableRowData(i));

    if (generatedTableData) {
      setTableData(generatedTableData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentsList]);

  const defaultTableActions = [
    {
      id: 1,
      label: `${t("TableActions.Review Security Info")}`,
      onClick: () => {
        setOpenReviewSecurityInfoDialog(true);
        handleCloseMenu();
      },
      disabled: !currentlySelectedRowData?.externalSecurity,
    },

    {
      id: 3,
      label: `${t("TableActions.Upload Payment Confirmation")}`,
      onClick: () => {
        setOpenUploadPaymentConfirmationDialog(true);
        handleCloseMenu();
      },
      disabled: false,
    },
    {
      id: 4,
      label: `${t("TableActions.View Counterparty SSI")}`,
      onClick: () => {
        setOpenViewCounterpartySSIDialog(true);
        handleCloseMenu();
      },
      disabled: !currentlySelectedRowData?.counterpartySSIObject,
    },
  ];

  const intlSecTradeSettlementTableActions = [
    {
      id: 5,
      label: `${t("TableActions.Amend Settlement Instruction")}`,
      onClick: () => {
        setOpenAmendSettlementInstructionDialog(true);
        handleCloseMenu();
      },
      disabled: ![
        settlementInstructionStatusEnum.ACKNOWLEDGED_ACCEPTED,
        settlementInstructionStatusEnum.UNMATCHED,
      ].includes(currentlySelectedRowData?.settlementInstructionStatus),
    },
    {
      id: 6,
      label: `${t("TableActions.Cancel Settlement Instruction")}`,
      onClick: () => {
        setOpenCancelSettlementInstructionDialog(true);
        handleCloseMenu();
      },
      disabled: ![
        settlementInstructionStatusEnum.ACKNOWLEDGED_ACCEPTED,
        settlementInstructionStatusEnum.UNMATCHED,
      ].includes(currentlySelectedRowData?.settlementInstructionStatus),
    },
    {
      id: 7,
      label: "View Audit History",
      onClick: () => {
        setOpenViewSIAuditHistoryDialog(true);
        handleCloseMenu();
      },
      disabled: !hasViewSIAuditHistoryACL,
    },
  ];
  if (isIntlSecTradeSettlementWorkflowEnabled)
    defaultTableActions.push(...intlSecTradeSettlementTableActions);

  if (isFetching) return <LoadingPage />;

  const handleCancelSettlementInstruction = () => {
    const deleteSettlementInstruction = (payload) =>
      dispatch(paymentAndSettlementActionCreators.doDeleteSettlementInstruction(payload));
    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());
    deleteSettlementInstruction({
      settlementId: currentlySelectedRowData?.id,
      successCallback: () => {
        fetchPaymentsList();
        handleCloseMenu();
        setOpenCancelSettlementInstructionDialog(false);
      },
    });
  };

  return (
    <Fragment>
      {isIntlSecTradeSettlementWorkflowEnabled && (
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          spacing={2}
          style={{
            marginBottom: "1rem",
          }}
        >
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                // handleImportCSVData();
                setIsRaiseBulkTradesDialogOpen(true);
                setHasImportedData(false);
              }}
              disabled={!hasImportedData}
            >
              Save imported Trades
            </Button>
          </Grid>

          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                setHasImportedData(false);
                setIsImportFileDialogOpen(true);
              }}
            >
              Import CSV Data
            </Button>
          </Grid>

          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                setOpenAddSettlementInstructionDialog(true);
              }}
            >
              {`+ ${t("Buttons.Add Settlement Instruction")}`}
            </Button>
          </Grid>
        </Grid>
      )}
      <SecurityTradesTable
        actions={defaultTableActions}
        anchorEl={anchorEl}
        data={tableData}
        entityUserType="INVESTOR"
        handleCloseMenu={handleCloseMenu}
        handleOpenMenu={handleOpenMenu}
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        showAllFilters
      />
      {openReviewSecurityInfoDialog && (
        <ReviewSecurityDialog
          data={currentlySelectedRowData?.externalSecurity}
          open={openReviewSecurityInfoDialog}
          handleClose={() => {
            setOpenReviewSecurityInfoDialog(false);
            handleCloseMenu();
          }}
        />
      )}
      {openUploadPaymentConfirmationDialog && (
        <UploadPaymentConfirmationDialog
          currentlySelectedRowData={currentlySelectedRowData}
          open={openUploadPaymentConfirmationDialog}
          handleClose={() => {
            setOpenUploadPaymentConfirmationDialog(false);
            handleCloseMenu();
          }}
        />
      )}
      {openAddSettlementInstructionDialog && (
        <RaiseSettlementInstructionDialog
          open={openAddSettlementInstructionDialog}
          handleClose={() => {
            setOpenAddSettlementInstructionDialog(false);
            handleCloseMenu();
          }}
        />
      )}
      {openAmendSettlementInstructionDialog && (
        <AmendSettlementInstructionDialog
          open={openAmendSettlementInstructionDialog}
          currentlySelectedRowData={currentlySelectedRowData}
          handleClose={() => {
            setOpenAmendSettlementInstructionDialog(false);
            handleCloseMenu();
          }}
        />
      )}
      {openCancelSettlementInstructionDialog && (
        <CancelSettlementInstructionDialog
          open={openCancelSettlementInstructionDialog}
          currentlySelectedRowData={currentlySelectedRowData}
          handleCancel={() => {
            handleCancelSettlementInstruction();
          }}
          handleClose={() => {
            setOpenCancelSettlementInstructionDialog(false);
            handleCloseMenu();
          }}
        />
      )}
      {openViewCounterpartySSIDialog && (
        <ViewCounterpartySSIDialog
          data={currentlySelectedRowData}
          open={openViewCounterpartySSIDialog}
          handleClose={() => {
            setOpenViewCounterpartySSIDialog(false);
            handleCloseMenu();
          }}
        />
      )}
      {openViewSIAuditHistoryDialog && (
        <ViewSettlementInstructionAuditHistoryDialog
          currentlySelectedRowData={currentlySelectedRowData}
          open={openViewSIAuditHistoryDialog}
          handleClose={() => {
            setOpenViewSIAuditHistoryDialog(false);
            setCurrentlySelectedRowData(null);
            handleCloseMenu();
          }}
        />
      )}

      {isImportFileDialogOpen && (
        <ImportSecurityTradesTableDataDialog
          setHasImportedData={setHasImportedData}
          setTableData={setTableData}
          tableData={tableData}
          open={isImportFileDialogOpen}
          handleClose={() => {
            setIsImportFileDialogOpen(false);
          }}
        />
      )}

      {isRaiseBulkTradesDialogOpen && (
        <RaiseBulkTradesDialog
          tableData={tableData}
          open={isRaiseBulkTradesDialogOpen}
          handleClose={() => {
            setIsRaiseBulkTradesDialogOpen(false);
          }}
        />
      )}
    </Fragment>
  );
};

export default CustodyAndSettlement;
