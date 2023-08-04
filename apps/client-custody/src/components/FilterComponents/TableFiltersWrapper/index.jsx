import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import { useFilters } from "../../../context/filter-context";
import ExportButtons from "../../ExportButtons";
import ManageColumnsDialog from "../ManageColumnsDialog";
import ResetColumnsDialog from "../ResetColumnsDialog";
import TableSearch from "../TableSearch";

const TableFiltersWrapper = ({
  columns,
  data,
  tableRef,
  exportData = {},
  children,
  hideExportButtons,
  open = false,
}) => {
  const [expanded, setExpanded] = useState(open ? "filter-toolbar" : false);
  const [manageColumnStatus, setManageColumnStatus] = useState(false);
  const [resetColumnStatus, setResetColumnStatus] = useState(false);
  const filterContext = useFilters();
  const { setAllColumns, filters, setTableData, tableKey } = filterContext;
  const { exportRef, ...rest } = exportData;

  const { t } = useTranslation(["miscellaneous"]);

  useEffect(() => {
    setTableData(data);
  }, [data, setTableData]);

  useEffect(() => {
    setAllColumns(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const calculateFilterCount = () => {
    const filterCount = Object.keys(filters).length;
    return filterCount;
  };

  const openManageColumnsDialog = (e) => {
    e.stopPropagation();
    setManageColumnStatus(true);
  };

  const closeManageColumnDialog = () => {
    setManageColumnStatus(false);
  };

  const openResetColumnsDialog = () => {
    setManageColumnStatus(false);
    setResetColumnStatus(true);
  };

  const closeResetColumnDialog = () => {
    setResetColumnStatus(false);
  };

  return (
    <Fragment>
      <MuiAccordion
        TransitionProps={{ unmountOnExit: true }}
        elevation={0}
        expanded={expanded === "filter-toolbar"}
        onChange={handleChange("filter-toolbar")}
      >
        <MuiAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-toolbar-content"
          id="filter-toolbar-header"
        >
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item container xs={6} sm={6} md={6} lg={3} alignContent="center">
              <FilterListIcon />
              <Badge badgeContent={calculateFilterCount()} color="primary" overlap="rectangular">
                <Typography variant="body1">{t("miscellaneous:Filters.Filters")}</Typography>
              </Badge>
            </Grid>

            <Grid
              item
              xs={12}
              md={3}
              lg={3}
              spacing={2}
              container
              alignContent="center"
              justifyContent="space-between"
            >
              <ExportButtons
                tableKey={tableKey}
                exportData={rest}
                ref={exportRef}
                hideExportButtons={hideExportButtons}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={3} lg={3} container alignContent="center">
              <Button
                variant="outlined"
                onClick={openManageColumnsDialog}
                startIcon={<ViewColumnIcon />}
                color="primary"
                size="large"
                fullWidth
              >
                {t("miscellaneous:Filters.Manage Columns")}
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={3} container>
              <TableSearch
                name="search"
                tableRef={tableRef}
                label={t("miscellaneous:Filters.Search")}
              />
            </Grid>
          </Grid>
        </MuiAccordionSummary>

        <MuiAccordionDetails>
          <div
            style={{
              width: "100%",
            }}
          >
            {children}
          </div>
        </MuiAccordionDetails>
      </MuiAccordion>
      {manageColumnStatus && (
        <ManageColumnsDialog
          open={manageColumnStatus}
          closeDialog={closeManageColumnDialog}
          openResetColumnsDialog={openResetColumnsDialog}
        />
      )}
      {resetColumnStatus && (
        <ResetColumnsDialog open={resetColumnStatus} closeDialog={closeResetColumnDialog} />
      )}
    </Fragment>
  );
};

TableFiltersWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default TableFiltersWrapper;
