import React, { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";

import MaterialTable from "@material-table/core";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import Popper from '@mui/material/Popper';
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import moment from "moment";
import PropTypes from "prop-types";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import { dateRenderer } from "../../constants/renderers";
import { admissionStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import DateRangePicker from "../FilterComponents/DateRangePicker";
import DropdownFilter from "../FilterComponents/DropdownFilterUpdated";
import ExportButtons from "../FilterComponents/ExportButtons";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const TableActionMenu = ({ handleCloseMenu, actions, anchorEl }) => (
  <Fragment>
    {Boolean(anchorEl) && (
    <Popper
        data-testid="securities-table-menu-list"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        role={undefined}
        transition
        disablePortal
        placement="right"
        sx={{ zIndex: 99 }}
    >
        {({ TransitionProps }) => (
            <Grow
                {...TransitionProps}
            >
                <Paper>
                    <ClickAwayListener onClickAway={handleCloseMenu}>
                        <MenuList id="split-button-menu">
                            {actions
                                .map((action) => (
                                    <MenuItem
                                        key={action.id}
                                        disabled={action.disabled}
                                        onClick={() => {
                                            action.onClick();
                                        }}
                                    >
                                        <Typography variant="inherit">{action.label}</Typography>
                                    </MenuItem>
                                ))}
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Grow>
        )}
    </Popper> 
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

const generateSecuritiesTableRowData = (i) => {
  const denomination = parseInt(i?.denominationName?.value, 10);
  const issuanceAmount = parseInt(i?.issuanceAmount, 10);
  const numCerts = issuanceAmount / denomination;

  return {
    broker: i.broker ?? "--",
    csd: i.csdName?.name ?? "--",
    currency: i.currencyName?.name,
    issueDate: i.issueDate,
    dateSubmitted: i?.admissionDateSubmitted,
    externalSecurities: i.externalSecurities,
    externalSecuritiesId: i.externalSecuritiesId,
    id: i.id,
    isin: i.isin ?? "--",
    issuerEntityCorporateName: i.projectTeam?.find(({ group }) => group?.entityType === "ISSUER")
      ?.group?.entity?.corporateEntityName,
    numCerts: convertNumberToIntlFormat(numCerts),
    quantity: convertNumberToIntlFormat(i.issuanceAmount),
    security: i.name,
    status: i.admissionStatus,
    wsn: i.wsn,
    settlementDate: i.externalSecurities?.settlementDate,
  };
};

const SecuritiesTable = ({
  anchorEl,
  handleCloseMenu,
  data,
  actions,
  setCurrentlySelectedRowData,
  showAllFilters,
  setAnchorEl,
  entityUserType,
}) => {
  const { t } = useTranslation(["miscellaneous"]);
  const tableRef = useRef();
  const mtableLocalization = useMaterialTableLocalization();

  const securityOptionsList = data.map(({ security }) => ({
    label: security,
    value: security,
  }));

  const admissionStatusOptionsList = [
    {
      label: "Pending",
      value: admissionStatusEnum.PENDING,
    },
    {
      label: "Submitted",
      value: admissionStatusEnum.SUBMITTED,
    },
    {
      label: "Admitted",
      value: admissionStatusEnum.ADMITTED,
    },
    {
      label: "Rejected",
      value: admissionStatusEnum.REJECTED,
    },
  ];

  const dedupedIssuerEntityNames = Array.from(
    new Set(data.map((item) => item.issuerEntityCorporateName))
  ).sort();
  const entityNameOptionsList = dedupedIssuerEntityNames.map((issuerEntityName) => ({
    label: issuerEntityName,
    value: issuerEntityName,
  }));

  const headCells = [
    {
      id: "security",
      title: "Security",
      field: "security",
      defaultSort: "asc",
      customFilterAndSearch: (term, rowData) => term === rowData?.security,
      exportConfig: { width: 15 },
    },
    {
      id: "currency",
      title: "CCY",
      field: "currency",
    },
    {
      id: "dateSubmitted",
      title: "Date Submitted",
      field: "dateSubmitted",
      render: (rowData) => dateFormatter(rowData.dateSubmitted, DEFAULT_DATE_FORMAT),
      exportConfig: {
        render: (rowData) => dateFormatter(rowData?.dateSubmitted, DEFAULT_DATE_FORMAT),
        width: 8,
      },
    },
    {
      id: "settlementDate",
      title: "Settlement Date",
      field: "settlementDate",
      render: (rowData) => dateFormatter(rowData.settlementDate, DEFAULT_DATE_FORMAT),
      exportConfig: {
        render: (rowData) => dateFormatter(rowData?.settlementDate, DEFAULT_DATE_FORMAT),
        width: 8,
      },
    },
    {
      id: "valueDate",
      title: "Value Date",
      field: "issueDate",
      render: (rowData) => dateFormatter(rowData?.issueDate, DEFAULT_DATE_FORMAT),
      exportConfig: {
        render: (rowData) => dateFormatter(rowData?.issueDate, DEFAULT_DATE_FORMAT),
        width: 8,
      },
    },
    {
      id: "wsn",
      title: "WSN",
      field: "wsn",
      exportConfig: { width: 8 },
    },
    {
      id: "isin",
      title: "ISIN",
      field: "isin",
    },
    {
      id: "csd",
      title: "Registrar",
      field: "csd",
    },
    {
      id: "broker",
      title: "Broker",
      field: "broker",
      hidden: ["ISSUER"].includes(entityUserType),
    },
    {
      id: "quantity",
      title: "Issuance amount",
      field: "quantity",
      type: "numeric",
      exportConfig: { align: "right", width: 8 },
    },
    {
      id: "numCerts",
      title: "Num Certs",
      field: "numCerts",
      type: "numeric",
    },
    {
      id: "status",
      title: "Status",
      field: "status",
    },
    {
      id: "entity",
      title: "Entity",
      field: "issuerEntityCorporateName",
      exportConfig: { width: 8 },
    },
  ];

  return (
    <Fragment>
      <FilterProvider tableKey="security_registration_table">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <TableFiltersWrapper
            tableRef={tableRef}
            data={data}
            columns={headCells}
            open={false}
            hideExportButtons
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={6}>
                <DateRangePicker
                  name="transactionDateRange"
                  label={t("miscellaneous:Filters.Date")}
                  defaultFilter="quarter"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {showAllFilters && (
                <Fragment>
                  <Grid item xs={12} md={6} lg={3}>
                    <DropdownFilter
                      name="security"
                      label="Security"
                      options={securityOptionsList}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <DropdownFilter name="entity" label="Entity" options={entityNameOptionsList} />
                  </Grid>
                </Fragment>
              )}
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter name="status" label="Status" options={admissionStatusOptionsList} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <ExportButtons tableRef={tableRef} name="Custody and Settlement Report" />
              </Grid>
            </Grid>
          </TableFiltersWrapper>
        </div>
        <FilterConsumer>
          {({ filters, filterColumns }) => {
            const filteredData = data
              .filter((row) => {
                // Date range Filter
                if (
                  filters?.transactionDateRange?.value?.startDate &&
                  filters?.transactionDateRange?.value?.endDate
                ) {
                  const { startDate, endDate } = filters?.transactionDateRange.value;
                  return moment(row.dateSubmitted).isBetween(startDate, endDate);
                }
                return true;
              })
              .filter((row) => {
                // Security Filter
                if (filters?.security) {
                  return row.security === filters?.security?.value?.value;
                }
                return true;
              })
              .filter((row) => {
                // Entity Filter
                if (filters?.entity) {
                  return row.issuerEntityCorporateName === filters?.entity?.value?.value;
                }
                return true;
              })
              .filter((row) => {
                // Status Filter
                if (filters?.status) {
                  return row.status === filters?.status?.value?.value;
                }
                return true;
              });
            return (
              <div data-testid="securities-table">
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
                    pageSize: 5,
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
    </Fragment>
  );
};

export default SecuritiesTable;

export { generateSecuritiesTableRowData };

SecuritiesTable.propTypes = {
  anchorEl: PropTypes.object,
  handleOpenMenu: PropTypes.func.isRequired,
  handleCloseMenu: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      security: PropTypes.string,
      currency: PropTypes.string,
    })
  ).isRequired,
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

SecuritiesTable.defaultProps = {
  entityUserType: "",
  showAllFilters: false,
};
