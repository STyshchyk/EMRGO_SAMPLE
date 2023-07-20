import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import MomentUtils from "@date-io/moment";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useFilters } from "context/filter-context";

const DatePicker = ({ name, defaultFilter, label, ...props }) => {
  const [pickerValue, setPickerValue] = useState(defaultFilter);
  const filterContext = useFilters();
  const { setFilterValue } = filterContext;
  const { t } = useTranslation(["miscellaneous"]);

  const updateDatePickerValues = (updatedPickerValues) => {
    setPickerValue(updatedPickerValues);
    setFilterValue(updatedPickerValues, name, label, "date");
  };

  const clearDatepickerValue = () => {
    const updatedPickerValues = {
      startDate: null,
      endDate: null,
    };
    updateDatePickerValues(updatedPickerValues);
    setFilterValue(defaultFilter, name, label, "date");
  };

  useEffect(() => {
    if (defaultFilter) {
      setFilterValue(defaultFilter, name, label, "date");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid container justifyContent="space-between">
        <Grid item xs={9} container alignContent="center" justifyContent="flex-start">
          <Typography variant="body1" className="bold" aria-haspopup="true">
            {label}
          </Typography>
        </Grid>
        <Grid item xs={3} container justifyContent="flex-end">
          <ButtonBase
            onClick={() => {
              clearDatepickerValue();
            }}
          >
            <Typography variant="caption">{t("miscellaneous:Clear")}</Typography>
          </ButtonBase>
        </Grid>
      </Grid>

      <Box my={1} className="full-width">
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            fullWidth
            format="DD/MM/yyyy"
            inputVariant="filled"
            inputProps={{
              shrink: "false",
            }}
            {...props}
            variant="dialog"
            showTodayButton
            placeholder="DD/MM/YYYY"
            value={pickerValue}
            name="date"
            label={t("miscellaneous:Filters.Date")}
            onChange={(selectedDate) => {
              updateDatePickerValues(selectedDate.endOf("day"));
            }}
          />
        </MuiPickersUtilsProvider>
      </Box>
    </>
  );
};

export default DatePicker;
