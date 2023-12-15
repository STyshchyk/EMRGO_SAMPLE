import React, { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Grid";
import moment from "moment";
import DateRangePicker from "../../../../components/FilterComponents/DateRangePicker";
import TableFiltersWrapper from "../../../../components/FilterComponents/TableFiltersWrapper";
import LoadingPage from "../../../../components/LoadingPage";
import MaterialTableOverflowMenu from "../../../../components/MaterialTableOverflowMenu";
import { currencyRenderer, dateRenderer } from "../../../../constants/renderers";
import { FilterConsumer, FilterProvider } from "../../../../context/filter-context";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import * as accountsSelectors from "../../../../redux/selectors/accounts";
import tableStyles from "../../../../styles/cssInJs/materialTable";

const PaymentInstructionsTable = ({ data, actions, setSelectedRow, selectedRow }) => {
  const tableRef = useRef();
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["cash_management"]);
  const isFetching = useSelector(accountsSelectors.selectIsFetching);
  const isRequesting = useSelector(accountsSelectors.selectIsRequesting);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const columns = [
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
      defaultSort: "desc",
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

    {
      id: "providerBeneficiaryName",
      title: "Name",
      field: "providerBeneficiaryName",
    }, // !SHOULD BE REPLACED WITH THE BENEFICIARY ACCOUNT OWNER'S FULL NAME

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
  ];
  if (isFetching || isRequesting) {
    return <LoadingPage />;
  }
  return (
    <FilterProvider tableKey="fx_transaction_list">
      <div
        style={{
          marginBottom: "1rem",
        }}
      >
        <TableFiltersWrapper
          tableKey="fx_transaction_list"
          tableRef={tableRef}
          columns={columns}
          open={true}
          hideExportButtons
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={6}>
            <DateRangePicker name="createdAt" label={"Date"} defaultFilter="none" />
            </Grid>
          </Grid>
        </TableFiltersWrapper>
      </div>
      <FilterConsumer>
      {({ filters, filterColumns }) => {
              const filteredData = data
                .filter((row) => {
                  if (filters?.createdAt?.value?.startDate && filters?.createdAt?.value?.endDate) {
                    const { startDate, endDate } = filters?.createdAt.value;

                    return moment(row.createdAt).isBetween(startDate, endDate);
                  }
                  return true;
                })
          return (
            <Fragment>
              <MaterialTable
                size="small"
                tableRef={tableRef}
                title=""
                columns={filterColumns.shownColumns}
                data={filteredData}
                options={{
                  ...tableStyles,
                  searchFieldVariant: "outlined",
                  pageSize: 20,
                  actionsColumnIndex: -1,
                }}
                actions={[
                  {
                    icon: () => <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" />,
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
        }}
      </FilterConsumer>
    </FilterProvider>
  );
};

export default PaymentInstructionsTable;
