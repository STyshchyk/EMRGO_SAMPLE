import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import StyledPageTitle from "../../../../components/StyledPageTitle";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as entitiesActionCreators from "../../../../redux/actionCreators/entities";
import * as kycActionCreators from "../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as kycSelectors from "../../../../redux/selectors/kyc";
import AddPaymentAccountFormDialog from "./AddPaymentAccountFormDialog";
import PaymentAccountsTable from "./PaymentAccountsTable";

const createPaymentAccountTableDataRow = (account) => ({
  accountBalance: account.accountBalance,
  accountNo: account?.accountNo,
  address: account.address,
  bankName: account?.bankName,
  bsbCode: account?.bsbCode,
  city: account.city,
  country: account?.country?.name,
  countryId: account.countryId,
  currency: account?.currency?.name,
  currencyId: account.currencyId,
  iban: account.iban,
  id: account.id,
  ifscCode: account?.ifscCode,
  isDefault: account.isDefault,
  isValidated: account?.isValidated,
  label: account?.label,
  name: account.name,
  postcode: account.postcode,
  routingNo: account?.routingNo,
  swift: account.swift,
  supportingDoc: account.supportingDoc,
  sortCode: account?.sortCode,
  entityGroupId: account?.entityGroupId ?? null,
});

const Banking = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["translation", "kyc", "components"]);
  const { entityId } = useParams();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const entityType = currentEntityGroup?.entityType;
  const currentEntityGroupID = currentEntityGroup?.id;
  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const [openAddPaymentAccountFormDialog, setOpenAddPaymentAccountFormDialog] = useState(false);

  const handleCloseAddPaymentAccountFormDialog = () => {
    setOpenAddPaymentAccountFormDialog(false);
  };

  const handleClickOnAddPaymentAccountButton = () => {
    setOpenAddPaymentAccountFormDialog(true);
  };

  const isWethaqAdmin = entityType === "EMRGO_SERVICES";

  const paymentAccounts = useSelector(kycSelectors.selectPaymentAccounts);

  useEffect(() => {
    const fetchPaymentAccountsByEntityID = (payload) =>
      dispatch(kycActionCreators.doFetchPaymentAccountsByEntityID(payload));

    const fetchEntities = (payload) => dispatch(entitiesActionCreators.doFetchEntities(payload));

    if (isWethaqAdmin) {
      fetchEntities();
    }

    fetchPaymentAccountsByEntityID({
      entityId,
    });
  }, [dispatch, entityId, isWethaqAdmin]);

  return (
    <Fragment>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <StyledPageTitle title={t("kyc:Banking.Banking Details")} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2">
            {t(
              "kyc:Banking.Please provide details of the bank account that will be used for receiving and transmitting funds"
            )}
          </Typography>
        </Grid>
      </Grid>
      <Grid container className="py-8">
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end">
            <Grid item xs={12} md={6} lg={2}>
              <Grid container direction="column">
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={handleClickOnAddPaymentAccountButton}
                >
                  {t("kyc:Banking.Add Bank Details")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <PaymentAccountsTable
        tableData={paymentAccounts.map((account) => createPaymentAccountTableDataRow(account))}
      />
      {openAddPaymentAccountFormDialog ? (
        <AddPaymentAccountFormDialog
          entityId={entityId}
          open={openAddPaymentAccountFormDialog}
          handleClose={handleCloseAddPaymentAccountFormDialog}
        />
      ) : null}
    </Fragment>
  );
};

export default Banking;
