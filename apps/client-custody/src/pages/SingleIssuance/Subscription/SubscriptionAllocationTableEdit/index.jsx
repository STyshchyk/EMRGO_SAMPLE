import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import PropTypes from "prop-types";

import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import convertNumberToIntlFormat from "../../../../utils/convertNumberToIntlFormat";

const generateInvestorColumnLookupMap = (investors) => {
  let result = {};

  if (investors?.length > 0) {
    result = Object.assign(
      ...investors.map((y, index) => ({
        [index]: `${y?.user?.firstName} ${y?.user?.lastName} [${y?.corporateEntityName}]`,
      }))
    );
  }

  return result;
};

const calculateTotalSubscriptionAllocationAmount = (tableData) => {
  let result = 0;

  if (tableData.length > 0) {
    result = tableData.map((row) => row?.subAmount).reduce((total, amount) => total + amount);
  }

  return result;
};

const calculateTotalNumberOfCertificates = (tableData) => {
  let result = 0;

  if (tableData.length > 0) {
    result = tableData.map((row) => row?.certificates).reduce((total, amount) => total + amount);
  }

  return result;
};

const SubscriptionAllocationTableEdit = ({ tableData, setTableData }) => {
  const { t } = useTranslation(["subscription"]);
  const mtableLocalization = useMaterialTableLocalization();
  // selectors
  const denomination = useSelector(issuanceSelectors.selectDenominationValue);
  const enabledInvestors = useSelector(issuanceSelectors.selectEnabledInvestors);
  const currencyName = useSelector(issuanceSelectors.selectCurrencyName);

  const investorColumnLookupMap = generateInvestorColumnLookupMap(enabledInvestors);
  const totalSubAmount = calculateTotalSubscriptionAllocationAmount(tableData);
  const totalNumberOfCertifcates = calculateTotalNumberOfCertificates(tableData);

  const handleOnRowAdd = async (newData) => {
    const newRowData = { ...newData };
    const investorIndex = parseInt(newRowData?.investor, 10);
    const selectedInvestor = enabledInvestors[investorIndex];
    newRowData.id = selectedInvestor?.entityGroupId;
    newRowData.certificates = newRowData?.subAmount / denomination;
    setTableData([...tableData, newRowData]);
  };

  const handleOnRowUpdate = async (newData, oldData) => {
    const newRowData = { ...newData };
    const dataUpdate = [...tableData];
    const index = oldData.tableData.id;
    dataUpdate[index] = newRowData;
    newRowData.certificates = newRowData?.subAmount / denomination;
    setTableData([...dataUpdate]);
  };

  const handleOnRowDelete = async (oldData) => {
    const dataDelete = [...tableData];
    const index = oldData.tableData.id;
    dataDelete.splice(index, 1);
    setTableData([...dataDelete]);
  };

  const validateInvestorRowField = (rowData) => {
    const requiredHelperText = t(
      "subscription:Pre-Allocation Allocation.Table.Warnings.Investor field cannot be empty"
    );
    return rowData.investor === "" ? requiredHelperText : "";
  };

  const validateSubAmountRowField = (rowData) => {
    const requiredHelperText = t(
      "subscription:Pre-Allocation Allocation.Table.Warnings.Pre-Allocation amount should be a multiple of",
      { denomination }
    );
    return rowData.subAmount % denomination !== 0 ? requiredHelperText : "";
  };

  return (
    <Fragment>
      <MaterialTable
        title={t(
          "subscription:Pre-Allocation Allocation.Table.SUBSCRIPTION ENTRIES TO BE SENT FOR CONFIRMATION"
        )}
        columns={[
          {
            title: t("subscription:Pre-Allocation Allocation.Table.Headers.Investor"),
            field: "investor",
            type: "string",
            initialEditValue: "",
            lookup: investorColumnLookupMap,
            validate: validateInvestorRowField,
          },
          {
            title: t("subscription:Pre-Allocation Allocation.Table.Headers.Pre-Allocation Amount"),
            field: "subAmount",
            type: "currency",
            currencySetting: {
              currencyCode: currencyName,
              minimumFractionDigits: 2,
            },
            validate: validateSubAmountRowField,
          },
          {
            title: t(
              "subscription:Pre-Allocation Allocation.Table.Headers.Certificates (Auto-calculated)"
            ),
            field: "certificates",
            editable: "never",
            type: "numeric",
            initialEditValue: 0,
          },
        ]}
        data={tableData}
        options={{
          showTitle: false,
          toolbarButtonAlignment: "right",
          draggable: false,
          search: false,
          headerStyle: {
            fontWeight: "bold",
            color: "#23389c",
            fontSize: "1rem",
          },
        }}
        editable={{
          onRowAdd: handleOnRowAdd,
          onRowDelete: handleOnRowDelete,
          onRowUpdate: handleOnRowUpdate,
        }}
        localization={mtableLocalization}
      />
      <div
        style={{
          marginBottom: "1rem",
        }}
      >
        <h4>{t("subscription:Pre-Allocation Allocation.Table.Total")}:</h4>
        <div
          style={{
            width: "40%",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridColumnGap: "2rem",
            gridRowGap: "0.2rem",
          }}
        >
          <span>
            {t("subscription:Pre-Allocation Allocation.Table.Total Pre-Allocation Amount")}
          </span>
          <span>{convertNumberToIntlFormat(totalSubAmount)}</span>
          <span>
            {t("subscription:Pre-Allocation Allocation.Table.Total Number of Certificates")}
          </span>
          <span>{totalNumberOfCertifcates}</span>
        </div>
      </div>
    </Fragment>
  );
};

SubscriptionAllocationTableEdit.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTableData: PropTypes.func.isRequired,
};

export default SubscriptionAllocationTableEdit;
