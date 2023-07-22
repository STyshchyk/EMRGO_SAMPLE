import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import MaterialTable from "@material-table/core";

import LoadingPage from "../../../../components/LoadingPage";
import MaterialTableOverflowMenu from "../../../../components/MaterialTableOverflowMenu";
import { currencyRenderer, dateRenderer } from "../../../../constants/paymentAndStatuses/renderers";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import * as accountsSelectors from "../../../../redux/selectors/accounts";
import tableStyles from "../../../../styles/cssInJs/materialTable";

const PaymentInstructionsTable = ({ data, actions, setSelectedRow, selectedRow }) => {
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["cash_management"]);
  const isFetching = useSelector(accountsSelectors.selectIsFetching);
  const isRequesting = useSelector(accountsSelectors.selectIsRequesting);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  if (isFetching || isRequesting) {
    return <LoadingPage />;
  }

  return (
    <Fragment>
      <MaterialTable
        size="small"
        title=""
        columns={[
          {
            id: "accountNo",
            title: t("Payment Instructions.Headers.Account No"),
            field: "accountNo",
          },
          {
            id: "clientBalance",
            title: t("Payment Instructions.Headers.Client Balance"),
            field: "clientBalance",
            render: (rowData) => currencyRenderer(rowData.clientBalance),
          },
          {
            id: "createdAt",
            title: t("Payment Instructions.Headers.Created At Date"),
            defaultSort: "asc",
            field: "createdAt",
            render: (rowData) => dateRenderer(rowData.createdAt),
          },
          {
            id: "valueDate",
            title: t("Payment Instructions.Headers.Value Date"),
            field: "valueDate",
            render: (rowData) => dateRenderer(rowData.valueDate),
          },
          {
            id: "investor",
            title: t("Payment Instructions.Headers.Investor/Owner"),
            field: "investor",
          },
          {
            id: "payment",
            title: t("Payment Instructions.Headers.Payment Amount"),
            field: "payment",
            render: (rowData) => currencyRenderer(rowData.payment),
          },
          {
            id: "currency",
            title: t("Payment Instructions.Headers.CCY"),
            field: "currency",
          },
          {
            id: "country",
            title: t("Payment Instructions.Headers.Country"),
            field: "country",
          },

          { id: "providerBeneficiaryName", title: "Name", field: "providerBeneficiaryName" }, // !SHOULD BE REPLACED WITH THE BENEFICIARY ACCOUNT OWNER'S FULL NAME

          {
            id: "bank",
            title: t("Payment Instructions.Headers.Bank"),
            field: "bank",
          },
          {
            id: "iban",
            title: t("Payment Instructions.Headers.IBAN/Account"),
            field: "iban",
          },
          { id: "bic", title: t("Payment Instructions.Headers.BIC"), field: "bic" },

          {
            id: "intermediaryBankName",
            title: "Intermediary Bank Name",
            field: "intermediaryBankName",
          },
          {
            id: "intermediaryBankIBAN",
            title: "Intermediary Bank IBAN",
            field: "intermediaryBankIBAN",
          },
          {
            id: "intermediaryBankBIC",
            title: "Intermediary Bank BIC",
            field: "intermediaryBankBIC",
          },

          {
            id: "status",
            title: t("Payment Instructions.Headers.Status"),
            field: "status",
          },
          {
            id: "transferPurposeType",
            title: t("Payment Instructions.Headers.Transfer Purpose"),
            field: "transferPurposeType",
          },
          {
            id: "referenceNo",
            title: t("Payment Instructions.Headers.Reference No"),
            field: "referenceNo",
          },
        ]}
        data={data}
        options={{
          ...tableStyles,
          searchFieldVariant: "filled",
          pageSize: 20,
          actionsColumnIndex: -1,
        }}
        actions={[
          {
            icon: "more_vert",
            onClick: (event, rowData) => {
              setMenuAnchorEl(event.currentTarget);
              setSelectedRow(rowData);
            },
          },
        ]}
        localization={mtableLocalization}
      />
      <MaterialTableOverflowMenu
        actions={actions}
        anchorEl={menuAnchorEl}
        setAnchorEl={setMenuAnchorEl}
        selectedRow={selectedRow}
      />
    </Fragment>
  );
};

export default PaymentInstructionsTable;
