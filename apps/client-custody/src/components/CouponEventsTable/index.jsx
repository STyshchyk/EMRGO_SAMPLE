import { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";

import MomentUtils from "@date-io/moment";
import MaterialTable from "@material-table/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import { couponAllocationStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import { useCouponEventsTableFilters } from "../../context/coupon-events-table-filters-context";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import DropdownFilter from "../FilterComponents/DropdownFilterUpdated";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";

// TODO: CLEAN UP LATER
// TODO: REFACTOR THIS COMPONENT: ENCAPSULATE TABLE FILTERING LOGIC - SEE GLENN'S FX CODES FOR INSPIRATION

const TableActionMenu = ({ handleCloseMenu, actions, anchorEl }) => (
  <Fragment>
    {Boolean(anchorEl) && (
      <Menu
        data-testid="coupon-events-table-menu-list"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        disableScrollLock
      >
        {actions.map((action) => (
          <MenuItem key={action.id} disabled={action.disabled} onClick={action.onClick}>
            <Typography variant="inherit">{action.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    )}
  </Fragment>
);

TableActionMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      onClick: PropTypes.func,
      label: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ).isRequired,
};

const CouponEventsTableFiltering = () => {
  const { couponEventFiltersState, couponEventFiltersDispatcher } = useCouponEventsTableFilters();

  return (
    <Grid container spacing={2}>
      <Fragment>
        <Grid item lg={3} container>
          <Grid container justifyContent="space-between" alignItems="flex-start">
            <Typography variant="body1" className="bold">
              From Date
            </Typography>
          </Grid>

          <Box my={1} className="full-width">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                placeholder="From"
                fullWidth
                inputVariant="filled"
                format={DEFAULT_DATE_FORMAT}
                value={couponEventFiltersState.fromDate}
                onChange={(date) => {
                  couponEventFiltersDispatcher({
                    type: "SET_FROM_DATE",
                    payload: date.toDate(),
                  });
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
        </Grid>
        <Grid item lg={3} container>
          <Grid container justifyContent="space-between" alignItems="flex-start">
            <Typography variant="body1" className="bold">
              To Date
            </Typography>
          </Grid>

          <Box my={1} className="full-width">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                placeholder="To"
                fullWidth
                inputVariant="filled"
                format={DEFAULT_DATE_FORMAT}
                value={couponEventFiltersState.toDate}
                minDate={couponEventFiltersState.fromDate}
                onChange={(date) => {
                  couponEventFiltersDispatcher({
                    type: "SET_TO_DATE",
                    payload: date.toDate(),
                  });
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
        </Grid>
        <Grid item lg={3} container alignItems="center">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={couponEventFiltersState.holdingsOnly}
                  onChange={(event) => {
                    couponEventFiltersDispatcher({
                      type: "SET_HOLDINGS_ONLY",
                      payload: event.target.checked,
                    });
                  }}
                  name="holdingsOnly"
                />
              }
              label="Holdings only"
            />
          </FormGroup>
        </Grid>{" "}
        <Grid item lg={3} container />
      </Fragment>
    </Grid>
  );
};

const generateCouponEventsTableRowData = (i) => ({
  id: i.id,
  investors: i.investors,
  couponAllocationStatus: i.couponAllocationStatus,
  couponDate: i.calenderDate,
  couponRate: i.couponSchedule?.externalSecurity?.profitRate,
  externalSecurity: i.couponSchedule?.externalSecurity,
  isin: i.couponSchedule?.externalSecurity?.isin ?? "--",
  issuer: i.issuer,
  security: i.couponSchedule?.externalSecurity?.longName,
  shortName: i.couponSchedule?.externalSecurity?.shortName ?? "N/A",
  wsn: i.couponSchedule?.externalSecurity?.wsn ?? "--",
  totalCouponAmount: i.totalCouponAmount,
  isPrimaryIssuance: i?.couponSchedule?.externalSecurity?.isPrimaryIssuance,
  currencyName: i?.couponSchedule?.externalSecurity?.currencyName?.name,
  frequencyName: i?.couponSchedule?.externalSecurity?.frequencyName?.name,
  dayCountConventionName: i?.couponSchedule?.externalSecurity?.dayCountConventionName?.name,
  totalBalance: i?.totalBalance,
  csdAccount: i?.csdAccount,
  debitWethaqAccountId: i?.debitWethaqAccountId,
  wethaqDebitAccount: i?.wethaqDebitAccount,
  couponScheduleId: i?.couponSchedule?.id,
});

const CouponEventsTable = ({
  anchorEl,
  handleCloseMenu,
  actions,
  data,
  setCurrentlySelectedRowData,
  setAnchorEl,
  isLoading,
}) => {
  const tableRef = useRef();
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["custody_and_settlement"]);

  const dedupedSecuritiesNames = Array.from(new Set(data.map((item) => item.security))).sort();

  const securityFilterOptionsList = dedupedSecuritiesNames.map((securityName) => ({
    label: securityName,
    value: securityName,
  }));

  const tableColumns = [
    {
      id: "couponDate",
      title: "Coupon Date",
      field: "couponDate",
      defaultSort: "asc",
      render: (rowData) => dateFormatter(rowData?.couponDate, DEFAULT_DATE_FORMAT),
      exportConfig: {
        render: (rowData) => dateFormatter(rowData?.couponDate, DEFAULT_DATE_FORMAT),
      },
    },
    {
      id: "security",
      title: "Security",
      field: "security",
      defaultSort: "asc",
      customFilterAndSearch: (term, rowData) => term === rowData?.security,
    },
    {
      id: "isin",
      title: "ISIN",
      field: "isin",
    },
    {
      id: "wsn",
      title: "WSN",
      field: "wsn",
    },
    {
      id: "shortName",
      title: "Short Name",
      field: "shortName",
    },
    {
      id: "couponRate",
      title: "Coupon Rate",
      field: "couponRate",
      type: "numeric",
      render: (rowData) => {
        if (!rowData?.couponRate) return "--";

        return `${convertNumberToIntlFormat(rowData.couponRate, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}%`;
      },
    },
    {
      id: "totalBalance",
      title: "Balance",
      type: "numeric",
      field: "totalBalance", // !DEV NOTES: Total balance of all Platform holdings of that security on COUPON DATE, else 0,
      render: (rowData) => convertNumberToIntlFormat(rowData.totalBalance),
    },
    {
      id: "couponAllocationStatus",
      title: "Coupon Allocation Status",
      field: "couponAllocationStatus", // !DEV NOTES: No Expected Coupon | Unallocated | Pending Approval | Allocated
    },
  ];

  const couponAllocStatusFilterOptionsList = [
    {
      label: t(couponAllocationStatusEnum.NO_EXPECTED_COUPON),
      value: couponAllocationStatusEnum.NO_EXPECTED_COUPON,
    },
    {
      label: t(couponAllocationStatusEnum.UNALLOCATED),
      value: couponAllocationStatusEnum.UNALLOCATED,
    },
    {
      label: t(couponAllocationStatusEnum.PENDING_APPROVAL),
      value: couponAllocationStatusEnum.PENDING_APPROVAL,
    },
    {
      label: t(couponAllocationStatusEnum.ALLOCATED),
      value: couponAllocationStatusEnum.ALLOCATED,
    },
  ];

  return (
    <Fragment>
      <div
        style={{
          marginBottom: "1rem",
        }}
      >
        <FilterProvider tableKey="coupon_administration">
          <TableFiltersWrapper
            tableRef={tableRef}
            data={data}
            columns={tableColumns}
            open={true}
            hideExportButtons
          >
            <CouponEventsTableFiltering
              options={{
                securityFilterOptionsList,
                couponAllocStatusFilterOptionsList,
              }}
              tableRef={tableRef}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="security"
                  label="Security"
                  options={securityFilterOptionsList}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="status"
                  label="Status"
                  options={couponAllocStatusFilterOptionsList}
                />
              </Grid>
            </Grid>
          </TableFiltersWrapper>
          <FilterConsumer>
            {({ filters, filterColumns }) => {
              const filteredData = data
                ?.filter((row) => {
                  // Security Filter
                  if (filters?.security) {
                    return row.security === filters?.security?.value?.value;
                  }
                  return true;
                })
                .filter((row) => {
                  // Status Filter
                  if (filters?.status) {
                    return row.couponAllocationStatus === filters?.status?.value?.value;
                  }
                  return true;
                });

              return (
                <div data-testid="coupon-events-table">
                  <MaterialTable
                    isLoading={isLoading}
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
                        icon: "more_vert",
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
                      fixedColumns: {
                        left: 0,
                      },
                      actionsColumnIndex: -1,
                      draggable: false,
                    }}
                    localization={mtableLocalization}
                  />
                  <TableActionMenu
                    actions={actions}
                    anchorEl={anchorEl}
                    handleCloseMenu={handleCloseMenu}
                  />
                </div>
              );
            }}
          </FilterConsumer>
        </FilterProvider>
      </div>
    </Fragment>
  );
};

export default CouponEventsTable;

export { generateCouponEventsTableRowData };

CouponEventsTable.propTypes = {
  anchorEl: PropTypes.object,
  handleOpenMenu: PropTypes.func.isRequired,
  handleCloseMenu: PropTypes.func.isRequired,
  // data: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     security: PropTypes.string,
  //     currency: PropTypes.string,
  //   }),
  // ).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
      onClick: PropTypes.func,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  setCurrentlySelectedRowData: PropTypes.func.isRequired,
  showAllFilters: PropTypes.bool.isRequired,
  setAnchorEl: PropTypes.func.isRequired,
};

CouponEventsTable.defaultProps = {
  showAllFilters: false,
};
