import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import IncomingTable from "../../../components/IncomingPaymentsTable";
import ReviewSecurityDialog from "../../../components/ReviewSecurityDialog";
import SecurityTradesTable, {
  generateSecurityTradesTableRowData,
} from "../../../components/SecuritiesTradesTable";
import ViewCouponPaymentScheduleDialog from "../../../components/ViewCouponPaymentScheduleDialog";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as couponsActionCreators from "../../../redux/actionCreators/coupons";
import * as paymentAndSettlementActionCreators from "../../../redux/actionCreators/paymentAndSettlement";
import * as authSelectors from "../../../redux/selectors/auth";
import * as couponsSelectors from "../../../redux/selectors/coupons";
import * as paymentAndSettlementSelectors from "../../../redux/selectors/paymentAndSettlement";

const AgencyServices = () => {
  const { t } = useTranslation(["agency_services"]);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [openReviewSecurityInfoDialog, setOpenReviewSecurityInfoDialog] = useState(false);
  const [openViewCouponScheduleDialog, setOpenViewCouponScheduleDialog] = useState(false);

  // selectors
  const allCouponPaymentSchedules = useSelector(couponsSelectors.selectAllCouponPaymentSchedules);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const isFetchingPaymentsList = useSelector(
    paymentAndSettlementSelectors.selectIsFetchingPaymentsList
  );
  const paymentsList = useSelector(paymentAndSettlementSelectors.selectPaymentsList);

  const generatedTableData = paymentsList?.map((i) => generateSecurityTradesTableRowData(i));
  const couponPaymentScheduleId = allCouponPaymentSchedules && allCouponPaymentSchedules.find(
    (item) => item?.externalSecuritiesId === currentlySelectedRowData?.externalSecuritiesId
  )?.id;

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
    const fetchAllCoupons = () =>
      dispatch(couponsActionCreators.doFetchAllCouponPaymentSchedules());
    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());

    fetchAllCoupons();
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
      label: `${t("TableActions.Distribute Coupon")}`,
      onClick: () => {
        handleCloseMenu();
      },
      disabled: true,
    },
    {
      id: 3,
      label: `${t("TableActions.View SSI")}`,
      onClick: () => {
        handleCloseMenu();
      },
      disabled: true,
    },
    {
      id: 4,
      label: `${t("TableActions.View Coupon Schedule")}`,
      onClick: () => {
        setOpenViewCouponScheduleDialog(true);
        handleCloseMenu();
      },
      disabled: !couponPaymentScheduleId,
    },
  ];

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
        isLoading={isFetchingPaymentsList}
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
      {openViewCouponScheduleDialog && (
        <ViewCouponPaymentScheduleDialog
          couponId={couponPaymentScheduleId}
          securityData={currentlySelectedRowData?.externalSecurity}
          open={openViewCouponScheduleDialog}
          handleClose={() => {
            setOpenViewCouponScheduleDialog(false);
            handleCloseMenu();
          }}
        />
      )}
      <IncomingTable />
    </Fragment>
  );
};

export default AgencyServices;
