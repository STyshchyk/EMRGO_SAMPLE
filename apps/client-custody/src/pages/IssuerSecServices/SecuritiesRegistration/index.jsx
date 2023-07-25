import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import ReviewSecurityDialog from "../../../components/ReviewSecurityDialog";
import SecuritiesTable, {
  generateSecuritiesTableRowData,
} from "../../../components/SecuritiesTable";
import SubmitForSecuritiesRegistrationDialog from "../../../components/SubmitForSecuritiesRegistrationDialog";
import ViewCouponPaymentScheduleDialog from "../../../components/ViewCouponPaymentScheduleDialog";
import ViewSecuritiesRegistrationDialog from "../../../components/ViewSecuritiesRegistrationDialog";
import { admissionStatusEnum } from "../../../constants/wethaqAPI/securitiesServices";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as couponsActionCreators from "../../../redux/actionCreators/coupons";
import * as dropdownActionCreators from "../../../redux/actionCreators/dropdown";
import * as issuanceActionCreators from "../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../redux/selectors/auth";
import * as couponsSelectors from "../../../redux/selectors/coupons";
import * as issuanceSelectors from "../../../redux/selectors/issuance";

const SecuritiesRegistration = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["securitiesRegistration"]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentlySelectedRowData, setCurrentlySelectedRowData] = useState(null);
  const [openReviewSecurityInfoDialog, setOpenReviewSecurityInfoDialog] = useState(false);
  const [openSubmitForAdmissionFormDialog, setOpenSubmitForAdmissionFormDialog] = useState(false);
  const [openViewAdmissionDetailsDialog, setOpenViewAdmissionDetailsDialog] = useState(false);
  const [openViewCouponScheduleDialog, setOpenViewCouponScheduleDialog] = useState(false);

  // selectors
  const allCouponPaymentSchedules = useSelector(couponsSelectors.selectAllCouponPaymentSchedules);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const isFetchingIssuances = useSelector(issuanceSelectors.selectIsRequesting);
  const issuances = useSelector(issuanceSelectors.selectIssuancesByStatus);

  const couponPaymentScheduleId = allCouponPaymentSchedules.find(
    (item) => item?.externalSecuritiesId === currentlySelectedRowData?.externalSecuritiesId
  )?.id;
  const generatedTableData = issuances?.map((i) => generateSecuritiesTableRowData(i));
  const hasBeenSubmitted = ![admissionStatusEnum.PENDING].includes(
    currentlySelectedRowData?.status
  );

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
    const fetchIssuancesByStatus = (payload) =>
      dispatch(issuanceActionCreators.doFetchIssuancesByStatus(payload));
    const fetchAllCoupons = () =>
      dispatch(couponsActionCreators.doFetchAllCouponPaymentSchedules());
    const fetchDropdownOptions = (payload) =>
      dispatch(dropdownActionCreators.doFetchDropdownOptions(payload));

    fetchIssuancesByStatus({
      status: "AdmissionSettlement",
      requestPayload: {
        columns: [
          "id",
          "name",
          "status",
          "issuanceAmount",
          "wsn",
          "admissionStatus",
          "admissionDateSubmitted",
          "admissionDateAccepted",
          "issueDate",
          "externalSecuritiesId",
        ],
        refColumns: [
          "currencyName",
          "denominationName",
          "frequencyName",
          "projectTeam.group.entity",
          "externalSecurities.[currencyName,frequencyName,denominationName]",
          "csdName",
        ],
      },
    });

    fetchAllCoupons();

    fetchDropdownOptions({
      options: ["CSDOptions"],
    });

    return () => {
      const resetDropdownState = () => dispatch(dropdownActionCreators.doResetDropdownState());

      resetDropdownState();
    };
  }, [dispatch]);

  const actions = [
    {
      id: 1,
      label: hasBeenSubmitted
        ? `${t("securitiesRegistration:TableActions.View Securities Registration")}`
        : `${t("securitiesRegistration:TableActions.Submit for Securities Registration")}`,
      onClick: hasBeenSubmitted
        ? () => {
            setOpenViewAdmissionDetailsDialog(true);
            handleCloseMenu();
          }
        : () => {
            setOpenSubmitForAdmissionFormDialog(true);
            handleCloseMenu();
          },
      disabled: false,
    },
    {
      id: 2,
      label: `${t("securitiesRegistration:TableActions.Review Security Info")}`,
      onClick: () => {
        setOpenReviewSecurityInfoDialog(true);
        handleCloseMenu();
      },
      disabled: !currentlySelectedRowData?.externalSecuritiesId,
    },
    {
      id: 3,
      label: `${t("securitiesRegistration:TableActions.View Coupon Schedule")}`,
      onClick: () => {
        setOpenViewCouponScheduleDialog(true);
        handleCloseMenu();
      },
      disabled: !couponPaymentScheduleId,
    },
  ];

  return (
    <Fragment>
      <SecuritiesTable
        actions={actions}
        anchorEl={anchorEl}
        data={generatedTableData}
        handleCloseMenu={handleCloseMenu}
        handleOpenMenu={handleOpenMenu}
        setAnchorEl={setAnchorEl}
        setCurrentlySelectedRowData={setCurrentlySelectedRowData}
        isLoading={isFetchingIssuances}
        entityUserType="ISSUER"
      />
      {openSubmitForAdmissionFormDialog && (
        <SubmitForSecuritiesRegistrationDialog
          sukukData={currentlySelectedRowData}
          open={openSubmitForAdmissionFormDialog}
          handleClose={() => {
            setOpenSubmitForAdmissionFormDialog(false);
            handleCloseMenu();
          }}
        />
      )}
      {openViewAdmissionDetailsDialog && (
        <ViewSecuritiesRegistrationDialog
          sukukData={currentlySelectedRowData}
          open={openViewAdmissionDetailsDialog}
          handleClose={() => {
            setOpenViewAdmissionDetailsDialog(false);
            handleCloseMenu();
          }}
        />
      )}
      {openReviewSecurityInfoDialog && (
        <ReviewSecurityDialog
          data={currentlySelectedRowData?.externalSecurities}
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
          securityData={currentlySelectedRowData?.externalSecurities}
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

export default SecuritiesRegistration;
