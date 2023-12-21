import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { CsvBuilder } from "filefy";
import moment from "moment";

import PageTitle from "../../../components/PageTitle";
import { removeCommas } from "../../../helpers/table";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as accountsActionCreators from "../../../redux/actionCreators/accounts";
import * as entitiesActionCreators from "../../../redux/actionCreators/entities";
import * as accountsSelectors from "../../../redux/selectors/accounts";
import * as authSelectors from "../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../redux/selectors/entities";
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
  hasIntermediaryBank: account?.hasIntermediaryBank,
  intermediaryBankAccountNo: account?.intermediaryBankAccountNo,
  intermediaryBankAddress: account?.intermediaryBankAddress,
  intermediaryBankBIC: account?.intermediaryBankBIC,
  intermediaryBankCity: account?.intermediaryBankCity,
  intermediaryBankCountryId: account?.intermediaryBankCountryId,
  intermediaryBankIBAN: account?.intermediaryBankIBAN,
  intermediaryBankName: account?.intermediaryBankName,
  intermediaryBankPostCode: account?.intermediaryBankPostCode,
  intermediaryBankRouteCode: account?.intermediaryBankRouteCode,
  intermediaryBankSortCode: account?.intermediaryBankSortCode,
  intermediaryBankCountry: account?.intermediaryBankCountry?.name,
  corporateEntityName: account?.entity?.corporateEntityName,
  createdAt: account?.createdAt,
});

const ManagePaymentAccountsPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["cash_management"]);

  const [openAddPaymentAccountFormDialog, setOpenAddPaymentAccountFormDialog] = useState(false);

  // selectors
  const paymentAccounts = useSelector(accountsSelectors.selectPaymentAccounts);
  const allEntities = useSelector(entitiesSelectors.selectAllEntities);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const currentEntityGroupEntityType = currentEntityGroup?.entityType;
  const data = paymentAccounts.map((account) => createPaymentAccountTableDataRow(account));
  const isTableDataNotEmpty = Array.isArray(data) && data.length > 0;

  const transformData = (originalData) => {
    if (!originalData) return {};

    const {
      label,
      isDefault,
      isValidated,
      name,
      iban,
      swift,
      address,
      city,
      country,
      postcode,
      bankName,
      accountNo,
      routingNo,
      sortCode,
      ifscCode,
      bsbCode,
      currency,
      intermediaryBankName,
      intermediaryBankIBAN,
      intermediaryBankBIC,
      intermediaryBankAddress,
      intermediaryBankCity,
      intermediaryBankCountry,
      intermediaryBankPostCode,
      intermediaryBankAccountNo,
      intermediaryBankRouteCode,
      intermediaryBankSortCode,
      createdAt,
    } = originalData;

    return {
      label: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Label"),
        value: label,
      },
      isDefault: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Default"),
        value: isDefault,
      },
      isValidated: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Validated"),
        value: isValidated,
      },
      name: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Name"),
        value: name,
      },
      bankName: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Bank Name"),
        value: bankName,
      },
      iban: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.IBAN"),
        value: iban,
      },
      swift: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.SWIFT/BIC"),
        value: swift,
      },
      address: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Address"),
        value: address,
      },
      city: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.City"),
        value: city,
      },
      country: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Country"),
        value: country,
      },
      postcode: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Post Code"),
        value: postcode,
      },

      accountNo: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Account No"),
        value: accountNo,
      },
      routingNo: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Routing No"),
        value: routingNo,
      },
      sortCode: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Sort Code"),
        value: sortCode,
      },
      ifscCode: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.IFSC Code"),
        value: ifscCode,
      },
      bsbCode: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.BSB Code"),
        value: bsbCode,
      },
      currency: {
        label: t("PaymentAccountManagement.PaymentAccountsTable.Currency"),
        value: currency,
      },
      intermediaryBankName: {
        label: "Intermediary Bank Name",
        value: intermediaryBankName,
      },
      intermediaryBankIBAN: {
        label: "Intermediary Bank IBAN",
        value: intermediaryBankIBAN,
      },
      intermediaryBankBIC: {
        label: "Intermediary Bank SWIFT/BIC",
        value: intermediaryBankBIC,
      },
      intermediaryBankAddress: {
        label: "Intermediary Bank Address",
        value: intermediaryBankAddress,
      },
      intermediaryBankCity: {
        label: "Intermediary Bank City",
        value: intermediaryBankCity,
      },
      intermediaryBankCountry: {
        label: "Intermediary Bank Country",
        value: intermediaryBankCountry,
      },
      intermediaryBankPostCode: {
        label: "Intermediary Bank Post Code",
        value: intermediaryBankPostCode,
      },
      intermediaryBankAccountNo: {
        label: "Intermediary Bank Account No",
        value: intermediaryBankAccountNo,
      },
      intermediaryBankRouteCode: {
        label: "Intermediary Routing Code",
        value: intermediaryBankRouteCode,
      },
      intermediaryBankSortCode: {
        label: "Intermediary Sort No",
        value: intermediaryBankSortCode,
      },
      createdAt: {
        value: createdAt,
      },
    };
  };

  const transformedData = data.map((d) => transformData(d));

  const listOfRowValues = [];
  const listOfColumnNames = [];

  transformedData.sort((a, b) => moment(b.createdAt?.value) - moment(a.createdAt?.value));

  transformedData.forEach((td) => {
    const rows = [];
    const columns = [];
    Object.entries(td)
      .filter(([, { hidden }]) => !hidden)
      .forEach(([, { label, value }]) => {
        rows.push(value);
        columns.push(label);
      });
    listOfRowValues.push(removeCommas(rows));
    listOfColumnNames.push(columns);
  });

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchAccounts = (payload) =>
      dispatch(accountsActionCreators.doFetchPaymentAccounts(payload));
    const fetchEntities = (payload) => dispatch(entitiesActionCreators.doFetchEntities(payload));
    const fetchEmrgoEntities = (payload) => dispatch(entitiesActionCreators.doFetchEmrgoEntities());

    fetchAccounts();
    if (currentEntityGroupEntityType === "EMRGO_SERVICES") {
      fetchEntities();
      fetchEmrgoEntities();
    }
  }, [dispatch, currentEntityGroupEntityType]);

  const handleCloseAddPaymentAccountFormDialog = () => {
    setOpenAddPaymentAccountFormDialog(false);
  };

  const handleClickOnAddPaymentAccountButton = () => {
    setOpenAddPaymentAccountFormDialog(true);
  };

  const handleExportToCSV = () => {
    const csv = new CsvBuilder("accounts.csv")
      .setColumns(listOfColumnNames[0])
      .addRows(listOfRowValues)
      .addRow([""]);
    // exportFilters.map((filter) => {
    //   csv.addRow([filter.label, filter.value]);
    //   return false;
    // });
    csv.exportFile();
  };

  return (
    <Fragment>
      <Grid container alignItems="center" sx={{ mb: "1rem" }}>
        <Grid container lg={3}>
          <PageTitle title={t("PaymentAccountManagement.ManagePaymentAccountsPage.PageTitle")} />
        </Grid>

        <Grid container alignItems="flex-start" justifyContent="flex-end" spacing={2} lg={9}>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<CloudDownloadIcon />}
              onClick={() => {
                handleExportToCSV(data);
              }}
              color="primary"
              // disabled={!isTableDataNotEmpty}
            >
              Export to CSV
            </Button>
          </Grid>

          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={handleClickOnAddPaymentAccountButton}
            >
              {t("PaymentAccountManagement.ManagePaymentAccountsPage.AddPaymentAccountButtonText")}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <PaymentAccountsTable tableData={data} />
      {openAddPaymentAccountFormDialog ? (
        <AddPaymentAccountFormDialog
          open={openAddPaymentAccountFormDialog}
          handleClose={handleCloseAddPaymentAccountFormDialog}
          entitiesList={currentEntityGroupEntityType === "EMRGO_SERVICES" ? allEntities : null}
        />
      ) : null}
    </Fragment>
  );
};
export default ManagePaymentAccountsPage;
