import MaterialTable from '@material-table/core';
import tableStyles from '../../../styles/cssInJs/materialTable';
import { dateFormatter } from '../../../utils/formatter';
import { DEFAULT_DATE_FORMAT } from '../../../constants/datetime';

const generateTableRowData = (item) => ({
  clientName: item?.entityGroup?.entity?.corporateEntityName ?? item?.entity?.corporateEntityName,
  responseDate: item?.responseDate ?? null,
  response: item?.response,
});

const CorporateActionEventsResponses = ({ tableData, isFetchingEvent }) => {
  console.log(tableData);
  const columns = [
    {
      id: 'clientName',
      title: 'Client',
      field: 'clientName',
    },
    {
      id: 'date',
      title: 'Date',
      field: 'date',
      defaultSort: 'asc',
      render: (rowData) => (rowData?.responseDate ? dateFormatter(rowData?.responseDate, DEFAULT_DATE_FORMAT) : 'No response'),
    },
    {
      id: 'response',
      title: 'Response',
      field: 'response',
    },
  ];

  return (
    <MaterialTable
      isLoading={isFetchingEvent}
      size="small"
      title=""
      style={{
        boxShadow: 'none',
        marginBottom: '1rem',
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
