import { useTranslation } from "react-i18next";

import MaterialTable from "@material-table/core";
import PropTypes from "prop-types";

import { dateRenderer, floatRenderer } from "../../../constants/paymentAndStatuses/renderers";
import useMaterialTableLocalization from "../../../hooks/useMTableLocalization";
import tableStyles from "../../../styles/cssInJs/materialTable";

const generateReconciliationTableRowData = (i) => ({
  id: i.id,
  amount: i.amount,
  assignedAccount: i.assignedAccount,
  assignedAccountId: i.assignedAccountId,
  assignedAccountNo: i?.assignedAccount?.accountNo ?? "--",
  assignedClient: i?.assignedEntityGroup?.entity?.corporateEntityName ?? "--",
  bankAccNo: i.bankAccountNumber,
  bankRef: i.bankReference,
  currency: i.currency,
  customerRef: i.customerReference,
  detailSegments: i.detailSegments,
  entryDate: i.entryDate,
  sourceAccount: i.sourceAccount,
  supplementary: i.supplementary ?? "--",
  transactionType: i.transactionType,
  valueDate: i.valueDate,
});

const ReconciliationTable = ({ data }) => {
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["cash_management"]);

  return (
    <MaterialTable
      size="small"
      title=""
      style={{
        boxShadow: "none",
      }}
      columns={[
        {
          id: "valueDate",
          title: t("cash_management:Incoming Payments.Headers.Value Date"),
          field: "valueDate",
          render: (rowData) => dateRenderer(rowData.valueDate),
        },
        {
          id: "entryDate",
          title: t("cash_management:Incoming Payments.Headers.Entry Date"),
          field: "valueDate",
          render: (rowData) => dateRenderer(rowData.valueDate),
        },
        {
          id: "bankAccNo",
          title: t("cash_management:Incoming Payments.Headers.Account No"),
          field: "bankAccNo",
        },
        {
          id: "currency",
          title: t("cash_management:Incoming Payments.Headers.Currency"),
          field: "currency",
        },
        {
          id: "amount",
          title: t("cash_management:Incoming Payments.Headers.Amount"),
          field: "amount",
          render: (rowData) => floatRenderer(rowData.amount),
        },
        {
          id: "transactionType",
          title: t("cash_management:Incoming Payments.Headers.Transaction Type"),
          field: "transactionType",
        },
        {
          id: "customerRef",
          title: t("cash_management:Incoming Payments.Headers.Customer Ref"),
          field: "customerRef",
        },
        {
          id: "bankRef",
          title: t("cash_management:Incoming Payments.Headers.Bank Ref"),
          field: "bankRef",
        },
        {
          id: "supplementary",
          title: t("cash_management:Incoming Payments.Headers.Supplementary"),
          field: "supplementary",
        },
        {
          id: "assignedClient",
          title: t("cash_management:Incoming Payments.Headers.Assigned Client"),
          field: "assignedClient",
        },
        {
          id: "assignedAccount",
          title: t("cash_management:Incoming Payments.Headers.Assigned Account"),
          field: "assignedAccountNo",
        },
      ]}
      data={data}
      options={{
        ...tableStyles,
        toolbar: false,
        pageSize: 10,
        search: false,

        draggable: false,
      }}
      localization={mtableLocalization}
    />
  );
};

export default ReconciliationTable;

export { generateReconciliationTableRowData };

ReconciliationTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ).isRequired,
};
