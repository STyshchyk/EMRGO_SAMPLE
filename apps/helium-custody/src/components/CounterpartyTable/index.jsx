import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { capitalCase } from "change-case";
import PropTypes from "prop-types";

import { reportDateRenderer } from "../../constants/renderers";
import { counterpartyStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import { transformShownColumns } from "../../helpers/table";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import * as authSelectors from "../../redux/selectors/auth";
import tableStyles from "../../styles/cssInJs/materialTable";
import DropdownFilter from "../FilterComponents/DropdownFilter";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";
import MaterialTableOverflowMenu from "../MaterialTableOverflowMenu";
import ExportTableContent from "../PDFExporter/ExportTableContent";
import ReportingTablePDFExporter from "../ReportingTablePDFExporter";

const generateCounterpartyTableRowData = (i) => ({
  id: i.id, // counterparty row id
  entity: i.entityId?.label,
  counterpartyId: i?.counterpartyId,
  shortName: i.shortName,
  longName: i.longName,
  status: i.status?.label,
  createdAt: i?.createdAt,
});

const CounterpartyTable = ({
  anchorEl,
  data,
  actions,
  setCurrentlySelectedRowData,
  setAnchorEl,
  setOpenDialog,
}) => {
  const tableRef = useRef();
  const exportRef = useRef();
  const { t } = useTranslation(["counterparty"]);
  const mtableLocalization = useMaterialTableLocalization();
  const [entityFilterValue, setEntityFilterValue] = useState("");
  const [statusFilterValue, setStatusFilterValue] = useState("");
  const [filteredDataRows, setFilteredDataRows] = useState([]);

  const userFullName = useSelector(authSelectors.selectUserFullName);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);
  const currentCorporateEntityName = useSelector(authSelectors.selectCurrentCorporateEntityName);

  const dedupedEntityNames = Array.from(new Set(data.map((item) => item.entity))).sort();
  const entityOptionsList = dedupedEntityNames.map((entityName) => ({
    label: entityName,
    value: entityName,
  }));

  const statusOptionsList = [
    {
      label: "Active",
      value: counterpartyStatusEnum.ACTIVE,
    },
    {
      label: "Inactive",
      value: counterpartyStatusEnum.INACTIVE,
    },
  ];

  const exportFilters = [
    {
      label: t("counterparty:Export Date"),
      value: reportDateRenderer(),
    },
    {
      label: t("counterparty:Generated By"),
      value: `${userFullName} - ${capitalCase(currentEntityType)}, ${currentCorporateEntityName}`,
    },
  ];

  const columns = [
    {
      id: "entity",
      title: t("Counterparty.Headers.Entity"),
      field: "entity",
      defaultFilter: entityFilterValue?.value,
      customFilterAndSearch: (term, rowData) => term === rowData?.entity,
    },
    {
      id: "counterpartyId",
      title: t("Counterparty.Headers.Counterparty ID"),
      field: "counterpartyId",
    },
    {
      id: "shortName",
      title: t("Counterparty.Headers.Short Name"),
      field: "shortName",
    },
    {
      id: "longName",
      title: t("Counterparty.Headers.Long Name"),
      field: "longName",
    },
    {
      id: "status",
      title: t("Counterparty.Headers.Status"),
      field: "status",
      defaultFilter: statusFilterValue?.value,
      customFilterAndSearch: (term, rowData) => term === rowData?.status,
    },
  ];

  const transformData = (originalData) => {
    if (!originalData) return {};

    const { entity, counterpartyId, shortName, longName, status } = originalData;

    return {
      entity: {
        label: t("Counterparty.Headers.Entity"),
        value: entity,
      },
      counterpartyId: {
        label: t("Counterparty.Headers.Counterparty ID"),
        value: counterpartyId,
      },
      shortName: {
        label: t("Counterparty.Headers.Short Name"),
        value: shortName,
      },
      longName: {
        label: t("Counterparty.Headers.Long Name"),
        value: longName,
      },
      status: {
        label: t("Counterparty.Headers.Status"),
        value: status,
      },
    };
  };

  const transformedData = data?.map((d) => transformData(d));

  const exportData = {
    exportFilters,
    exportRef,
    transformedData,
  };

  useEffect(() => {
    setFilteredDataRows(tableRef.current?.dataManager?.filteredData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRef.current?.state && tableRef.current?.state?.data]);

  return (
    <Fragment>
      <Box pb={3}>
        <Grid alignItems="center" justifyContent="flex-end" item container md={12}>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              {t("Counterparty.Buttons.New Counterparty")}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <FilterProvider tableKey="counterparty_list">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <TableFiltersWrapper
            columns={columns}
            tableRef={tableRef}
            tableKey="counterparty_list"
            exportData={exportData}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="entity"
                  label="Entity"
                  options={entityOptionsList}
                  currentlySelectedOption={entityFilterValue}
                  setCurrentlySelectedOption={setEntityFilterValue}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="status"
                  label="Status"
                  options={statusOptionsList}
                  currentlySelectedOption={statusFilterValue}
                  setCurrentlySelectedOption={setStatusFilterValue}
                />
              </Grid>
            </Grid>
          </TableFiltersWrapper>
        </div>

        <FilterConsumer>
          {({ filterColumns, filters }) => {
            const filteredData = data.filter(() => true);
            return (
              <Fragment>
                <MaterialTable
                  tableRef={tableRef}
                  size="small"
                  title=""
                  style={{
                    boxShadow: "none",
                  }}
                  columns={transformShownColumns(filterColumns?.shownColumns, filters)}
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
                <MaterialTableOverflowMenu
                  actions={actions}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  selectedRow={setCurrentlySelectedRowData}
                />

                <ReportingTablePDFExporter ref={exportRef} title="Counterparty">
                  <ExportTableContent
                    columns={filterColumns?.shownColumns}
                    tableOptions={{
                      sliceRowCount: 5,
                      tableOffset: 3,
                    }}
                    data={filteredDataRows}
                    filters={exportFilters}
                    title={`${t("Counterparty.Counterparty")}`}
                  />
                </ReportingTablePDFExporter>
              </Fragment>
            );
          }}
        </FilterConsumer>
      </FilterProvider>
    </Fragment>
  );
};

export default CounterpartyTable;

export { generateCounterpartyTableRowData };

CounterpartyTable.propTypes = {
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
  setOpenDialog: PropTypes.func.isRequired,
};
