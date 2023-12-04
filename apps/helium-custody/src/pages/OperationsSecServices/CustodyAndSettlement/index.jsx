import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import moment from "moment";
import useDeepCompareEffect from "use-deep-compare-effect";

import AmendSettlementInstructionDialog from "../../../components/AmendSettlementInstructionDialog";
import ChangeSettlementInstructionStatusDialog from "../../../components/ChangeSettlementInstructionStatusDialog";
import IncomingTable from "../../../components/IncomingPaymentsTable";
import LoadingPage from "../../../components/LoadingPage";
import RaiseSettlementInstructionDialog from "../../../components/RaiseSettlementInstructionDialog";
import SecurityTradesTable, {
  generateSecurityTradesTableRowData,
} from "../../../components/SecuritiesTradesTable";
import ViewCounterpartySSIDialog from "../../../components/ViewCounterpartySSIDialog";
import ViewPaymentEvidenceDialog from "../../../components/ViewPaymentEvidenceDialog";
import ViewSettlementInstructionAuditHistoryDialog from "../../../components/ViewSettlementInstructionAuditHistoryDialog";
import ViewSSIDialog from "../../../components/ViewSSIDialog";
import ViewTradeDetailsDialog from "../../../components/ViewTradeDetailsDialog";
import featureFlags from "../../../constants/featureFlags";
import {
  securityTradeSettlementStatusEnum,
  settlementInstructionStatusEnum,
} from "../../../constants/wethaqAPI/securitiesServices";
import { useFeatureToggle } from "../../../context/feature-toggle-context";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as accountsActionCreators from "../../../redux/actionCreators/accounts";
import * as counterpartyActionCreators from "../../../redux/actionCreators/counterparty";
import * as dropdownActionCreators from "../../../redux/actionCreators/dropdown";
import * as entitiesActionCreators from "../../../redux/actionCreators/entities";
import * as externalSecuritiesActionCreators from "../../../redux/actionCreators/externalSecurities";
import * as paymentAndSettlementActionCreators from "../../../redux/actionCreators/paymentAndSettlement";
import * as safekeepingActionCreators from "../../../redux/actionCreators/safekeeping";
import * as securitiesServicesActionCreators from "../../../redux/actionCreators/securitiesServices";
import * as accountsSelectors from "../../../redux/selectors/accounts";
import * as authSelectors from "../../../redux/selectors/auth";
import * as paymentAndSettlementSelectors from "../../../redux/selectors/paymentAndSettlement";
import * as securitiesServicesSelectors from "../../../redux/selectors/securitiesServices";
import { dateFormatter } from "../../../utils/formatter";

const CustodyAndSettlement = () => {
  const dispatch = useDispatch();
  const { checkFeatureFlag } = useFeatureToggle();
  const { t } = useTranslation(["custody_and_settlement"]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [openViewPaymentEvidenceDialog, setOpenViewPaymentEvidenceDialog] = useState(false);
  const [openViewSSIDialog, setOpenViewSSIDialog] = useState(false);
  const [openViewCounterpartySSIDialog, setOpenViewCounterpartySSIDialog] = useState(false);
  const [openChangeSettlementInstructionDialog, setOpenChangeSettlementInstructionDialog] =
    useState(false);
  const [requestedSettlementInstructionStatus, setRequestedSettlementInstructionStatus] =
    useState(null);
  const [openViewSIAuditHistoryDialog, setOpenViewSIAuditHistoryDialog] = useState(false);
  const [openAddSettlementInstructionDialog, setOpenAddSettlementInstructionDialog] =
    useState(false);
  const [openAmendSettlementInstructionDialog, setOpenAmendSettlementInstructionDialog] =
    useState(false);
  const [openViewTradeDetailsDialog, setOpenViewTradeDetailsDialog] = useState(false);

  const isIntlSecTradeSettlementWorkflowEnabled = checkFeatureFlag(
    featureFlags.intlSecTradeSettlementWorkflow
  );

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentUserId = useSelector(authSelectors.selectUserId);
  const currentListOfACLs = useSelector(authSelectors.selectCurrentListOfAcls);
  const fileURLsFetched = useSelector(securitiesServicesSelectors.selectFileURLsFetched);
  const paymentAccounts = useSelector(accountsSelectors.selectPaymentAccounts);
  const paymentsList = useSelector(paymentAndSettlementSelectors.selectPaymentsList);
  const isFetchingPaymentsList = useSelector(
    paymentAndSettlementSelectors.selectIsFetchingPaymentsList
  );
  const isFetching = useSelector(paymentAndSettlementSelectors.selectIsFetching);

  const currentEntityGroupID = currentEntityGroup?.id;
  // BE needs to return info on attrs in ext sec obj on payments/v2/payment/list
  const generatedTableData = paymentsList?.map((i) => generateSecurityTradesTableRowData(i));
  const hasApproveTradeACL = currentListOfACLs.includes("Blotter/Approve");
  const hasSettleTradeACL = currentListOfACLs.includes("Blotter/Settle");
  const hasViewSIAuditHistoryACL = currentListOfACLs.includes("Services/Audit/View");
  const currentEntityGroupEntityType = currentEntityGroup?.entityType;
  const settlementId = currentlySelectedRowData?.id;
  const isFileAlreadyFetched = fileURLsFetched[currentlySelectedRowData?.paymentConfirmationFileId];
  const isPrimSecTrade = Boolean(currentlySelectedRowData?.externalSecurity?.isPrimaryIssuance);
  const settlementInstructionAuditHistoryDataList = useSelector(
    paymentAndSettlementSelectors.selectSettlementInstructionAuditHistoryDataList
  );
  const fetchSettlementInstructionAuditData = (payload) =>
    dispatch(paymentAndSettlementActionCreators.doFetchSettlementInstructionAuditData(payload));
  const resetSettlementInstructionAuditData = () =>
    dispatch(paymentAndSettlementActionCreators.doResetSettlementInstructionAuditData());
  const changeSettlementInstructionStatus = (payload) =>
    dispatch(paymentAndSettlementActionCreators.doChangeSettlementInstructionChange(payload));

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
    const dropdownOptions = [
      "settlementInstructionType",
      "settlementInstructionUnmatchedReason",
      "settlementInstructionFailedReason",
      "settlementInstructionRejectedReason",
    ];
    const fetchSettlementInstructionAuditData = (payload) =>
      dispatch(paymentAndSettlementActionCreators.doFetchSettlementInstructionAuditData(payload));
    const fetchCounterpartyList = () =>
      dispatch(counterpartyActionCreators.doFetchCounterpartyList());
    const fetchDropdownOptions = (payload) =>
      dispatch(dropdownActionCreators.doFetchDropdownOptions(payload));
    const fetchEntities = (payload) =>
      dispatch(entitiesActionCreators.doFetchLegacyEntities(payload));
    const fetchExternalSecuritiesList = () =>
      dispatch(externalSecuritiesActionCreators.doFetchExternalSecuritiesList());
    const fetchPaymentAccounts = () => dispatch(accountsActionCreators.doFetchPaymentAccounts());
    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());
    const resetFilesState = (payload) =>
      dispatch(securitiesServicesActionCreators.doResetFilesState(payload));
    const fetchSafekeepingAccounts = (payload) =>
      dispatch(safekeepingActionCreators.doReadAccounts(payload));

    if (currentEntityGroupEntityType === "EMRGO_SERVICES") {
      fetchEntities();
    }

    fetchDropdownOptions({
      options: dropdownOptions,
    });
    fetchPaymentAccounts();
    fetchPaymentsList();

    fetchExternalSecuritiesList();
    fetchCounterpartyList();
    fetchSafekeepingAccounts();

    return () => {
      resetFilesState();
    };
  }, [dispatch, currentEntityGroupID, currentEntityGroupEntityType]);

  useDeepCompareEffect(() => {
    const fetchPaymentConfirmationFile = (payload) =>
      dispatch(securitiesServicesActionCreators.doFetchFile(payload));

    if (currentlySelectedRowData && !isFileAlreadyFetched && openViewPaymentEvidenceDialog) {
      const { entityId, entityGroupId, paymentConfirmationFileId, sukukId, id, externalSecurity } =
        currentlySelectedRowData;

      if (paymentConfirmationFileId) {
        const requestPayload = {
          entityGroupId,
          entityId,
          fileName: paymentConfirmationFileId,
          settlementInstructionId: id,
          sukukId,
          type: "custodyAndClearing",
          isPrimaryIssuance: externalSecurity?.isPrimaryIssuance,
        };

        fetchPaymentConfirmationFile(requestPayload);
      }
    }
  }, [currentlySelectedRowData, openViewPaymentEvidenceDialog, dispatch]);

  const defaultTableActions = [
    {
      id: 1,
      label: `${t("TableActions.Settle")}`,
      onClick: () => {
        const settleTrade = (payload) =>
          dispatch(paymentAndSettlementActionCreators.doTradeSettlementRequest(payload));
        const fetchPaymentsList = () =>
          dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());

        settleTrade({
          id: currentlySelectedRowData.tradeId,
          successCallback: () => {
            fetchPaymentsList();
          },
        });

        handleCloseMenu();
      },
      disabled:
        !hasSettleTradeACL ||
        ![securityTradeSettlementStatusEnum.primaryIssuance.APPROVED].includes(
          currentlySelectedRowData?.securityTradeSettlementStatus
        ),
      hidden: !isPrimSecTrade,
    },
    {
      id: 2,
      label: `${t("TableActions.Approve")}`,
      onClick: () => {
        const approveTrade = (payload) =>
          dispatch(paymentAndSettlementActionCreators.doTradeApprovalRequest(payload));
        const fetchPaymentsList = () =>
          dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());

        approveTrade({
          id: currentlySelectedRowData.tradeId,
          successCallback: () => {
            fetchPaymentsList();
          },
        });

        handleCloseMenu();
      },
      disabled:
        !hasApproveTradeACL ||
        ![securityTradeSettlementStatusEnum.primaryIssuance.INITIATE_SETTLEMENT].includes(
          currentlySelectedRowData?.securityTradeSettlementStatus
        ),
      hidden: !isPrimSecTrade,
    },
    {
      id: 3,
      label: `${t("TableActions.View SSI")}`, // TODO: FIND OUT IF THIS IS STILL NEEDED
      onClick: () => {
        setOpenViewSSIDialog(true);
      },
      disabled: true,
    },
    {
      id: 4,
      label: `${t("TableActions.View Counterparty SSI")}`,
      onClick: () => {
        setOpenViewCounterpartySSIDialog(true);
        handleCloseMenu();
      },
      disabled: !currentlySelectedRowData?.counterpartySSIObject,
      hidden: isPrimSecTrade,
    },
    {
      id: 5,
      label: `${t("TableActions.View Trade Details")}`,
      onClick: () => {
        setOpenViewTradeDetailsDialog(true);
        handleCloseMenu();
      },
      // disabled: !currentlySelectedRowData?.counterpartySSIObject,
      hidden: isPrimSecTrade,
    },

    {
      id: 6,
      label: `${t("TableActions.View Payment Evidence")}`,
      onClick: () => {
        setOpenViewPaymentEvidenceDialog(true);
        handleCloseMenu();
      },
      disabled: !currentlySelectedRowData?.paymentConfirmationFileId,
    },
  ];

  const intlSecTradeSettlementTableActions = [
    {
      id: 7,
      label: `${t("TableActions.Set to Unmatched")}`,
      onClick: () => {
        setRequestedSettlementInstructionStatus(settlementInstructionStatusEnum.UNMATCHED);
        setOpenChangeSettlementInstructionDialog(true);
        handleCloseMenu();
      },
      disabled: ![
        settlementInstructionStatusEnum.ACKNOWLEDGED_ACCEPTED,
        settlementInstructionStatusEnum.MATCHED,
      ].includes(currentlySelectedRowData?.settlementInstructionStatus),
      hidden: isPrimSecTrade,
    },

    {
      id: 8,
      label: `${t("TableActions.Set to Matched")}`,
      onClick: () => {
        const fetchPaymentsList = () =>
          dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());

        changeSettlementInstructionStatus({
          settlementId: currentlySelectedRowData?.id,
          requestPayload: {
            status: settlementInstructionStatusEnum.MATCHED,
          },
          successCallback: () => {
            fetchPaymentsList();
            handleCloseMenu();
          },
        });
      },
      disabled: ![
        settlementInstructionStatusEnum.UNMATCHED,
        settlementInstructionStatusEnum.SETTLED,
        settlementInstructionStatusEnum.FAILED,
      ].includes(currentlySelectedRowData?.settlementInstructionStatus),
      hidden: isPrimSecTrade,
    },
    {
      id: 9,
      label: `${t("TableActions.Set to Settled")}`,
      onClick: () => {
        const settlementDate = dateFormatter(
          currentlySelectedRowData?.settlementDate,
          "DD/MM/YYYY"
        );
        const currentDate = moment();
        if (currentDate.isBefore(moment(settlementDate, "DD/MM/YYYY"))) {
          toast.warning("Settlement Instruction can't be settled before settlement date", 500);
          handleCloseMenu();
          return;
        }
        const fetchPaymentsList = () =>
          dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());

        changeSettlementInstructionStatus({
          settlementId: currentlySelectedRowData?.id,
          requestPayload: {
            status: settlementInstructionStatusEnum.SETTLED,
          },
          successCallback: () => {
            fetchPaymentsList();
            handleCloseMenu();
          },
        });
      },
      disabled: ![
        settlementInstructionStatusEnum.MATCHED,
        settlementInstructionStatusEnum.FAILED,
      ].includes(currentlySelectedRowData?.settlementInstructionStatus),
      hidden: isPrimSecTrade,
    },
    {
      id: 10,
      label: `${t("TableActions.Set to Failed")}`,
      onClick: () => {
        setRequestedSettlementInstructionStatus(settlementInstructionStatusEnum.FAILED);
        setOpenChangeSettlementInstructionDialog(true);
        handleCloseMenu();
      },
      disabled: [
        settlementInstructionStatusEnum.FAILED,
        settlementInstructionStatusEnum.REJECTED,
        settlementInstructionStatusEnum.ACKNOWLEDGED_ACCEPTED,
        settlementInstructionStatusEnum.CANCELLED,
        settlementInstructionStatusEnum.CANCELLED_REQUESTED,
        settlementInstructionStatusEnum.UNMATCHED,
      ].includes(currentlySelectedRowData?.settlementInstructionStatus),
      hidden: isPrimSecTrade,
    },

    {
      id: 11,
      label: `${t("TableActions.Set to Rejected")}`,
      onClick: () => {
        setRequestedSettlementInstructionStatus(settlementInstructionStatusEnum.REJECTED);
        setOpenChangeSettlementInstructionDialog(true);
        handleCloseMenu();
      },
      disabled: [
        settlementInstructionStatusEnum.REJECTED,
        settlementInstructionStatusEnum.CANCELLED,
        settlementInstructionStatusEnum.CANCELLED_REQUESTED,
        settlementInstructionStatusEnum.SETTLED,
      ].includes(currentlySelectedRowData?.settlementInstructionStatus),
      hidden: isPrimSecTrade,
    },
    {
      id: 15,
      label: "Set to Canceled",
      onClick: () => {
        setRequestedSettlementInstructionStatus(settlementInstructionStatusEnum.CANCELLED);
        setOpenChangeSettlementInstructionDialog(true);
        handleCloseMenu();
      },
      disabled: ![
        settlementInstructionStatusEnum.CANCELLED_REQUESTED,
        settlementInstructionStatusEnum.REJECTED,
      ].includes(currentlySelectedRowData?.settlementInstructionStatus),
    },

    {
      id: 12,
      label: "View Audit History",
      onClick: () => {
        setOpenViewSIAuditHistoryDialog(true);
        handleCloseMenu();
      },
      disabled: !hasViewSIAuditHistoryACL,
      hidden: isPrimSecTrade,
    },

    {
      id: 13,
      label: `${t("TableActions.Amend Settlement Instruction")}`,
      onClick: () => {
        setOpenAmendSettlementInstructionDialog(true);
        handleCloseMenu();
      },
      disabled: ![
        settlementInstructionStatusEnum.ACKNOWLEDGED_ACCEPTED,
        settlementInstructionStatusEnum.UNMATCHED,
        settlementInstructionStatusEnum.REJECTED,
      ].includes(currentlySelectedRowData?.settlementInstructionStatus),
    },

    {
      id: 14,
      label: "Approve Settlement Instruction",
      onClick: () => {
        fetchSettlementInstructionAuditData({
          settlementId,
          successCallback: (data) => {
            const raised =
              Array.isArray(data) &&
              data.filter((settlement) => settlement.auditSubType === "Inserted");
            if (raised[0]?.userId === currentUserId)
              toast.warning("Another officer should be able to approve current SI", 500);
            else {
              setRequestedSettlementInstructionStatus(
                settlementInstructionStatusEnum.ACKNOWLEDGED_ACCEPTED
              );
              setOpenChangeSettlementInstructionDialog(true);
              handleCloseMenu();
            }
            resetSettlementInstructionAuditData();
          },
        });
      },
      disabled: ![settlementInstructionStatusEnum.APPROVAL_REQUIRED].includes(
        currentlySelectedRowData?.settlementInstructionStatus
      ),
    },
  ];

  if (isIntlSecTradeSettlementWorkflowEnabled)
    defaultTableActions.push(...intlSecTradeSettlementTableActions);

  if (isFetching) return <LoadingPage />;

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
              setOpenAddSettlementInstructionDialog(true);
            }}
          >
            <Typography> {`+ ${t("Buttons.Add Settlement Instruction")}`}</Typography>
          </Button>
        </Grid>
      </Grid>
      <SecurityTradesTable
        actions={defaultTableActions}
        anchorEl={anchorEl}
        data={generatedTableData}
        handleCloseMenu={handleCloseMenu}
        handleOpenMenu={handleOpenMenu}
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        showAllFilters
        isLoading={isFetchingPaymentsList}
      />
      {openViewPaymentEvidenceDialog && (
        <ViewPaymentEvidenceDialog
          open={openViewPaymentEvidenceDialog}
          handleClose={() => {
            setOpenViewPaymentEvidenceDialog(false);
            handleCloseMenu();
          }}
          currentlySelectedRowData={currentlySelectedRowData}
        />
      )}
      {openViewSSIDialog && (
        <ViewSSIDialog
          operationsMode
          paymentAccounts={paymentAccounts}
          open={openViewSSIDialog}
          handleClose={() => {
            setOpenViewSSIDialog(false);
            handleCloseMenu();
          }}
          currentlySelectedRowData={currentlySelectedRowData}
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
      {openViewTradeDetailsDialog && (
        <ViewTradeDetailsDialog
          currentlySelectedRowData={currentlySelectedRowData}
          open={openViewTradeDetailsDialog}
          handleClose={() => {
            setOpenViewTradeDetailsDialog(false);
            handleCloseMenu();
          }}
        />
      )}
      {openChangeSettlementInstructionDialog && (
        <ChangeSettlementInstructionStatusDialog
          requestedSettlementInstructionStatus={requestedSettlementInstructionStatus}
          currentlySelectedRowData={currentlySelectedRowData}
          open={openChangeSettlementInstructionDialog}
          handleClose={() => {
            setOpenChangeSettlementInstructionDialog(false);
            setCurrentlySelectedRowData(null);
            setRequestedSettlementInstructionStatus(null);
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

      <IncomingTable />
    </Fragment>
  );
};

export default CustodyAndSettlement;
