import MaterialTable from "@material-table/core";

import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";

// TODO: REFACTOR THIS COMPONENT: ENCAPSULATE TABLE FILTERING LOGIC - SEE GLENN'S FX CODES FOR INSPIRATION

const generateCouponAllocationTableRowData = (item) => ({
  clientEntityGroupId: item?.entityGroup?.id,
  clientName: item?.entityGroup?.entity?.corporateEntityName,
  couponAllocation: item?.couponAllocation ? parseFloat(item?.couponAllocation, 10) : 0,
  currency: item?.entityGroup?.wethaqAccount?.currency?.name ?? "--",
  securitiesHolding: item?.securitiesHoldings?.quantity ?? 0,
});

const CouponAllocationsTable = ({ isLoading, tableData, setTableData, editable }) => {
  const mtableLocalization = useMaterialTableLocalization();

  const handleOnRowUpdate = async (newData, oldData) => {
    const dataUpdate = [...tableData];
    const index = oldData.tableData.id;
    dataUpdate[index] = newData;
    setTableData([...dataUpdate]);
  };

  const validateCouponAllocationField = (rowData) =>
    !rowData?.couponAllocation > 0 ? "Please enter a valid value" : true;

  return (
    <MaterialTable
      isLoading={isLoading}
      size="small"
      title=""
      data={tableData}
      style={{
        boxShadow: "none",
      }}
      editable={
        editable
          ? {
              onRowUpdate: handleOnRowUpdate,
            }
          : undefined
      }
      columns={[
        {
          id: "client",
          title: "Client",
          field: "clientName",
          defaultSort: "asc",
          editable: false,
        },
        {
          id: "securitiesHolding",
          title: "Securities Holding",
          field: "securitiesHolding",
          type: "numeric",
          editable: false,
          render: (rowData) => convertNumberToIntlFormat(rowData.securitiesHolding),
        },
        {
          id: "couponAllocation",
          title: "Coupon Allocation",
          field: "couponAllocation",
          render: (rowData) =>
            convertNumberToIntlFormat(rowData.couponAllocation, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          validate: validateCouponAllocationField,
        },
        {
          id: "currency",
          title: "Currency",
          field: "currency",
          editable: false,
        },
      ]}
      options={{
        ...tableStyles,
        toolbar: false,
        pageSize: 5,
        search: false,
        draggable: false,
        actionsColumnIndex: -1,
      }}
      localization={mtableLocalization}
    />
  );
};

export default CouponAllocationsTable;

export { generateCouponAllocationTableRowData };
