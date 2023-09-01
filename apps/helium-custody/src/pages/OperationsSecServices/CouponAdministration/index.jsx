import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import AllocateCouponDialog from "../../../components/AllocateCouponDialog";
import ApproveCouponAllocationDialog from "../../../components/ApproveCouponAllocationDialog";
import CouponEventsTable, {
  generateCouponEventsTableRowData,
} from "../../../components/CouponEventsTable";
import ViewCouponAllocationDialog from "../../../components/ViewCouponAllocationDialog";
import ViewCouponPaymentScheduleDialog from "../../../components/ViewCouponPaymentScheduleDialog";
import { couponAllocationStatusEnum } from "../../../constants/wethaqAPI/securitiesServices";
import { useCouponEventsTableFilters } from "../../../context/coupon-events-table-filters-context";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as billingAndPaymentsActionCreators from "../../../redux/actionCreators/cashManagement";
import * as couponsActionCreators from "../../../redux/actionCreators/coupons";
import * as paymentAndSettlementActionCreators from "../../../redux/actionCreators/paymentAndSettlement";
import * as authSelectors from "../../../redux/selectors/auth";
import * as couponsSelectors from "../../../redux/selectors/coupons";
import convertToDateOnlyInISOFormat from "../../../utils/convertToDateOnlyInISOFormat";

const CouponAdministration = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [openAllocateCouponDialog, setOpenAllocateCouponDialog] = useState(false);
  const [openApproveCouponAllocationDialog, setOpenApproveCouponAllocationDialog] = useState(false);
  const [openViewCouponAllocationDialog, setOpenViewCouponAllocationDialog] = useState(false);
  const [openViewCouponPaymentScheduleDialog, setOpenViewCouponPaymentScheduleDialog] =
    useState(false);

  const { couponEventFiltersState } = useCouponEventsTableFilters();

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const couponEvents = useSelector(couponsSelectors.selectAllCouponEvents);
  const currentListOfACLs = useSelector(authSelectors.selectCurrentListOfAcls);
  const isFetchingCouponEvents = useSelector(couponsSelectors.selectIsFetching);

  const tableData = couponEvents.map((item) => generateCouponEventsTableRowData(item));

  const hasAddCouponAllocation = currentListOfACLs.includes("Services/Coupons/Add");
  const hasApproveCouponAllocation = currentListOfACLs.includes("Services/Coupons/Approve");

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
    const fetchAllCouponsEvents = (payload) =>
      dispatch(couponsActionCreators.doFetchAllCouponEvents(payload));
    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());
    const fetchAccounts = () => dispatch(billingAndPaymentsActionCreators.doFetchAccounts());

    fetchAllCouponsEvents({
      params: {
        fromDate: convertToDateOnlyInISOFormat(couponEventFiltersState.fromDate),
        toDate: convertToDateOnlyInISOFormat(couponEventFiltersState.toDate),
        holdingsOnly: couponEventFiltersState.holdingsOnly,
      },
    });
    // fetchPaymentsList();
    fetchAccounts();
  }, [
    dispatch,
    currentEntityGroupID,
    couponEventFiltersState.fromDate,
    couponEventFiltersState.toDate,
    couponEventFiltersState.holdingsOnly,
  ]);

  const defaultTableActions = [
    {
      id: 1,
      label: "Allocate Coupon",
      onClick: () => {
        setOpenAllocateCouponDialog(true);
        handleCloseMenu();
      },
      disabled:
        !hasAddCouponAllocation ||
        ![
          couponAllocationStatusEnum.UNALLOCATED,
          couponAllocationStatusEnum.PENDING_APPROVAL,
        ].includes(currentlySelectedRowData?.couponAllocationStatus),
    },

    {
      id: 2,
      label: "Approve Coupon Allocation",
      onClick: () => {
        setOpenApproveCouponAllocationDialog(true);
        handleCloseMenu();
      },
      disabled:
        !hasApproveCouponAllocation ||
        ![couponAllocationStatusEnum.PENDING_APPROVAL].includes(
          currentlySelectedRowData?.couponAllocationStatus
        ),
    },
    {
      id: 3,
      label: "View Coupon Allocation",
      onClick: () => {
        setOpenViewCouponAllocationDialog(true);
        handleCloseMenu();
      },
    },
    {
      id: 4,
      label: "View Coupon Payment Schedule",
      onClick: () => {
        setOpenViewCouponPaymentScheduleDialog(true);
        handleCloseMenu();
      },
    },
  ];

  return (
    <Fragment>
      <CouponEventsTable
        actions={defaultTableActions}
        anchorEl={anchorEl}
        data={tableData}
        handleCloseMenu={handleCloseMenu}
        handleOpenMenu={handleOpenMenu}
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        showAllFilters
        isLoading={isFetchingCouponEvents}
      />
      {openAllocateCouponDialog && (
        <AllocateCouponDialog
          currentlySelectedRowData={currentlySelectedRowData}
          open={openAllocateCouponDialog}
          handleClose={() => {
            setOpenAllocateCouponDialog(false);
            setCurrentlySelectedRowData(null);
            handleCloseMenu();
          }}
          isLoading={isFetchingCouponEvents}
        />
      )}
      {openApproveCouponAllocationDialog && (
        <ApproveCouponAllocationDialog
          currentlySelectedRowData={currentlySelectedRowData}
          open={openApproveCouponAllocationDialog}
          handleClose={() => {
            setOpenApproveCouponAllocationDialog(false);
            setCurrentlySelectedRowData(null);
            handleCloseMenu();
          }}
        />
      )}
      {openViewCouponAllocationDialog && (
        <ViewCouponAllocationDialog
          currentlySelectedRowData={currentlySelectedRowData}
          open={openViewCouponAllocationDialog}
          handleClose={() => {
            setOpenViewCouponAllocationDialog(false);
            setCurrentlySelectedRowData(null);
            handleCloseMenu();
          }}
        />
      )}
      {openViewCouponPaymentScheduleDialog && (
        <ViewCouponPaymentScheduleDialog
          couponId={currentlySelectedRowData?.couponScheduleId}
          securityData={currentlySelectedRowData?.externalSecurity}
          open={openViewCouponPaymentScheduleDialog}
          handleClose={() => {
            setOpenViewCouponPaymentScheduleDialog(false);
            setCurrentlySelectedRowData(null);
            handleCloseMenu();
          }}
        />
      )}
    </Fragment>
  );
};

export default CouponAdministration;
