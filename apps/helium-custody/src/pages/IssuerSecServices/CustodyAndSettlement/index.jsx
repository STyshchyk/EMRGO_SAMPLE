import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import LoadingPage from "../../../components/LoadingPage";
import ReviewSecurityDialog from "../../../components/ReviewSecurityDialog";
import SecurityTradesTable, {
  generateSecurityTradesTableRowData,
} from "../../../components/SecuritiesTradesTable";
import ViewSSIDialog from "../../../components/ViewSSIDialog";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as accountsActionCreators from "../../../redux/actionCreators/accounts";
import * as paymentAndSettlementActionCreators from "../../../redux/actionCreators/paymentAndSettlement";
import * as accountsSelectors from "../../../redux/selectors/accounts";
import * as authSelectors from "../../../redux/selectors/auth";
import * as paymentAndSettlementSelectors from "../../../redux/selectors/paymentAndSettlement";

const CustodyAndSettlement = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["custody_and_settlement"]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);

  const [openReviewSecurityInfoDialog, setOpenReviewSecurityInfoDialog] = useState(false);
  const [openViewSSIDialog, setOpenViewSSIDialog] = useState(false);
  // const [openViewNotificationsDialog, setOpenViewNotificationsDialog] = useState(false);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const paymentAccounts = useSelector(accountsSelectors.selectPaymentAccounts);
  const paymentsList = useSelector(paymentAndSettlementSelectors.selectPaymentsList);

  const isFetchingPaymentsData = useSelector(paymentAndSettlementSelectors.selectIsFetching);
  const isFetchingPaymentAccounts = useSelector(accountsSelectors.selectIsFetching);

  const generatedTableData = paymentsList?.map((i) => generateSecurityTradesTableRowData(i));

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
    const fetchPaymentAccounts = () => dispatch(accountsActionCreators.doFetchPaymentAccounts());
    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());

    fetchPaymentAccounts();
    fetchPaymentsList();
  }, [dispatch, currentEntityGroupID]);

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
      id: 2,
      label: `${t("TableActions.View SSI")}`,
      onClick: () => {
        setOpenViewSSIDialog(true);
        handleCloseMenu();
      },
      disabled: true,
    },
    {
      id: 3,
      label: `${t("TableActions.View Notifications")}`,
      onClick: () => {
        // setOpenViewNotificationsDialog(true);
        handleCloseMenu();
      },
      disabled: true,
    },
  ];

  if (isFetchingPaymentsData || isFetchingPaymentAccounts) return <LoadingPage />;

  return (
    <Fragment>
      <SecurityTradesTable
        actions={defaultTableActions}
        anchorEl={anchorEl}
        data={generatedTableData}
        handleCloseMenu={handleCloseMenu}
        handleOpenMenu={handleOpenMenu}
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        showAllFilters
        entityUserType="ISSUER"
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
      {openViewSSIDialog && (
        <ViewSSIDialog
          operationsMode
          paymentAccounts={paymentAccounts}
          currentlySelectedRowData={currentlySelectedRowData}
          open={openViewSSIDialog}
          handleClose={() => {
            setOpenViewSSIDialog(false);
            handleCloseMenu();
          }}
        />
      )}
    </Fragment>
  );
};

export default CustodyAndSettlement;
