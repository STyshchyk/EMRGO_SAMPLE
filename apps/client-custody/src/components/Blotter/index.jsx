import { createRef, Fragment, useMemo, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { Select } from "@emrgo-frontend/shared-ui";
import makeAnimated from "react-select/animated";

import MomentUtils from "@date-io/moment";
import MaterialTable from "@material-table/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CreateIcon from "@mui/icons-material/Create";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { pascalCase } from "change-case";
import cx from "classnames";
import { CsvBuilder } from "filefy";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import concat from "lodash.concat";
import find from "lodash.find";
import partition from "lodash.partition";
import remove from "lodash.remove";
import moment from "moment";
import PropTypes from "prop-types";

import {
  accountColumns,
  defaultColumnsSelected,
  filteredColumns,
  issuanceColumns,
  preSetColumns,
  tradeColumns,
} from "../../constants/paymentAndStatuses/blotterColumns";
import { useTheme } from "../../context/theme-context";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import MaterialTableOverflowMenu from "../MaterialTableOverflowMenu";
import style from "./style.module.scss";

const animatedComponents = makeAnimated();

const Blotter = ({
  keyedData,
  parameters,
  blotterId,
  updateSingleBlotter,
  deleteSingleBlotter,
  blotterDropdowns,
  settleTrade,
  currentEntityGroup,
  approveTrade,
}) => {
  const { t } = useTranslation(["blotter", "statuses"]);
  const mtableLocalization = useMaterialTableLocalization();

  const { theme } = useTheme();
  const currentEntityGroupID = currentEntityGroup?.id;
  const entityType = currentEntityGroup?.entityType;
  const entityTypeFilteredColumns = filteredColumns[entityType];
  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const [isNameBeingUpdated, setIsNameBeingUpdated] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [openManageColumns, setOpenManageColumns] = useState(false);
  const [settlementAnchorEl, settlementSetAnchorEl] = useState(null);
  const [openDialogue, setOpenDialogue] = useState(false);
  const [openApproveDialogue, setOpenApproveDialogue] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState({});
  const anchorRef = useRef(null);
  const blotterRef = createRef();
  let toolbarProps = {};

  const { accessControls } = currentEntityGroup;
  const hasBlotterSettlePermission = accessControls.some((acl) => acl?.key === "Blotter/Settle");
  const hasBlotterApprovePermission = accessControls.some((acl) => acl?.key === "Blotter/Approve");

  // const [selectedColumns, setSelectedColumns] = useState([]);

  const currencies = blotterDropdowns.currency;
  const countries = blotterDropdowns.country;

  const handleDateRangePickerOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettlementDateRangePickerOpen = (event) => {
    settlementSetAnchorEl(event.currentTarget);
  };

  const handleDateRangePickerClose = () => {
    setAnchorEl(null);
  };

  const handleSettlementDateRangePickerClose = () => {
    settlementSetAnchorEl(null);
  };

  const handleDelete = (e, id) => {
    deleteSingleBlotter(id);
  };

  // const handleViewMenuToggle = () => {
  //   setOpenManageColumns((prevOpen) => !prevOpen);
  // };

  const handlePresetColumnSelection = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenManageColumns(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDialogue(false);
    setSelectedInvestor({});
  };

  const handleApproveClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenApproveDialogue(false);
    setSelectedInvestor({});
  };

  const settleAmount = () => {
    if (selectedInvestor.sukuk.trade.length > 0) {
      settleTrade({ id: selectedInvestor.sukuk.trade[0].id });
    }
    setOpenDialogue(false);
  };

  const approveAmount = () => {
    if (selectedInvestor.sukuk.trade.length > 0) {
      approveTrade({ id: selectedInvestor.sukuk.trade[0].id });
    }
    setOpenApproveDialogue(false);
  };

  const { filters } = parameters;

  const exportToCSV = (columns, data) => {
    const exportedColumns = columns.filter((columnDef) => columnDef);
    const exportedData = data.map((rowData) =>
      columns.map((columnDef) => {
        let returnable = "";
        if (columnDef.type === "date") {
          returnable = columnDef.render
            ? columnDef.render(rowData)
            : blotterRef.current.dataManager.getFieldValue(rowData, columnDef);
        } else if (columnDef.custom === "readyToSettle") {
          returnable = rowData.readyToSettle.label;
        } else {
          returnable = blotterRef.current.dataManager.getFieldValue(rowData, columnDef);
        }
        return returnable;
      })
    );
    const fileName = `${pascalCase(parameters.name)}_${moment().format("DD-MM-YYYY")}`;

    const builder = new CsvBuilder(`${fileName}.csv`);
    builder
      .setDelimeter(",")
      .addRow([`${parameters.name}`])
      .addRow([""])
      .addRow(exportedColumns.map((columnDef) => columnDef.title))
      .addRows(exportedData)
      .exportFile();
  };

  const exportToFile = () => {
    exportToCSV(blotterRef.current.dataManager.columns, blotterRef.current.dataManager.data);
  };

  const settleTradeForInvestor = (value) => {
    setSelectedInvestor(value);
    setOpenDialogue(true);
  };

  const approveTradeForInvestor = (value) => {
    setSelectedInvestor(value);
    setOpenApproveDialogue(true);
  };

  const actions = [];

  if (hasBlotterApprovePermission) {
    const { settlementStatus } = selectedTrade;
    actions.push({
      callback: () => {
        approveTradeForInvestor(selectedTrade);
      },
      icon: <CheckIcon fontSize="small" />,
      label: t("blotter:Actions.Initiate Trade"),
      disabled: settlementStatus !== "Ready to Settle",
    });
  }

  if (hasBlotterSettlePermission) {
    const { settlementStatus } = selectedTrade;
    actions.push({
      callback: () => {
        settleTradeForInvestor(selectedTrade);
      },
      icon: <SwapHorizontalCircleIcon fontSize="small" />,
      label: t("blotter:Actions.Settle Trade"),
      disabled: settlementStatus !== "Approved",
    });
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const reInitColumns = (storedColumns) => {
    const reInitialisedColumns = storedColumns.map((column) => {
      const defaultColumn = [...issuanceColumns, ...tradeColumns, ...accountColumns].find(
        (value) => {
          if (value.field === column.field) {
            return true;
          }
          return false;
        }
      );
      return {
        ...column,
        width: defaultColumn?.width || 150,
        render: defaultColumn?.render || null,
        custom: defaultColumn?.custom || null,
        type: defaultColumn?.type || null,
        emptyValue: defaultColumn?.emptyValue || "",
      };
    });
    return reInitialisedColumns;
  };

  const getItemStyle = (isDragging) =>
    isDragging ? style["columnManager__column--active"] : style["columnManager__column--inactive"];

  const getListStyle = (isDraggingOver) =>
    isDraggingOver ? style["columnManager__list--active"] : style["columnManager__list--inactive"];

  const defaultColumns = useMemo(() => defaultColumnsSelected("defaultBlotter"), []);

  return (
    <Fragment>
      <Card className={style.blotter__card}>
        <MuiPickersUtilsProvider utils={MomentUtils} locale={theme.locale.altLocale}>
          <Formik
            initialValues={{
              name: parameters.name,
              blotterHeight: filters.blotterHeight || 200,
              fromDate: filters.fromDate || null,
              toDate: filters.toDate || null,
              settlementFromDate: filters.fromDate || null,
              settlementToDate: filters.toDate || null,
              isin: filters.isin || "",
              wsn: filters.wsn || "",
              entityId: filters.entityId || "",
              entityName: filters.entityName || "",
              issuerCountry: filters.issuerCountry || [],
              currency: filters.currency || [],
              searchText: filters.searchText || "",
              shownColumns: filters.shownColumns
                ? reInitColumns(filters.shownColumns)
                : defaultColumns.shown,
              hiddenColumns: filters.hiddenColumns || defaultColumns.hidden,
              frozenColumns: parseInt(filters.frozenColumns, 10) || 0,
              shownRows: filters.shownRows || 5,
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                setSubmitting(false);
              }, 500);
              updateSingleBlotter(blotterId, values);
            }}
          >
            {({ submitForm, values, setFieldValue }) => {
              const selectDefaultColumns = () => {
                setColumnModalOpen(true);
              };

              const columnDefinitions = values.shownColumns
                .filter((column) => !entityTypeFilteredColumns.includes(column.field))
                .map((column) => ({
                  // title: column.columnName || column.title,
                  title: column.columnName
                    ? t(`blotter:Columns.${column.columnName}`)
                    : t(`blotter:Columns.${column.title}`),
                  field: column.data || column.field,
                  cellStyle: {
                    color: "#23389c",
                    padding: "1px 4px",
                    border: "1px solid #cfd8dc",
                  },
                  width: column.width || 200,
                  render: column.render,
                  custom: column.custom,
                  type: column.type,
                  editable: hasBlotterSettlePermission ? column.editable || "never" : "never",
                  emptyValue: column.emptyValue || "",
                }));

              const handleRemoveCurrencySelection = (e, key) => {
                e.stopPropagation();
                const newCurrencyList = values.currency.filter(
                  (currency) => currency.value !== key
                );
                setFieldValue("currency", newCurrencyList, false);
                submitForm();
              };

              const handleRemoveCountrySelection = (e, key) => {
                e.stopPropagation();
                const newCountryList = values.issuerCountry.filter(
                  (country) => country.value !== key
                );
                setFieldValue("issuerCountry", newCountryList, false);
                submitForm();
              };

              const filteredCurrency = currencies.map((currency) => ({
                data: currency,
                value: currency.name,
                label: currency.label,
              }));

              const filteredCountry = countries.map((country) => ({
                data: country,
                value: country.label,
                label: country.name,
              }));

              const setDateRange = (type, columnType = "issue") => {
                const fromDate = moment();
                const toDate = moment();

                let column1Name = "";
                let column2Name = "";
                if (columnType === "issue") {
                  column1Name = "fromDate";
                  column2Name = "toDate";
                } else {
                  column1Name = "settlementFromDate";
                  column2Name = "settlementToDate";
                }

                switch (type) {
                  case "today":
                    fromDate.startOf("day");
                    toDate.endOf("day");
                    setFieldValue(column1Name, fromDate, false);
                    setFieldValue(column2Name, toDate, false);
                    break;
                  case "week":
                    fromDate.startOf("week");
                    toDate.endOf("day");
                    setFieldValue(column1Name, fromDate, false);
                    setFieldValue(column2Name, toDate, false);
                    break;
                  case "seven":
                    fromDate.subtract(7, "days").startOf("day");
                    toDate.endOf("day");
                    setFieldValue(column1Name, fromDate, false);
                    setFieldValue(column2Name, toDate, false);
                    break;
                  case "month":
                    fromDate.startOf("month");
                    toDate.endOf("day");
                    setFieldValue(column1Name, fromDate, false);
                    setFieldValue(column2Name, toDate, false);
                    break;
                  case "thirty":
                    fromDate.subtract(30, "days").startOf("day");
                    toDate.endOf("day");
                    setFieldValue(column1Name, fromDate, false);
                    setFieldValue(column2Name, toDate, false);
                    break;
                  case "quarter":
                    fromDate.startOf("quarter");
                    toDate.endOf("day");
                    setFieldValue(column1Name, fromDate, false);
                    setFieldValue(column2Name, toDate, false);
                    break;
                  case "year":
                    fromDate.startOf("year");
                    toDate.endOf("day");
                    setFieldValue(column1Name, fromDate, false);
                    setFieldValue(column2Name, toDate, false);
                    break;
                  default:
                  // code block
                }
                handleDateRangePickerClose();
                handleSettlementDateRangePickerClose();
                submitForm();
              };

              const clearFilter = (key) => {
                switch (key) {
                  case "search":
                    setFieldValue("searchText", "", false);
                    break;
                  case "range":
                    setFieldValue("fromDate", null, false);
                    setFieldValue("toDate", null, false);
                    break;
                  case "settlementRange":
                    setFieldValue("settlementFromDate", null, false);
                    setFieldValue("settlementToDate", null, false);
                    break;
                  case "security":
                    setFieldValue("isin", "", false);
                    setFieldValue("wsn", "", false);
                    break;
                  case "entity":
                    setFieldValue("entityId", "", false);
                    setFieldValue("entityName", "", false);
                    break;
                  case "country":
                    setFieldValue("issuerCountry", [], false);
                    break;
                  case "currency":
                    setFieldValue("currency", [], false);
                    break;
                  default:
                  // code block
                }
                submitForm();
              };

              const getList = (id) => {
                let returnable = null;
                if (id === "shown") {
                  returnable = values.shownColumns;
                } else {
                  returnable = values.hiddenColumns;
                }
                return returnable;
              };

              const swapColumns = () => {
                const tempShownColumns = values.shownColumns;
                setFieldValue("shownColumns", values.hiddenColumns, false);
                setFieldValue("hiddenColumns", tempShownColumns, false);
              };

              const moveHiddenColumns = () => {
                setFieldValue(
                  "shownColumns",
                  [...values.shownColumns, ...values.hiddenColumns],
                  false
                );
                setFieldValue("hiddenColumns", [], false);
              };

              const moveShownColumns = () => {
                setFieldValue(
                  "hiddenColumns",
                  [...values.hiddenColumns, ...values.shownColumns],
                  false
                );
                setFieldValue("shownColumns", [], false);
              };

              const sortArrayAccordingToPreset = (shownColumns, preSetKeys) => {
                let sortedArray = [];
                preSetKeys.map((key) => {
                  const foundColumns = find(shownColumns, (column) => key === column.field);
                  remove(shownColumns, (column) => key === column.field);
                  if (foundColumns) {
                    sortedArray = concat(sortedArray, foundColumns);
                  }
                  return false;
                });
                return sortedArray;
              };

              const handlePresetColumnSelected = (event, option) => {
                const allColumns = [...issuanceColumns, ...tradeColumns, ...accountColumns];
                const partitionedArray = partition(allColumns, (column) =>
                  option.columns.includes(column.field)
                );
                const newShown = partitionedArray[0];
                const newHidden = partitionedArray[1];

                const sortedShownArray = sortArrayAccordingToPreset(newShown, option.columns);
                setFieldValue("shownColumns", sortedShownArray, false);
                setFieldValue("hiddenColumns", newHidden, false);

                submitForm();
              };

              const onDragEnd = (result) => {
                const { source, destination } = result;
                // dropped outside the list
                if (!destination) {
                  return;
                }

                if (source.droppableId === destination.droppableId) {
                  const currentItems = reorder(
                    getList(source.droppableId),
                    source.index,
                    destination.index
                  );

                  if (source.droppableId === "shown") {
                    setFieldValue("shownColumns", currentItems, false);
                  } else {
                    setFieldValue("hiddenColumns", currentItems, false);
                  }
                } else {
                  const currentResult = move(
                    getList(source.droppableId),
                    getList(destination.droppableId),
                    source,
                    destination
                  );

                  setFieldValue("shownColumns", currentResult.shown, false);
                  setFieldValue("hiddenColumns", currentResult.hidden, false);
                }
              };

              const onSearchChange = (searchText) => {
                toolbarProps.dataManager.changeSearchText(searchText);
                toolbarProps.onSearchChanged(searchText);
                setFieldValue("searchText", searchText, false);
              };

              const filteredData = keyedData
                .filter((row) => {
                  if (row.tradeDate === "") {
                    return true;
                  }
                  let fromDate = moment("1970-01-01").startOf("day");
                  if (values.fromDate) {
                    fromDate = moment(values.fromDate).startOf("day");
                  }
                  let toDate = moment("3000-12-31").endOf("day");
                  if (values.toDate) {
                    toDate = moment(values.toDate).endOf("day");
                  }
                  return moment(row.sukuk.tradeDate).isBetween(fromDate, toDate, undefined, []);
                })
                .filter((row) => {
                  if (row.issueDate === "") {
                    return true;
                  }
                  let settlementFromDate = moment("1970-01-01").startOf("day");
                  if (values.settlementFromDate) {
                    settlementFromDate = moment(values.settlementFromDate).startOf("day");
                  }
                  let settlementToDate = moment("3000-12-31").endOf("day");
                  if (values.settlementToDate) {
                    settlementToDate = moment(values.settlementToDate).endOf("day");
                  }
                  return moment(row.sukuk.issueDate).isBetween(
                    settlementFromDate,
                    settlementToDate,
                    undefined,
                    []
                  );
                })
                .filter((row) => {
                  if (values.isin !== "" && row.sukuk.isin) {
                    return row.sukuk.isin.toLowerCase().search(values.isin.toLowerCase()) !== -1;
                  }
                  return true;
                })
                .filter((row) => {
                  if (values.wsn !== "" && row.sukuk.wsn) {
                    return row.sukuk.wsn.toLowerCase().search(values.wsn.toLowerCase()) !== -1;
                  }
                  return true;
                })
                .filter((row) => {
                  if (values.entityName !== "") {
                    return (
                      row.investorEntity.corporateEntityName
                        .toLowerCase()
                        .search(values.entityName.toLowerCase()) !== -1
                    );
                  }
                  return true;
                })
                .filter((row) => {
                  if (values.entityId !== "") {
                    return (
                      row.investorEntity.id.toLowerCase().search(values.entityId.toLowerCase()) !==
                      -1
                    );
                  }
                  return true;
                })
                .filter((row) => {
                  // Country
                  let isTrue = true;
                  if (values.issuerCountry.length === 0) {
                    isTrue = true;
                  } else {
                    const countryKeys = values.issuerCountry.map((country) => country.label);
                    if (row.sukuk.countryObject) {
                      isTrue = countryKeys.includes(row.sukuk.countryObject.name);
                    } else {
                      isTrue = false;
                    }
                  }
                  return isTrue;
                })
                .filter((row) => {
                  // Currency
                  let isTrue = true;
                  if (values.currency.length === 0) {
                    isTrue = true;
                  } else {
                    const currencyKeys = values.currency.map((currency) => currency.value);
                    isTrue = currencyKeys.includes(row.sukuk.currencyName.name);
                  }
                  return isTrue;
                })
                .map((row) => ({
                  ...row,
                  settlementStatus: t(`statuses:Settlement Status.${row.settlementStatus}`),
                  settlementType: t(`statuses:Settlement Type.${row.settlementType}`),
                  sukuk: {
                    ...row.sukuk,
                    profitRateTermsName: {
                      name: t(
                        `statuses:Profit Rate Terms.${row?.sukuk?.profitRateTermsName?.name}`
                      ),
                    },
                    frequencyName: {
                      name: t(`statuses:Frequency.${row?.sukuk?.frequencyName?.name}`),
                    },
                    securityStatus: t(`statuses:Security Status.${row?.sukuk?.securityStatus}`),
                    trade:
                      row.sukuk.trade.length === 0
                        ? []
                        : [
                            {
                              id: row?.sukuk?.trade[0].id,
                              status: t(`statuses:Trade Status.${row?.sukuk?.trade[0].status}`),
                              type: t(`statuses:Trade Type.${row?.sukuk?.trade[0].type}`),
                              direction: t(`statuses:Direction.${row?.sukuk?.trade[0].direction}`),
                            },
                          ],
                  },
                  readyToSettle: {
                    value: row.readyToSettle,
                    label: t(`statuses:Ready to Settle.${row.readyToSettle ? "Yes" : "No"}`),
                  },
                }));

              const calculateFilterCount = () => {
                let count = 0;
                if (values.fromDate !== null) {
                  count += 1;
                }
                if (values.toDate !== null) {
                  count += 1;
                }
                if (values.settlementFromDate !== null) {
                  count += 1;
                }
                if (values.settlementToDate !== null) {
                  count += 1;
                }
                if (values.isin !== "") {
                  count += 1;
                }
                if (values.wsn !== "") {
                  count += 1;
                }
                if (values.entityId !== "") {
                  count += 1;
                }
                if (values.entityName !== "") {
                  count += 1;
                }
                if (values.issuerCountry.length !== 0) {
                  count += 1;
                }
                if (values.currency.length !== 0) {
                  count += 1;
                }
                return count;
              };

              return (
                <Form>
                  <Box p={2} className={style.blotter__wrapper}>
                    <Grid
                      container
                      justifyContent="space-between"
                      className={style.blotter__card__header}
                    >
                      <Grid item xs={8} container direction="column">
                        {isNameBeingUpdated ? (
                          <Field
                            component={TextField}
                            className={style.accordian__input}
                            name="name"
                            variant="filled"
                            onBlur={() => {
                              setIsNameBeingUpdated(false);
                              submitForm();
                            }}
                          />
                        ) : (
                          <Typography variant="h6" className={style.blotter__card__header__title}>
                            {values.name}
                            <CreateIcon
                              fontSize="small"
                              className={style.blotter__card__header__icon}
                              onClick={() => {
                                setIsNameBeingUpdated(true);
                              }}
                            />
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={4} container justifyContent="flex-end">
                        <div>
                          <ButtonGroup
                            variant="outlined"
                            color="secondary"
                            ref={anchorRef}
                            aria-label="split button"
                          >
                            <Button
                              variant="outlined"
                              startIcon={<ViewColumnIcon />}
                              color="secondary"
                              onClick={() => selectDefaultColumns()}
                            >
                              {t("blotter:Manage Columns")}
                            </Button>
                            {/* <Button variant="outlined" color="secondary" size="small" aria-label="select merge strategy" aria-haspopup="menu" onClick={handleViewMenuToggle}>
                              <KeyboardArrowDownIcon />
                            </Button> */}
                          </ButtonGroup>
                          <Popper
                            open={openManageColumns}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            transition
                            disablePortal
                            className={style.groupedButton__popper}
                          >
                            {({ TransitionProps, placement }) => (
                              <Grow
                                {...TransitionProps}
                                style={{
                                  transformOrigin:
                                    placement === "bottom" ? "center top" : "center bottom",
                                }}
                              >
                                <Paper>
                                  <ClickAwayListener onClickAway={handlePresetColumnSelection}>
                                    <MenuList id="split-button-menu">
                                      {preSetColumns.map((option) => (
                                        <MenuItem
                                          key={option.key}
                                          onClick={(event) =>
                                            handlePresetColumnSelected(event, option)
                                          }
                                        >
                                          {t(`blotter:Presets.${option.name}`)}
                                        </MenuItem>
                                      ))}
                                    </MenuList>
                                  </ClickAwayListener>
                                </Paper>
                              </Grow>
                            )}
                          </Popper>
                        </div>
                        <Tooltip title={t("blotter:Delete Blotter")} aria-label="no delete">
                          <IconButton
                            aria-label="delete"
                            fontSize="large"
                            onClick={(e) => {
                              handleDelete(e, blotterId);
                            }}
                            size="large"
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    <Accordion defaultExpanded className={style.accordian__wrapper}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Grid container spacing={2} justifyContent="space-between">
                          <Grid item container xs={6} sm={6} md={7} lg={8} alignContent="center">
                            <FilterListIcon />
                            <Badge badgeContent={calculateFilterCount()} color="primary">
                              <Typography variant="body1" className={style.accordian__header}>
                                {t("blotter:Filters.Filters")}
                              </Typography>
                            </Badge>
                          </Grid>
                          <Grid item xs={6} sm={6} md={5} lg={4}>
                            <Field
                              className={style.input__field}
                              fullWidth
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              component={TextField}
                              onChange={(e) => {
                                onSearchChange(e.target.value);
                              }}
                              label={t("blotter:Search")}
                              name="searchText"
                              value={values.searchText}
                              variant="filled"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="clear search"
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        clearFilter("search");
                                      }}
                                    >
                                      <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box p={1}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={3} container>
                              <Grid container justifyContent="space-between">
                                <Grid
                                  item
                                  xs={9}
                                  container
                                  alignContent="center"
                                  justifyContent="flex-start"
                                >
                                  <Typography
                                    variant="body1"
                                    className="bold clickable"
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleDateRangePickerOpen}
                                  >
                                    {t("blotter:Filters.Trade Date")}
                                  </Typography>
                                  <KeyboardArrowDownIcon
                                    className="bold clickable"
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleDateRangePickerOpen}
                                  />
                                  <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleDateRangePickerClose}
                                  >
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("today");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Today")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("week");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Start of Week to Date")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("seven");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Last 7 Days")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("month");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Start of Month to Date")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("thirty");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Last 30 Days")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("quarter");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Start of Quarter to Date")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("year");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Start of Year to Date")}
                                    </MenuItem>
                                  </Menu>
                                </Grid>
                                <Grid item xs={3} container justifyContent="flex-end">
                                  <ButtonBase onClick={() => clearFilter("range")}>
                                    <Typography variant="caption">
                                      {t("blotter:Filters.Clear")}
                                    </Typography>
                                  </ButtonBase>
                                </Grid>
                              </Grid>
                              <Box my={1} className="w-full">
                                <Field
                                  fullWidth
                                  className={style.input__datepicker}
                                  format="DD/MM/YYYY"
                                  inputVariant="filled"
                                  inputProps={{
                                    shrink: "false",
                                  }}
                                  variant="inline"
                                  placeholder="DD/MM/YYYY"
                                  component={DatePicker}
                                  name="fromDate"
                                  label={t("blotter:Filters.Date Dropdown.From")}
                                  onBlur={() => {
                                    submitForm();
                                  }}
                                />
                              </Box>
                              <Box my={1} className="w-full">
                                <Field
                                  fullWidth
                                  className={style.input__datepicker}
                                  format="DD/MM/YYYY"
                                  inputVariant="filled"
                                  variant="inline"
                                  placeholder="DD/MM/YYYY"
                                  component={DatePicker}
                                  name="toDate"
                                  label={t("blotter:Filters.Date Dropdown.To")}
                                  onBlur={() => {
                                    submitForm();
                                  }}
                                />
                              </Box>
                            </Grid>

                            <Grid item xs={12} md={6} lg={3} container>
                              <Grid container justifyContent="space-between">
                                <Grid
                                  item
                                  xs={9}
                                  container
                                  alignContent="center"
                                  justifyContent="flex-start"
                                >
                                  <Typography
                                    variant="body1"
                                    className="bold clickable"
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleSettlementDateRangePickerOpen}
                                  >
                                    {t("blotter:Filters.Settlement Date")}
                                  </Typography>
                                  <KeyboardArrowDownIcon
                                    className="bold clickable"
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleSettlementDateRangePickerOpen}
                                  />
                                  <Menu
                                    id="settlement-menu"
                                    anchorEl={settlementAnchorEl}
                                    keepMounted
                                    open={Boolean(settlementAnchorEl)}
                                    onClose={handleSettlementDateRangePickerClose}
                                  >
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("today", "settlement");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Today")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("week", "settlement");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Start of Week to Date")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("seven", "settlement");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Last 7 Days")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("month", "settlement");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Start of Month to Date")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("thirty", "settlement");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Last 30 Days")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("quarter", "settlement");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Start of Quarter to Date")}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setDateRange("year", "settlement");
                                      }}
                                    >
                                      {t("blotter:Filters.Date Dropdown.Start of Year to Date")}
                                    </MenuItem>
                                  </Menu>
                                </Grid>
                                <Grid item xs={3} container justifyContent="flex-end">
                                  <ButtonBase onClick={() => clearFilter("settlementRange")}>
                                    <Typography variant="caption">
                                      {t("blotter:Filters.Clear")}
                                    </Typography>
                                  </ButtonBase>
                                </Grid>
                              </Grid>
                              <Box my={1} className="w-full">
                                <Field
                                  fullWidth
                                  className={style.input__datepicker}
                                  format="DD/MM/YYYY"
                                  inputVariant="filled"
                                  inputProps={{
                                    shrink: "false",
                                  }}
                                  variant="inline"
                                  placeholder="DD/MM/YYYY"
                                  component={DatePicker}
                                  name="settlementFromDate"
                                  label={t("blotter:Filters.Date Dropdown.From")}
                                  onBlur={() => {
                                    submitForm();
                                  }}
                                />
                              </Box>
                              <Box my={1} className="w-full">
                                <Field
                                  fullWidth
                                  className={style.input__datepicker}
                                  format="DD/MM/YYYY"
                                  inputVariant="filled"
                                  variant="inline"
                                  placeholder="DD/MM/YYYY"
                                  component={DatePicker}
                                  name="settlementToDate"
                                  label={t("blotter:Filters.Date Dropdown.To")}
                                  onBlur={() => {
                                    submitForm();
                                  }}
                                />
                              </Box>
                            </Grid>

                            <Grid item xs={12} md={6} lg={3} container>
                              <Grid container justifyContent="space-between">
                                <Typography variant="body1" className="bold">
                                  {t("blotter:Filters.Security ID")}
                                </Typography>
                                <ButtonBase onClick={() => clearFilter("security")}>
                                  <Typography variant="caption">
                                    {t("blotter:Filters.Clear")}
                                  </Typography>
                                </ButtonBase>
                              </Grid>
                              <Box my={1} className="w-full">
                                <Field
                                  className={style.input__field}
                                  fullWidth
                                  component={TextField}
                                  label={t("blotter:Filters.ISIN")}
                                  name="isin"
                                  variant="filled"
                                  onBlur={() => {
                                    submitForm();
                                  }}
                                />
                              </Box>
                              <Box my={1} className="w-full">
                                <Field
                                  className={style.input__field}
                                  fullWidth
                                  component={TextField}
                                  label={t("blotter:Filters.WSN")}
                                  name="wsn"
                                  variant="filled"
                                  onBlur={() => {
                                    submitForm();
                                  }}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3} container>
                              <Grid container justifyContent="space-between">
                                <Typography variant="body1" className="bold">
                                  {t("blotter:Filters.Entity")}
                                </Typography>
                                <ButtonBase onClick={() => clearFilter("entity")}>
                                  <Typography variant="caption">
                                    {t("blotter:Filters.Clear")}
                                  </Typography>
                                </ButtonBase>
                              </Grid>
                              <Box my={1} className="w-full">
                                <Field
                                  key="entityName"
                                  className={style.input__field}
                                  fullWidth
                                  component={TextField}
                                  label={t("blotter:Filters.Name")}
                                  name="entityName"
                                  variant="filled"
                                  onBlur={() => {
                                    submitForm();
                                  }}
                                />
                              </Box>
                              <Box my={1} className="w-full">
                                <Field
                                  className={style.input__field}
                                  fullWidth
                                  component={TextField}
                                  label={t("blotter:Filters.ID")}
                                  name="entityId"
                                  variant="filled"
                                  onBlur={() => {
                                    submitForm();
                                  }}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3} container>
                              <Grid container justifyContent="space-between">
                                <Typography variant="body1" className="bold">
                                  {t("blotter:Filters.Country")}
                                </Typography>
                                <ButtonBase onClick={() => clearFilter("country")}>
                                  <Typography variant="caption">
                                    {t("blotter:Filters.Clear")}
                                  </Typography>
                                </ButtonBase>
                              </Grid>
                              <Box my={1} className="w-full">
                                <FormControl className={style.input__form_control}>
                                  <Select
                                    closeMenuOnSelect
                                    placeholder={`${t("blotter:Filters.Country")}...`}
                                    // isDisabled={filteredCountry.length===0}
                                    isSearchable
                                    components={{
                                      ...animatedComponents,
                                      // eslint-disable-next-line react/prop-types
                                      MultiValueContainer: ({ data }) => (
                                        <Chip
                                          // eslint-disable-next-line react/prop-types
                                          key={data.value}
                                          // eslint-disable-next-line react/prop-types
                                          label={data.value}
                                          className={style.input__chips__chip}
                                          // eslint-disable-next-line react/prop-types
                                          onDelete={(e) =>
                                            handleRemoveCountrySelection(e, data.value)
                                          }
                                          color="secondary"
                                        />
                                      ),
                                    }}
                                    styles={{
                                      menu: (styles) => ({
                                        ...styles,
                                        zIndex: 10,
                                      }),
                                      control: (styles) => ({
                                        ...styles,
                                        border: "none",
                                        borderRadius: "6px",
                                        backgroundColor: "rgba(0, 0, 0, 0.09)",
                                        height: "3rem",
                                      }),
                                    }}
                                    value={values.issuerCountry}
                                    isMulti
                                    options={filteredCountry}
                                    onChange={(issuerCountry) => {
                                      setFieldValue("issuerCountry", issuerCountry, false);
                                      submitForm();
                                    }}
                                  />
                                </FormControl>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3} container>
                              <Grid container justifyContent="space-between">
                                <Typography variant="body1" className="bold">
                                  {t("blotter:Filters.Currency")}
                                </Typography>
                                <ButtonBase onClick={() => clearFilter("currency")}>
                                  <Typography variant="caption">
                                    {t("blotter:Filters.Clear")}
                                  </Typography>
                                </ButtonBase>
                              </Grid>
                              <Box my={1} className="w-full">
                                <FormControl className={style.input__form_control}>
                                  <Select
                                    closeMenuOnSelect
                                    isSearchable
                                    placeholder={`${t("blotter:Filters.Currency")}...`}
                                    components={{
                                      ...animatedComponents,
                                      // eslint-disable-next-line react/prop-types
                                      MultiValueContainer: ({ data }) => (
                                        <Chip
                                          // eslint-disable-next-line react/prop-types
                                          key={data.value}
                                          // eslint-disable-next-line react/prop-types
                                          label={data.value}
                                          className={style.input__chips__chip}
                                          // eslint-disable-next-line react/prop-types
                                          onDelete={(e) =>
                                            handleRemoveCurrencySelection(e, data.value)
                                          }
                                          color="secondary"
                                        />
                                      ),
                                    }}
                                    styles={{
                                      menu: (styles) => ({
                                        ...styles,
                                        zIndex: 10,
                                      }),
                                      control: (styles) => ({
                                        ...styles,
                                        border: "none",
                                        borderRadius: "6px",
                                        backgroundColor: "rgba(0, 0, 0, 0.09)",
                                        height: "3rem",
                                      }),
                                    }}
                                    value={values.currency}
                                    isMulti
                                    options={filteredCurrency}
                                    onChange={(currency) => {
                                      setFieldValue("currency", currency, false);
                                      submitForm();
                                    }}
                                  />
                                </FormControl>
                              </Box>
                            </Grid>
                          </Grid>
                          <br />
                          <Grid container justifyContent="flex-end">
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<CloudDownloadIcon />}
                              onClick={() => exportToFile()}
                            >
                              {t("blotter:Filters.Export Blotter")}
                            </Button>
                          </Grid>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <MaterialTable
                      size="small"
                      title=""
                      style={{
                        boxShadow: "none",
                      }}
                      tableRef={blotterRef}
                      columns={columnDefinitions}
                      data={filteredData}
                      onChangeRowsPerPage={(colNumber) => {
                        setFieldValue("shownRows", colNumber, false);
                        setTimeout(() => {
                          submitForm();
                        }, 1000);
                      }}
                      components={{
                        Toolbar: (props) => {
                          toolbarProps = props;
                          return <Fragment />;
                        },
                      }}
                      options={{
                        tableLayout: "fixed",
                        search: false,
                        pageSize: values.shownRows,
                        // actionsColumnIndex: -1,
                        headerStyle: {
                          color: "#23389c",
                          padding: "2px 2px",
                          fontWeight: "700",
                          border: "1px solid #cfd8dc",
                        },
                        rowStyle: {
                          color: "#23389c",
                          padding: "2px 2px",
                        },
                        fixedColumns: {
                          left: 0,
                        },
                        draggable: false,
                      }}
                      localization={mtableLocalization}
                    />
                    <MaterialTableOverflowMenu
                      actions={actions}
                      anchorEl={menuAnchorEl}
                      setAnchorEl={setMenuAnchorEl}
                      selectedRow={selectedTrade}
                    />
                  </Box>
                  <Dialog
                    fullWidth
                    maxWidth="md"
                    open={columnModalOpen}
                    onClose={() => setColumnModalOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {t("blotter:Manage Columns Dialogue.Manage Columns")}
                    </DialogTitle>
                    <DialogContent>
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Grid container justifyContent="space-between">
                          <Grid item xs={5}>
                            <Grid container justifyContent="space-between" alignContent="center">
                              <Grid
                                item
                                xs={6}
                                container
                                justifyContent="flex-start"
                                alignContent="center"
                              >
                                <Typography variant="body1" align="left">
                                  {t("blotter:Manage Columns Dialogue.Hidden Columns")}
                                </Typography>
                              </Grid>
                              <Tooltip
                                title={t("blotter:Manage Columns Dialogue.Move all Hidden Columns")}
                                placement="top"
                                aria-label="move hidden"
                              >
                                <IconButton
                                  aria-label="move columns"
                                  onClick={() => {
                                    moveHiddenColumns();
                                  }}
                                  size="large"
                                >
                                  <ArrowForwardIcon color="secondary" fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Droppable droppableId="hidden">
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  className={cx(
                                    style.columnManager__list,
                                    getListStyle(snapshot.isDraggingOver)
                                  )}
                                >
                                  {values.hiddenColumns
                                    .filter(
                                      (column) => !entityTypeFilteredColumns.includes(column.field)
                                    )
                                    .map((item, index) => (
                                      <Draggable
                                        key={`${item.field}-${item.title}}`}
                                        draggableId={`${item.field}-${item.title}}`}
                                        index={index}
                                      >
                                        {(currentProvided, currentSnapshot) => (
                                          <div
                                            ref={currentProvided.innerRef}
                                            {...currentProvided.draggableProps}
                                            {...currentProvided.dragHandleProps}
                                            style={{ ...currentProvided.draggableProps.style }}
                                            className={cx(
                                              style.columnManager__column,
                                              style["columnManager__column--hidden"],
                                              getItemStyle(currentSnapshot.isDragging)
                                            )}
                                          >
                                            {t(`blotter:Columns.${item.title}`)}
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            container
                            justifyContent="center"
                            alignContent="flex-start"
                          >
                            <div className={style.columnManager__swap__wrapper}>
                              <IconButton
                                aria-label="swap column selection"
                                disableRipple
                                disableFocusRipple
                                onClick={() => {
                                  swapColumns();
                                }}
                                size="large"
                              >
                                <Tooltip
                                  title={t("blotter:Manage Columns Dialogue.Swap all Columns")}
                                  placement="top"
                                  aria-label="swap columns"
                                >
                                  <SwapHorizontalCircleIcon
                                    color="primary"
                                    fontSize="large"
                                    className={style.columnManager__swap__icon}
                                  />
                                </Tooltip>
                              </IconButton>
                            </div>
                          </Grid>
                          <Grid item xs={5}>
                            <Grid container justifyContent="space-between" alignContent="center">
                              <Tooltip
                                title={t("blotter:Manage Columns Dialogue.Move all Shown Columns")}
                                placement="top"
                                aria-label="move shown"
                              >
                                <IconButton
                                  aria-label="move columns"
                                  onClick={() => {
                                    moveShownColumns();
                                  }}
                                  size="large"
                                >
                                  <ArrowBackIcon color="secondary" fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Grid
                                item
                                xs={6}
                                container
                                justifyContent="flex-end"
                                alignContent="center"
                              >
                                <Typography variant="body1" align="right">
                                  {t("blotter:Manage Columns Dialogue.Displayed Columns")}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Droppable droppableId="shown">
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  className={cx(
                                    style.columnManager__list,
                                    getListStyle(snapshot.isDraggingOver)
                                  )}
                                >
                                  {values.shownColumns
                                    .filter(
                                      (column) => !entityTypeFilteredColumns.includes(column.field)
                                    )
                                    .map((item, index) => (
                                      <Draggable
                                        key={`${item.field}-${item.title}}`}
                                        draggableId={`${item.field}-${item.title}}`}
                                        index={index}
                                      >
                                        {(currentProvided, currentSnapshot) => (
                                          <div
                                            ref={currentProvided.innerRef}
                                            {...currentProvided.draggableProps}
                                            {...currentProvided.dragHandleProps}
                                            style={{ ...currentProvided.draggableProps.style }}
                                            className={cx(
                                              style.columnManager__column,
                                              style["columnManager__column--shown"],
                                              getItemStyle(currentSnapshot.isDragging)
                                            )}
                                          >
                                            {t(`blotter:Columns.${item.title}`)}
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </Grid>
                        </Grid>
                      </DragDropContext>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setColumnModalOpen(false)} color="primary">
                        {t("blotter:Manage Columns Dialogue.Cancel")}
                      </Button>
                      <Button
                        onClick={() => {
                          submitForm();
                          setColumnModalOpen(false);
                        }}
                        variant="contained"
                        color="primary"
                      >
                        {t("blotter:Manage Columns Dialogue.Confirm Columns")}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Form>
              );
            }}
          </Formik>
        </MuiPickersUtilsProvider>
      </Card>
      {selectedInvestor.investorEntity ? (
        <Dialog
          open={openDialogue}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t("blotter:Settle Payment Dialogue.Settle payments for", {
              name: selectedInvestor.investorEntity.corporateEntityName,
            })}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("blotter:Settle Payment Dialogue.This action will transfer the amount of", {
                netSettleAmount: new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: selectedInvestor.sukuk.currencyName.name,
                  // minimumFractionDigits: 0
                }).format(selectedInvestor.netSettleAmount),
                numOfCertificates: selectedInvestor.numOfCertificates,
                sukukName: selectedInvestor.sukuk.name,
                count: selectedInvestor.numOfCertificates,
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t("blotter:Settle Payment Dialogue.Cancel")}
            </Button>
            <Button onClick={settleAmount} variant="contained" color="primary" autoFocus>
              {t("blotter:Settle Payment Dialogue.Proceed")}
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        ""
      )}
      {selectedInvestor.investorEntity ? (
        <Dialog
          open={openApproveDialogue}
          onClose={handleApproveClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t("blotter:Approve Payment Dialogue.Approve trade for", {
              name: selectedInvestor.investorEntity.corporateEntityName,
            })}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("blotter:Approve Payment Dialogue.This action will approve the amount of", {
                netSettleAmount: new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: selectedInvestor.sukuk.currencyName.name,
                  // minimumFractionDigits: 0
                }).format(selectedInvestor.netSettleAmount),
                numOfCertificates: selectedInvestor.numOfCertificates,
                sukukName: selectedInvestor.sukuk.name,
                count: selectedInvestor.numOfCertificates,
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleApproveClose} color="primary">
              {t("blotter:Approve Payment Dialogue.Cancel")}
            </Button>
            <Button onClick={approveAmount} variant="contained" color="primary" autoFocus>
              {t("blotter:Approve Payment Dialogue.Proceed")}
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        ""
      )}
    </Fragment>
  );
};

Blotter.propTypes = {
  updateSingleBlotter: PropTypes.func.isRequired,
  deleteSingleBlotter: PropTypes.func.isRequired,
  keyedData: PropTypes.arrayOf(PropTypes.object),
  parameters: PropTypes.shape({
    name: PropTypes.string,
    filters: PropTypes.object,
    search: PropTypes.string,
    manualColumnMove: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.string]),
  }),
  blotterId: PropTypes.string,
  blotterDropdowns: PropTypes.shape({
    currency: PropTypes.array,
    country: PropTypes.array,
  }),
  settleTrade: PropTypes.func.isRequired,
  currentEntityGroup: PropTypes.shape({
    id: PropTypes.string,
    entityType: PropTypes.string,
    accessControls: PropTypes.array,
  }).isRequired,
};

Blotter.defaultProps = {
  keyedData: [],
  parameters: {
    manualColumnMove: [],
  },
  blotterId: "",
  blotterDropdowns: {
    currency: [],
    country: [],
  },
};

export default Blotter;
