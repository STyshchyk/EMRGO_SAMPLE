import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import { mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline } from "@mdi/js";
import Icon from "@mdi/react";
import PropTypes from "prop-types";

// import * as authSelectors from '../../../../redux/selectors/auth';
import LoadingPage from "../../../../components/LoadingPage";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import * as accountsSelectors from "../../../../redux/selectors/accounts";
import tableStyles from "../../../../styles/cssInJs/materialTable";
import PaymentAccountsTableActionMenu from "./PaymentAccountsTableActionMenu";

const sharedColumnOptions = {
  width: 100,
};

// TODO: Refactor this mess. Ditch material-table lib in favour of using the official version - Moncy

const PaymentAccountsTable = ({ tableData }) => {
  const isFetching = useSelector(accountsSelectors.selectIsFetching);
  const isRequesting = useSelector(accountsSelectors.selectIsRequesting);
  const mtableLocalization = useMaterialTableLocalization();

  const { t } = useTranslation(["cash_management"]);

  // const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  // const isAdmin = currentEntityGroup?.entityType === 'EMRGO_SERVICES';

  if (isFetching || isRequesting) {
    return <LoadingPage />;
  }

  // * TODO: Show Account ID Column if logged-in user is the operations/admin user?
  return (
    <MaterialTable
      size="small"
      title=""
      columns={[
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Label"),
          field: "label",
          defaultSort: "asc",
          width: 150,
        },
        /*
        {
          title: t('PaymentAccountManagement.PaymentAccountsTable.Account ID'),
          field: 'id',
          ...sharedColumnOptions,
          width: 350,
        },
        */
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Default"),
          field: "isDefault",
          render: (rowData) => {
            const { isDefault } = rowData;

            if (isDefault) return <Icon path={mdiCheckboxMarkedOutline} size={1} />;
            return <Icon color="disabled" path={mdiCheckboxBlankOutline} size={1} />;
          },
        },

        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Validated"),
          field: "isValidated",
          render: (rowData) => {
            const { isValidated } = rowData;

            if (isValidated)
              return <Icon color="disabled" path={mdiCheckboxMarkedOutline} size={1} />;
            return <Icon color="disabled" path={mdiCheckboxBlankOutline} size={1} />;
          },
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Name"),
          field: "name",
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Bank Name"),
          field: "bankName",
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.IBAN"),
          field: "iban",
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.SWIFT/BIC"),
          field: "swift",
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Address"),
          field: "address",
          width: 300,
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.City"),
          field: "city",
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Country"),
          field: "country",
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Post Code"),
          field: "postcode",
        },

        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Account No"),
          field: "accountNo",
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Routing No"),
          field: "routingNo",
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Sort Code"),
          field: "sortCode",
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.IFSC Code"),
          field: "ifscCode",
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.BSB Code"),
          field: "bsbCode",
          ...sharedColumnOptions,
          width: 150,
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Currency"),
          field: "currency",
        },
        {
          title: "Intermediary Bank Name",
          field: "intermediaryBankName",
        },
         {
          title: "Intermediary Bank Account No",
          field: "intermediaryBankAccountNo",
        },
        {
          title: "Intermediary Bank IBAN",
          field: "intermediaryBankIBAN",
        },
        {
          title: "Intermediary Bank SWIFT/BIC",
          field: "intermediaryBankBIC",
        },
        {
          title: "Intermediary Bank Address",
          field: "intermediaryBankAddress",
          width: 300,
        },
        {
          title: "Intermediary Bank City",
          field: "intermediaryBankCity",
        },
        {
          title: "Intermediary Bank Country",
          field: "intermediaryBankCountry",
        },
        {
          title: "Intermediary Bank Post Code",
          field: "intermediaryBankPostCode",
        },
        {
          title: "Intermediary Bank Account No",
          field: "intermediaryBankAccountNo",
        },
        {
          title: "Intermediary Route Code",
          field: "intermediaryBankRouteCode",
        },
        {
          title: "Intermediary Sort No",
          field: "intermediaryBankSortCode",
        },
        {
          title: t("PaymentAccountManagement.PaymentAccountsTable.Actions"),
          sorting: false,
          render: (rowData) => <PaymentAccountsTableActionMenu rowData={rowData} />,
          ...sharedColumnOptions,
        },
        /*
        {
          title: t('PaymentAccountManagement.PaymentAccountsTable.Balance'),
          field: 'accountBalance',
          type: 'numeric',
          ...sharedColumnOptions,
        },
        */
      ]}
      data={tableData}
      options={{
        ...tableStyles,
        searchFieldVariant: "outlined",
        pageSize: 10,
        actionsColumnIndex: -1,
      }}
      localization={mtableLocalization}
    />
  );
};

PaymentAccountsTable.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.exact({
      accountBalance: PropTypes.string,
      accountNo: PropTypes.string,
      address: PropTypes.string,
      bankName: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      countryId: PropTypes.string,
      currency: PropTypes.string,
      currencyId: PropTypes.string,
      iban: PropTypes.string,
      id: PropTypes.string.isRequired,
      isDefault: PropTypes.bool.isRequired,
      isValidated: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      postcode: PropTypes.string.isRequired,
      routingNo: PropTypes.string,
      ifscCode: PropTypes.string,
      bsbCode: PropTypes.string,
      swift: PropTypes.string,
      sortCode: PropTypes.string,
      supportingDoc: PropTypes.string,
      entityGroupId: PropTypes.string,
    })
  ).isRequired,
};

export default PaymentAccountsTable;
