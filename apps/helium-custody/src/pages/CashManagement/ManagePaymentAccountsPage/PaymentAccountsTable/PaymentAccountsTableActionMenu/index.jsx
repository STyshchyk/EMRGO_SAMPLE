import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";

import * as accountsActionCreators from "../../../../../redux/actionCreators/accounts";
import * as authSelectors from "../../../../../redux/selectors/auth";
import DeleteAccountDialog from "../../DeletePaymentAccountDialog";
import EditPaymentAccountFormDialog from "../../EditPaymentAccountFormDialog";

const generateInitialValues = (rowData) => {
  const result = {
    accountNo: rowData?.accountNo,
    address: rowData?.address,
    bankName: rowData?.bankName,
    bsbCode: rowData?.bsbCode ?? undefined, // optional
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
    ifscCode: rowData?.ifscCode ?? undefined, // optional
    label: rowData?.label,
    name: rowData?.name,
    postcode: rowData?.postcode,
    routingNo: rowData?.routingNo ?? undefined, // optional
    swift: rowData?.swift,
    sortCode: rowData?.sortCode ?? undefined, // optional
    supportingDoc: rowData?.supportingDoc,
    hasIntermediaryBank: rowData?.hasIntermediaryBank,
    intermediaryBankAccountNo: rowData?.intermediaryBankAccountNo,
    intermediaryBankAddress: rowData?.intermediaryBankAddress,
    intermediaryBankBIC: rowData?.intermediaryBankBIC,
    intermediaryBankCity: rowData?.intermediaryBankCity,
    intermediaryBankIBAN: rowData?.intermediaryBankIBAN,
    intermediaryBankName: rowData?.intermediaryBankName,
    intermediaryBankPostCode: rowData?.intermediaryBankPostCode,
    intermediaryBankRouteCode: rowData?.intermediaryBankRouteCode ?? undefined, // optional
    intermediaryBankSortCode: rowData?.intermediaryBankSortCode ?? undefined, // optional
    intermediaryBankCountry: {
      label: rowData?.intermediaryBankCountry,
      value: rowData?.intermediaryBankCountryId,
    },
  };

  return result;
};

const PaymentAccountsTableActionMenu = ({ rowData }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);
  const { t } = useTranslation(["cash_management"]);

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


  const handleCloseDeleteAccountDialog = () => {
    setOpenDeleteAccountDialog(false);
    handleCloseMenu();
  };

  const handleClickOnSetAsDefault = () => {
    const setAccountAsDefault = (payload) =>
      dispatch(accountsActionCreators.doSetPaymentAccountAsDefault(payload));
    const requestPayload = {
      accountId: rowData?.id,
    };

    setAccountAsDefault(requestPayload);
  };

  const handleClickOnDeleteAccount = () => {
    setOpenDeleteAccountDialog(true);
  };


  const handleClickOnValidate = () => {
    const doValidatePaymentAccount = (payload) =>
      dispatch(accountsActionCreators.doValidatePaymentAccount(payload));

    const payload = {
      accountId: rowData?.id,
      requestPayload: {
        isValidated: true,
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
      >
        {!isAdmin && (
          <div>
            <MenuItem disabled={rowData?.isDefault} onClick={handleClickOnSetAsDefault}>
              {t("PaymentAccountManagement.PaymentAccountsTableActionMenu.SetAsDefault")}
            </MenuItem>
            <MenuItem onClick={handleClickOnDeleteAccount}>
              {" "}
              {t("PaymentAccountManagement.PaymentAccountsTableActionMenu.Delete")}
            </MenuItem>
          </div>
        )}
        {isAdmin && hasManageAccountsACL && (
          <MenuItem disabled={rowData?.isValidated} onClick={handleClickOnValidate}>
            {t("PaymentAccountManagement.PaymentAccountsTableActionMenu.Validate")}
          </MenuItem>
        )}
      </Menu>
      {openDeleteAccountDialog ? (
        <DeleteAccountDialog
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
