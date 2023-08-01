import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";

import * as kycActionCreators from "../../../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../../../redux/selectors/auth";
import DeleteAccountDialog from "../../DeletePaymentAccountDialog";
import EditPaymentAccountFormDialog from "../../EditPaymentAccountFormDialog";

const generateInitialValues = (rowData) => ({
  accountNo: rowData?.accountNo,
  address: rowData?.address,
  bankName: rowData?.bankName,
  bsbCode: rowData?.bsbCode,
  city: rowData?.city,
  country: {
    label: rowData?.country,
    value: rowData?.countryId,
  },
  currency: {
    label: rowData?.currency,
    value: rowData?.currencyId,
  },
  iban: rowData?.iban,
  ifscCode: rowData?.ifscCode,
  label: rowData?.label,
  name: rowData?.name,
  postcode: rowData?.postcode,
  routingNo: rowData?.routingNo,
  swift: rowData?.swift,
  sortCode: rowData?.sortCode,
  supportingDoc: rowData?.supportingDoc,
});

const PaymentAccountsTableActionMenu = ({ rowData }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditAccountFormDialog, setOpenEditAccountFormDialog] = useState(false);
  const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);
  const { t } = useTranslation(["cash_management"]);
  const { entityId } = useParams();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;

  const hasManageAccountsACL = currentEntityGroup?.accessControls.some(
    (acl) => acl?.key === "Account/Manage"
  );
  const isAdmin = currentEntityGroup?.entityType === "EMRGO_SERVICES";

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseEditAccountDialog = () => {
    setOpenEditAccountFormDialog(false);
    handleCloseMenu();
  };

  const handleCloseDeleteAccountDialog = () => {
    setOpenDeleteAccountDialog(false);
    handleCloseMenu();
  };

  const handleClickOnSetAsDefault = () => {
    const setAccountAsDefault = (payload) =>
      dispatch(kycActionCreators.doSetPaymentAccountAsDefault(payload));
    const requestPayload = {
      accountId: rowData?.id,
    };

    setAccountAsDefault(requestPayload);
  };

  const handleClickOnDeleteAccount = () => {
    setOpenDeleteAccountDialog(true);
    handleCloseMenu();
  };

  const handleClickOnEditAccount = () => {
    setOpenEditAccountFormDialog(true);
    handleCloseMenu();
  };

  const handleClickOnViewSupportingDocument = () => {
    const doFetchUploadedSupportingDocumentFile = (payload) =>
      dispatch(kycActionCreators.doFetchUploadedSupportingDocumentFile(payload));

    const payload = {
      type: "accountSupporting",
      fileName: rowData?.supportingDoc,
      entityId: isAdmin ? rowData?.entityGroupId : currentEntityGroupID,
    };

    doFetchUploadedSupportingDocumentFile(payload);
    handleCloseMenu();
  };

  const handleClickOnValidate = () => {
    const doValidatePaymentAccount = (payload) =>
      dispatch(kycActionCreators.doValidatePaymentAccount(payload));
    const fetchPaymentAccountsByEntityID = (payload) =>
      dispatch(kycActionCreators.doFetchPaymentAccountsByEntityID(payload));

    const payload = {
      accountId: rowData?.id,
      requestPayload: {
        isValidated: true,
      },
      successCallback: () => {
        fetchPaymentAccountsByEntityID({
          entityId,
        });
      },
    };

    doValidatePaymentAccount(payload);
    handleCloseMenu();
  };

  return (
    <Fragment>
      <IconButton aria-label="action" size="small" onClick={handleMenuClick}>
        <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        disableScrollLock
      >
        {!isAdmin && (
          <div>
            <MenuItem disabled={rowData?.isDefault} onClick={handleClickOnSetAsDefault}>
              {t("PaymentAccountManagement.PaymentAccountsTableActionMenu.SetAsDefault")}
            </MenuItem>
            <MenuItem onClick={handleClickOnEditAccount}>
              {" "}
              {t("PaymentAccountManagement.PaymentAccountsTableActionMenu.Amend")}
            </MenuItem>
            <MenuItem onClick={handleClickOnDeleteAccount}>
              {" "}
              {t("PaymentAccountManagement.PaymentAccountsTableActionMenu.Delete")}
            </MenuItem>
          </div>
        )}
        <MenuItem onClick={handleClickOnViewSupportingDocument}>
          {t("PaymentAccountManagement.PaymentAccountsTableActionMenu.ViewSupportingDocument")}
        </MenuItem>
        {isAdmin && hasManageAccountsACL && (
          <MenuItem disabled={rowData?.isValidated} onClick={handleClickOnValidate}>
            {t("PaymentAccountManagement.PaymentAccountsTableActionMenu.Validate")}
          </MenuItem>
        )}
      </Menu>
      {openEditAccountFormDialog ? (
        <EditPaymentAccountFormDialog
          entityId={entityId}
          accountId={rowData.id}
          initialValues={generateInitialValues(rowData)}
          open={openEditAccountFormDialog}
          handleClose={handleCloseEditAccountDialog}
        />
      ) : null}
      {openDeleteAccountDialog ? (
        <DeleteAccountDialog
          entityId={entityId}
          accountId={rowData.id}
          open={openDeleteAccountDialog}
          handleClose={handleCloseDeleteAccountDialog}
        />
      ) : null}
    </Fragment>
  );
};

PaymentAccountsTableActionMenu.propTypes = {
  rowData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    currency: PropTypes.string,
    currencyId: PropTypes.string,
    isDefault: PropTypes.bool.isRequired,
    city: PropTypes.string,
    country: PropTypes.string,
    countryId: PropTypes.string,
    accountBalance: PropTypes.string,
    iban: PropTypes.string,
    swift: PropTypes.string,
    accountNo: PropTypes.string,
    routingNo: PropTypes.string,
    sortCode: PropTypes.string,
    ifscCode: PropTypes.string,
    bsbCode: PropTypes.string,
    supportingDoc: PropTypes.string,
    isValidated: PropTypes.bool,
    entityGroupId: PropTypes.string,
  }).isRequired,
};

export default PaymentAccountsTableActionMenu;
