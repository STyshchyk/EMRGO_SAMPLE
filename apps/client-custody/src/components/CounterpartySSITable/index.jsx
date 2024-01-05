import { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import v from "voca";

import { reportDateRenderer } from "../../constants/renderers";
import {
  counterpartyStatusEnum,
  settlementLocationEnum,
} from "../../constants/wethaqAPI/securitiesServices";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import { getSSIHeaderColumn, transformShownColumns } from "../../helpers/table";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import * as authSelectors from "../../redux/selectors/auth";
import tableStyles from "../../styles/cssInJs/materialTable";
import CustomCounterpartyTableHeader from "../CustomCounterpartyTableHeader";
import DropdownFilter from "../FilterComponents/DropdownFilter";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";
import MaterialTableOverflowMenu from "../MaterialTableOverflowMenu";
import ExportTableContent from "../PDFExporter/ExportTableContent";
import ReportingTablePDFExporter from "../ReportingTablePDFExporter";

const generateCounterpartySSITableRowData = (i) => ({
  id: i.id,
  entity: i?.entityId?.label,
  counterparty: i?.counterpartyId?.label,
  counterpartyLongName: i?.longName?.label,
  ssiLabel: i?.ssiLabel,
  settlementLocation: i?.settlementLocationId?.label,
  deliveryOrReceiveAgentIdType: i?.deliveryAgentIdentifierTypeId?.label,
  deliveryOrReceiveIdentifier: i.deliveryAgentIdentifier,
  sellerOrBuyerIdType: i?.sellerIdentifierTypeId?.label ?? "--",
  sellerOrBuyerIdentifier: i.sellerIdentifier ?? "--",
  safekeepingAccount: i?.safekeepingAccount ?? "--",
  createdAt: i?.createdAt,
  status: i?.status,
});

const CounterpartySSITable = ({
  anchorEl,
  data,
  actions,
  setCurrentlySelectedRowData,
  setAnchorEl,
  setOpenDialog,
}) => {
  const { t } = useTranslation(["counterparty"]);
  const exportRef = useRef();
  const tableRef = useRef();
  const mtableLocalization = useMaterialTableLocalization();

  const [entityFilterValue, setEntityFilterValue] = useState("");
  const [counterpartyFilterValue, setCounterpartyFilterValue] = useState("");
  const [settlementLocationFilterValue, setSettlementLocationFilterValue] = useState("");
  const [statusFilterValue, setStatusFilterValue] = useState("");

  const userFullName = useSelector(authSelectors.selectUserFullName);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);
  const currentCorporateEntityName = useSelector(authSelectors.selectCurrentCorporateEntityName);

  const exportFilters = [
    {
      label: "Export Date",
      value: reportDateRenderer(new Date()),
    },
    {
      label: "Generated By",
      value: `${userFullName} - ${v.capitalize(currentEntityType)}, ${currentCorporateEntityName}`,
    },
  ];

  const columns = [
    {
      id: "entity",
      title: t("Counterparty SSI.Headers.Entity"),
      field: "entity",
      defaultFilter: entityFilterValue,
      customFilterAndSearch: (term, rowData) => {
        if (!term) return true;
        return term === rowData?.entity;
      },
    },
    {
      id: "counterparty",
      title: t("Counterparty SSI.Headers.Counterparty"),
      field: "counterparty",
      defaultFilter: counterpartyFilterValue,
      customFilterAndSearch: (term, rowData) => {
        if (!term) return true;
        term === rowData?.counterparty;
      },
    },
    {
      id: "counterpartyLongName",
      title: t("Counterparty SSI.Headers.Counterparty Long Name"),
      field: "counterpartyLongName",
    },
    {
      id: "ssiLabel",
      title: t("Counterparty SSI.Headers.SSI Label"),
      field: "ssiLabel",
    },
    {
      id: "settlementLocation",
      title: t("Counterparty SSI.Headers.Settlement Location"),
      field: "settlementLocation",
      defaultFilter: settlementLocationFilterValue,
    },
    {
      id: "deliveryOrReceiveAgentIdType",
      title: t("Counterparty SSI.Headers.ID Type"),
      field: "deliveryOrReceiveAgentIdType",
    },
    {
      id: "deliveryOrReceiveIdentifier",
      title: t("Counterparty SSI.Headers.Identifier"),
      field: "deliveryOrReceiveIdentifier",
    },
    {
      id: "sellerOrBuyerIdType",
      title: t("Counterparty SSI.Headers.ID Type"),
      field: "sellerOrBuyerIdType",
    },
    {
      id: "sellerOrBuyerIdentifier",
      title: t("Counterparty SSI.Headers.Identifier"),
      field: "sellerOrBuyerIdentifier",
    },
    {
      id: "safekeepingAccount",
      title: t("Counterparty SSI.Headers.Safekeeping Account"),
      field: "safekeepingAccount",
    },
    {
      id: "status",
      title: t("Counterparty SSI.Headers.Status"),
      field: "status",
      defaultFilter: statusFilterValue,
      customFilterAndSearch: (term, rowData) => {
        if (!term) return true;
        return term === rowData?.status;
      },
    },
  ];

  const transformData = (originalData) => {
    if (!originalData) return {};

    const {
      entity,
      counterparty,
      ssiLabel,
      settlementLocation,
      deliveryOrReceiveAgentIdType,
      deliveryOrReceiveIdentifier,
      sellerOrBuyerIdType,
      sellerOrBuyerIdentifier,
      safekeepingAccount,
      status,
    } = originalData;

    return {
      entity: {
        label: t("Counterparty SSI.Headers.Entity"),
        value: entity,
      },
      counterparty: {
        label: t("Counterparty SSI.Headers.Counterparty"),
        value: counterparty,
      },
      ssiLabel: {
        label: t("Counterparty SSI.Headers.SSI Label"),
        value: ssiLabel,
      },
      settlementLocation: {
        label: t("Counterparty SSI.Headers.Settlement Location"),
        value: settlementLocation,
      },
      deliveryOrReceiveAgentIdType: {
        label: t("Counterparty SSI.Headers.ID Type"),
        value: deliveryOrReceiveAgentIdType,
      },
      deliveryOrReceiveIdentifier: {
        label: t("Counterparty SSI.Headers.Identifier"),
        value: deliveryOrReceiveIdentifier,
      },
      sellerOrBuyerIdType: {
        label: t("Counterparty SSI.Headers.ID Type"),
        value: sellerOrBuyerIdType,
      },
      sellerOrBuyerIdentifier: {
        label: t("Counterparty SSI.Headers.Identifier"),
        value: sellerOrBuyerIdentifier,
      },
      safekeepingAccount: {
        label: t("Counterparty SSI.Headers.Safekeeping Account"),
        value: safekeepingAccount,
      },
      status: {
        label: "Status",
        value: status,
      },
    };
  };

  const transformedData = data.map((d) => transformData(d));

  // const { listOfColumnNames, listOfRowValues } = getCsvData(transformedData);

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

  const dedupedEntityNames = Array.from(new Set(data.map((item) => item.entity))).sort();
  const entityOptionsList = dedupedEntityNames.map((entityName) => ({
    label: entityName,
    value: entityName,
  }));

  const dedupedCounterpartyNames = Array.from(
    new Set(data.map((item) => item.counterparty))
  ).sort();
  const counterpartyOptionsList = dedupedCounterpartyNames.map((counterpartyName) => ({
    label: counterpartyName,
    value: counterpartyName,
  }));

  const settlementLocationOptionsList = [
    {
      label: "SIX",
      value: settlementLocationEnum.SIX,
    },
    {
      label: "Euroclear",
      value: settlementLocationEnum.EUROCLEAR,
    },
    {
      label: "Clearstream",
      value: settlementLocationEnum.CLEARSTREAM,
    },
  ];

  const exportData = {
    exportFilters,
    exportRef,
    transformedData,
  };

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
              {t("Counterparty SSI.Buttons.New SSI")}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <FilterProvider tableKey="ssiTable">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <TableFiltersWrapper
            columns={columns}
            tableRef={tableRef}
            tableKey="ssiTable"
            exportData={exportData}
            hideExportButtons
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="entity"
                  label="Entity"
                  options={entityOptionsList}
                  currentlySelectedOption={
                    entityOptionsList.length === 1 ? entityOptionsList[0] : entityFilterValue
                  }
                  setCurrentlySelectedOption={setEntityFilterValue}
                  hasDefaultValue={entityOptionsList.length === 1}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="counterparty"
                  label="Counterparty"
                  options={counterpartyOptionsList}
                  currentlySelectedOption={counterpartyFilterValue}
                  setCurrentlySelectedOption={setCounterpartyFilterValue}
                />

                {/* <DropdownFilter name="counterparty" title="Counterparty" options={counterpartyOptionsList} setDefaultFilterValue={setCounterpartyFilterValue} /> */}
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="settlementLocation"
                  label="Settlement Location"
                  options={settlementLocationOptionsList}
                  currentlySelectedOption={settlementLocationFilterValue}
                  setCurrentlySelectedOption={setSettlementLocationFilterValue}
                />

                {/* <DropdownFilter name="settlementLocation" title="Settlement Location" options={settlementLocationOptionsList} setDefaultFilterValue={setSettlementLocationFilterValue} /> */}
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="status"
                  label="Status"
                  options={statusOptionsList}
                  currentlySelectedOption={statusFilterValue}
                  setCurrentlySelectedOption={setStatusFilterValue}
                />

                {/* <DropdownFilter name="status" title="Status" options={statusOptionsList} setDefaultFilterValue={setStatusFilterValue} /> */}
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
                  components={{
                    Header: (props) => (
                      <CustomCounterpartyTableHeader {...props} filterColumns={filterColumns} />
                    ),
                  }}
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

                <ReportingTablePDFExporter ref={exportRef} title="Counterparty SSI">
                  <ExportTableContent
                    columns={filterColumns?.shownColumns}
                    headerColumns={getSSIHeaderColumn(filterColumns?.shownColumns)}
                    tableOptions={{
                      sliceRowCount: 5,
                      tableOffset: 3,
                    }}
                    data={data}
                    filters={exportFilters}
                    title={t("Counterparty SSI.Counterparty SSI")}
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

export default CounterpartySSITable;

export { generateCounterpartySSITableRowData };

CounterpartySSITable.propTypes = {
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
