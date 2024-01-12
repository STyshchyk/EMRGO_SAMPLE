import React, { Fragment, useRef } from "react";

import MaterialTable from "@material-table/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Grid";
import moment from "moment";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import { getAttribute } from "../../helpers/custodyAndSettlement";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";
import { dateWithinRange } from "../../utils/dates";
import { dateFormatter } from "../../utils/formatter";
import DateRangePicker from "../FilterComponents/DateRangePicker";
import DropdownFilter from "../FilterComponents/DropdownFilterUpdated";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";
import MaterialTableOverflowMenu from "../MaterialTableOverflowMenu";

const FALLBACK_VALUE = "--";

const generateCAEventsTableRowData = (i, paymentsList) => {
  //** API support will need to be improved in the future so filtered on the FE for now
  const settlementInstructions = paymentsList
    ?.filter((item) => item?.externalSecurity.id === i?.externalSecurity.id)
    ?.sort((a, b) => {
      const dateA = moment(a?.actualSettlementDate);
      const dateB = moment(b?.actualSettlementDate);
      return dateB.diff(dateA); // Sort in descending order
    });

  // Get the SI with the largest actualSettlementDate
  // const maxSI = settlementInstructions[0];

  return {
    id: i?.id,
    exDate: i?.exDate,
    recordDate: i?.recordDate,
    paymentDate: i.paymentDate ?? FALLBACK_VALUE,
    securityId: getAttribute(i?.externalSecurity?.attributes, "isin") ?? i.securityId,
    securityName: i?.securityName?.label,
    eventType: i?.eventType?.name,
    eventId: i?.eventId ?? FALLBACK_VALUE,
    eventStatus: i?.eventStatus?.name,
    mandatoryOrVoluntary: i?.voluntary ? "V" : "M",
    responseDeadline: i?.clientResponseDeadline,
    marketDeadline: i?.marketDeadline,
    eventTerms: i?.eventTerms,
    additionalInfo: i?.additionalInfo,
    linkedEventId: i?.linkedEvent?.eventId ?? FALLBACK_VALUE,
    portfolioId: settlementInstructions[0]?.portfolio_id,
    actualSettlementDate: settlementInstructions[0]?.actualSettlementDate,
  };
};

const CorporateActionEventsTable = ({
  data,
  actions,
  anchorEl,
  setAnchorEl,
  setCurrentlySelectedRowData,
  currentlySelectedRowData,
}) => {
  const tableRef = useRef();
  const mtableLocalization = useMaterialTableLocalization();

  const listOfUniqueExtSecurities = [...new Set(data?.map(({ securityName }) => securityName))];

  const securityNameOptions = listOfUniqueExtSecurities?.map((security) => ({
    label: security,
    value: security,
  }));

  const columns = [
    {
      id: "exDate",
      title: "Ex Date",
      field: "exDate",
      render: (rowData) => dateFormatter(rowData?.exDate, DEFAULT_DATE_FORMAT),
    },
    {
      id: "recordDate",
      title: "Record Date",
      field: "recordDate",
      render: (rowData) => dateFormatter(rowData?.recordDate, DEFAULT_DATE_FORMAT),
    },
    {
      id: "paymentDate",
      title: "Payment Date",
      field: "paymentDate",
      render: (rowData) => dateFormatter(rowData?.paymentDate, DEFAULT_DATE_FORMAT),
    },
    {
      id: "securityId",
      title: "Security ISIN",
      field: "securityId",
    },
    {
      id: "securityName",
      title: "Security Name",
      field: "securityName",
    },
    {
      id: "eventType",
      title: "Event Type",
      field: "eventType",
    },
    {
      id: "eventId",
      title: "Event ID",
      field: "eventId",
    },
    {
      id: "eventStatus",
      title: "Event Status",
      field: "eventStatus",
    },
    {
      id: "mandatoryOrVoluntary",
      title: "Mand/Vol",
      field: "mandatoryOrVoluntary",
    },
    {
      id: "responseDeadline",
      title: "Client Response Deadline",
      field: "responseDeadline",
      render: (rowData) =>
        rowData?.responseDeadline
          ? dateFormatter(rowData?.responseDeadline, DEFAULT_DATE_FORMAT)
          : "N/A",
    },
    {
      id: "marketDeadline",
      title: "Market Response Deadline",
      field: "marketDeadline",
      render: (rowData) =>
        rowData?.marketDeadline
          ? dateFormatter(rowData?.marketDeadline, DEFAULT_DATE_FORMAT)
          : "N/A",
    },
  ];

  return (
    <Fragment>
      <FilterProvider tableKey="corporate_action_events">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <TableFiltersWrapper
            tableRef={tableRef}
            data={data}
            columns={columns}
            open={true}
            hideExportButtons
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={6}>
                <DateRangePicker name="exDateRange" label="Ex Date" defaultFilter="none" />
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <DateRangePicker name="recordDateRange" label="Record Date" defaultFilter="none" />
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <DateRangePicker
                  name="paymentDateRange"
                  label="Payment Date"
                  defaultFilter="none"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter name="security" label="Security" options={securityNameOptions} />
              </Grid>
            </Grid>
          </TableFiltersWrapper>
        </div>
        <FilterConsumer>
          {({ filters, filterColumns }) => {
            const filteredData = data
              ?.filter((row) => {
                // Security Name Filter
                if (filters?.security) {
                  return row.securityName === filters?.security?.value?.value;
                }
                return true;
              })
              .filter((row) => {
                // ExDate range Filter
                if (
                  filters?.exDateRange?.value?.startDate &&
                  filters?.exDateRange?.value?.endDate
                ) {
                  const { startDate, endDate } = filters?.exDateRange.value;
                  const isInRange = dateWithinRange(row?.exDate, startDate, endDate);
                  return row.exDate ? isInRange : null;
                }
                return true;
              })
              .filter((row) => {
                // ExDate range Filter
                if (
                  filters?.recordDateRange?.value?.startDate &&
                  filters?.recordDateRange?.value?.endDate
                ) {
                  const { startDate, endDate } = filters?.recordDateRange.value;
                  const isInRange = dateWithinRange(row?.recordDate, startDate, endDate);
                  return row.recordDate ? isInRange : null;
                }
                return true;
              })
              .filter((row) => {
                // ExDate range Filter
                if (
                  filters?.paymentDateRange?.value?.startDate &&
                  filters?.paymentDateRange?.value?.endDate
                ) {
                  const { startDate, endDate } = filters?.paymentDateRange.value;
                  const isInRange = dateWithinRange(row?.paymentDate, startDate, endDate);
                  return row.paymentDate ? isInRange : null;
                }
                return true;
              });

            return (
              <Fragment>
                <MaterialTable
                  tableRef={tableRef}
                  size="small"
                  title=""
                  style={{
                    boxShadow: "none",
                  }}
                  columns={filterColumns.shownColumns}
                  data={filteredData}
                  actions={[
                    {
                      icon: () => <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" />,
                      onClick: (event, rowData) => {
                        setAnchorEl(event.currentTarget);
                        setCurrentlySelectedRowData(rowData);
                      },
                    },
                  ]}
                  options={{
                    ...tableStyles,
                    toolbar: false,
                    pageSize: 10,
                    search: false,
                    actionsColumnIndex: -1,
                    draggable: false,
                  }}
                  localization={mtableLocalization}
                />
                <MaterialTableOverflowMenu
                  actions={actions}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  selectedRow={currentlySelectedRowData}
                />
              </Fragment>
            );
          }}
        </FilterConsumer>
      </FilterProvider>
    </Fragment>
  );
};

export default CorporateActionEventsTable;

export { generateCAEventsTableRowData };

CorporateActionEventsTable.defaultProps = {};
