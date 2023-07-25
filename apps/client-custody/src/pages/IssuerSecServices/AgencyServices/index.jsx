import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import LoadingPage from "../../../components/LoadingPage";
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
  const dispatch = useDispatch();
  const { t } = useTranslation(["agency_services"]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [openReviewSecurityInfoDialog, setOpenReviewSecurityInfoDialog] = useState(false);
  const [openViewCouponScheduleDialog, setOpenViewCouponScheduleDialog] = useState(false);

  // selectors
  const allCouponPaymentSchedules = useSelector(couponsSelectors.selectAllCouponPaymentSchedules);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const isFetching = useSelector(paymentAndSettlementSelectors.selectIsFetching);
  const paymentsList = useSelector(paymentAndSettlementSelectors.selectPaymentsList);

  const generatedTableData = paymentsList?.map((i) => generateSecurityTradesTableRowData(i));
  const couponPaymentScheduleId = allCouponPaymentSchedules.find(
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
    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());
    const fetchAllCoupons = () =>
      dispatch(couponsActionCreators.doFetchAllCouponPaymentSchedules());

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
      label: `${t("TableActions.View Coupon Schedule")}`,
      onClick: () => {
        setOpenViewCouponScheduleDialog(true);
        handleCloseMenu();
      },
      disabled: !couponPaymentScheduleId,
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
      label: `${t("TableActions.Upload Payment Confirmation")}`,
      onClick: () => {
        handleCloseMenu();
      },
      disabled: true,
    },
    {
      id: 5,
      label: `${t("TableActions.View Notifications")}`,
      onClick: () => {
        handleCloseMenu();
      },
      disabled: true,
    },
  ];

  if (isFetching) return <LoadingPage />;

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
    </Fragment>
  );
};

export default AgencyServices;
