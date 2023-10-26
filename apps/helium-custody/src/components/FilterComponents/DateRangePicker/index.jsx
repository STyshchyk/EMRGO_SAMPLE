import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, ButtonBase } from "@mui/material";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import { useFilters } from "../../../context/filter-context";
import findDateRange from "../../../helpers/dates";

const DateRangePicker = ({
  name,
  label,
  defaultFilter,
  setEndDateValue,
  setStartDateValue,
  minDate,
  maxDate,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { defaultStartDate, defaultEndDate } = findDateRange(defaultFilter);
  const [pickerValues, setPickerValues] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });
  const { t } = useTranslation(["reports", "miscellaneous"]);
  const filterContext = useFilters();
  const { setFilterValue, clearFilterValue } = filterContext;

  useEffect(() => {
    if (defaultFilter !== "none") {
      const defaultFilters = findDateRange(defaultFilter);
      const updatedPickerValues = {
        startDate: defaultFilters.defaultStartDate,
        endDate: defaultFilters.defaultEndDate,
      };
      setPickerValues(updatedPickerValues);
      setFilterValue(updatedPickerValues, name, label, "daterange");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateRangePickerClose = () => {
    setAnchorEl(null);
  };

  const handleDateRangePickerOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const updateDatePickerValues = (updatedPickerValues) => {
    setPickerValues(updatedPickerValues);
    setFilterValue(updatedPickerValues, name, label, "daterange");
  };

  const setDateRange = (type) => {
    const { defaultStartDate: startDate, defaultEndDate: endDate } = findDateRange(type);

    const updatedPickerValues = {
      startDate,
      endDate,
    };
    updateDatePickerValues(updatedPickerValues);
    handleDateRangePickerClose();
    // submitForm();
  };

  const saveDatepickerValues = () => {
    updateDatePickerValues(pickerValues);
  };

  const clearDatepickerValues = () => {
    const updatedPickerValues = {
      startDate: null,
      endDate: null,
    };
    setPickerValues(updatedPickerValues);
    clearFilterValue(name);
    setStartDateValue(null);
    setEndDateValue(null);
  };

  return (
    <Box>
      <Grid container justifyContent="space-between">
        <Grid item xs={9} container alignContent="center" justifyContent="flex-start">
          <Typography
            variant="body1"
            className="bold clickable"
            aria-haspopup="true"
            onClick={handleDateRangePickerOpen}
          >
            {label}
          </Typography>
          <KeyboardArrowDownIcon
            className="bold clickable"
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
              {t("miscellaneous:Filters.Date Dropdown.Today")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDateRange("week");
              }}
            >
              {t("miscellaneous:Filters.Date Dropdown.Start of Week to Date")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDateRange("seven");
              }}
            >
              {t("miscellaneous:Filters.Date Dropdown.Last 7 Days")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDateRange("month");
              }}
            >
              {t("miscellaneous:Filters.Date Dropdown.Start of Month to Date")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDateRange("thirty");
              }}
            >
              {t("miscellaneous:Filters.Date Dropdown.Last 30 Days")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDateRange("quarter");
              }}
            >
              {t("miscellaneous:Filters.Date Dropdown.Start of Quarter to Date")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDateRange("year");
              }}
            >
              {t("miscellaneous:Filters.Date Dropdown.Start of Year to Date")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDateRange("all");
              }}
            >
              {t("miscellaneous:Filters.Date Dropdown.All")}
            </MenuItem>
          </Menu>
        </Grid>

        <Grid item xs={3} container justifyContent="flex-end">
          <ButtonBase onClick={() => clearDatepickerValues()}>
            <Typography variant="caption">{t("miscellaneous:Clear")}</Typography>
          </ButtonBase>
        </Grid>
      </Grid>

      <Box my={1} sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
            <DatePicker
              sx={{ width: "100%" }}
              //   className={style.input__datepicker}
              format="DD/MM/YYYY"
              inputVariant="filled"
              inputProps={{
                shrink: "false",
                size: "small",
              }}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
              variant="dialog"
              showTodayButton
              minDate={minDate}
              maxDate={pickerValues.endDate ?? moment()}
              placeholder="DD/MM/YYYY"
              name="startDate"
              value={pickerValues.startDate ?? null}
              label={t("miscellaneous:Filters.Date Dropdown.From")}
              onChange={(selectedDate) => {
                const updatedPickerValues = {
                  startDate: selectedDate.startOf("day"),
                  endDate: pickerValues.endDate ?? null,
                };
                updateDatePickerValues(updatedPickerValues);

                setStartDateValue(selectedDate.startOf("day"));
                setEndDateValue(pickerValues.endDate ?? null);

                // setFieldValue('startDate', selectedDate.startOf('day'), false);
              }}
              onBlur={() => {
                saveDatepickerValues();
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <DatePicker
              sx={{ width: "100%" }}
              //   className={style.input__datepicker}
              format="DD/MM/YYYY"
              inputVariant="filled"
              variant="dialog"
              showTodayButton
              minDate={pickerValues.startDate ?? moment()}
              maxDate={maxDate}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
              placeholder="DD/MM/YYYY"
              name="endDate"
              value={pickerValues.endDate ?? null}
              label={t("miscellaneous:Filters.Date Dropdown.To")}
              onChange={(selectedDate) => {
                const updatedPickerValues = {
                  startDate: pickerValues.startDate ?? null,
                  endDate: selectedDate.endOf("day"),
                };
                updateDatePickerValues(updatedPickerValues);

                setEndDateValue(selectedDate.endOf("day"));
                setStartDateValue(pickerValues.startDate ?? null);

                // setFieldValue('endDate', selectedDate.endOf('day'), false);
              }}
              onBlur={() => {
                saveDatepickerValues();
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DateRangePicker;

DateRangePicker.defaultProps = {
  setStartDateValue: () => {},
  setEndDateValue: () => {},
};
