import MaterialTable from "@material-table/core";
import Typography from "@mui/material/Typography";

import { DEFAULT_DATE_FORMAT } from "../../../constants/datetime";
import tableStyles from "../../../styles/cssInJs/materialTable";
import { dateFormatter } from "../../../utils/formatter";
import LoadingIndicator from "../../LoadingIndicator";

const generateTableRowData = (item) => ({
  clientName: item?.entityGroup?.entity?.name ?? item?.entity?.name,
  responseDate: item?.responseDate ?? null,
  response: item?.response,
});

const CorporateActionEventsResponses = ({ tableData, isFetchingEvent }) => {
  const columns = [
    {
      id: "clientName",
      title: "Client",
      field: "clientName",
    },
    {
      id: "date",
      title: "Date",
      field: "date",
      defaultSort: "asc",
      render: (rowData) =>
        rowData?.responseDate ? dateFormatter(rowData?.responseDate, DEFAULT_DATE_FORMAT) : "--",
    },
    {
      id: "response",
      title: "Response",
      field: "",
      render: (rowData) =>
        rowData?.response ? (
          rowData?.response
        ) : (
          <Typography color="primary" variant="subtitle2">
            NO RESPONSE
          </Typography>
        ),
    },
  ];

  if (isFetchingEvent) {
    return <LoadingIndicator height={100} />;
  }

  return (
    <MaterialTable
      size="small"
      title=""
      style={{
        boxShadow: "none",
        marginBottom: "1rem",
      }}
      columns={columns}
      data={tableData}
      options={{
        ...tableStyles,
        toolbar: false,
        search: false,
        draggable: false,
        paging: false,
      }}
    />
  );
};
export default CorporateActionEventsResponses;

export { generateTableRowData };
