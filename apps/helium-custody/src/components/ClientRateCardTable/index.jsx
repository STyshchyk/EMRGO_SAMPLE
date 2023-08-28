import React, { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import Grid from "@mui/material/Grid";
import moment from "moment";
import PropTypes from "prop-types";

import { dateRenderer } from "../../constants/documents/renderers";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import * as dropdownSelectors from "../../redux/selectors/dropdown";
import tableStyles from "../../styles/cssInJs/materialTable";
import BooleanCheckbox from "../FilterComponents/BooleanCheckbox";
import DateRangePicker from "../FilterComponents/DateRangePicker";
import DropdownFilter from "../FilterComponents/DropdownFilterUpdated";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";
import MaterialTableOverflowMenu from "../MaterialTableOverflowMenu";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ClientRateCardTable = ({
  anchorEl,
  data,
  actions,
  setCurrentlySelectedRowData,
  setAnchorEl,
  currentlySelectedRowData,
}) => {
  const tableRef = useRef();
  const { t } = useTranslation(["billing", "miscellaneous"]);
  const mtableLocalization = useMaterialTableLocalization();
  const dropdownOptions = useSelector(dropdownSelectors.selectDropdownOptions);

  const clientRateCardStatus = dropdownOptions?.clientRateCardStatus;

  const activeRateCardStatus = clientRateCardStatus?.find((status) => status.key === "active");

  const defaultFilter = "all";

  const columns = [
    {
      id: "entity",
      title: t("Client Rate Card.Table.Client"),
      field: "entityName",
    },
    {
      id: "billingAccount",
      title: t("Client Rate Card.Table.Billing Account"),
      field: "billingAccount",
    },
    {
      id: "billingPeriod",
      title: t("Client Rate Card.Table.Billing Period"),
      field: "billingPeriod",
    },
    {
      id: "status",
      title: t("Client Rate Card.Table.Status"),
      field: "statusLabel",
    },
    {
      id: "version",
      title: t("Client Rate Card.Table.Version"),
      field: "version",
    },
    {
      id: "lastUpdated",
      title: t("Client Rate Card.Table.Last Updated"),
      field: "lastUpdated",
      render: (rowData) => dateRenderer(rowData.lastUpdated),
    },
  ];

  const entityList = data.map((ratecard) => ratecard.entity);

  const generatedEntityList = entityList
    .filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i)
    .map((entity) => {
      const entityName = entity.name;
      return {
        value: entity.id,
        label: entityName,
      };
    });

  return (
    <Fragment>
      <FilterProvider tableKey="client_rate_card">
        <div className="mb-4">
          <TableFiltersWrapper
            tableRef={tableRef}
            columns={columns}
            tableKey="client_rate_card"
            hideExportButtons
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={6}>
                <DateRangePicker
                  name="lastUpdatedDateRange"
                  label="Updated Date"
                  defaultFilter={defaultFilter}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter name="client" label="Client" options={generatedEntityList} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <BooleanCheckbox name="latest" label="Latest Rate Cards Only" />
              </Grid>
            </Grid>
          </TableFiltersWrapper>
        </div>
        <FilterConsumer>
          {({ filters, filterColumns }) => {
            const { lastUpdatedDateRange, client, latest } = filters;
            const filteredData = data
              .filter((rateCard) => {
                // Last Updated Filter
                const lastUpdated = moment(rateCard?.lastUpdated);
                let isValid = false;
                if (lastUpdatedDateRange) {
                  const startDate = lastUpdatedDateRange?.value?.startDate;
                  const endDate = lastUpdatedDateRange?.value?.endDate;
                  if (lastUpdated.isBetween(startDate, endDate)) {
                    isValid = true;
                  }
                } else {
                  isValid = true;
                }
                return isValid;
              })
              .filter((rateCard) => {
                // Client Filter
                const entityId = rateCard?.entity.id;
                let isValid = false;
                if (client) {
                  isValid = entityId === client?.value?.value;
                } else {
                  isValid = true;
                }
                return isValid;
              })
              .filter((rateCard) => {
                // Latest Filter
                const statusId = rateCard?.statusId;
                let isValid = false;
                if (latest && latest?.value) {
                  isValid = statusId === activeRateCardStatus.id;
                } else {
                  isValid = true;
                }
                return isValid;
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
                  columns={[...filterColumns.shownColumns]}
                  data={filteredData}
                  actions={[
                    {
                      icon: () => <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" />,
                      onClick: (event, rowData) => {
                        setAnchorEl(event.currentTarget);
                        setCurrentlySelectedRowData(rowData);
                        // processActions(rowData.status);
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

export default ClientRateCardTable;

ClientRateCardTable.propTypes = {
  anchorEl: PropTypes.object,
  handleCloseMenu: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
      onClick: PropTypes.func,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  setCurrentlySelectedRowData: PropTypes.func.isRequired,
  showAllFilters: PropTypes.bool,
  setAnchorEl: PropTypes.func.isRequired,
  setOpenDialog: PropTypes.func,
};
