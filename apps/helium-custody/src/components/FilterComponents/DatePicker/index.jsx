import { useTranslation } from 'react-i18next';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import moment from 'moment';

import { useFilters } from '../../../context/filter-context';

const DatePicker = ({ name, label, dateFilterValue, setDateFilterValue }) => {
  const { t } = useTranslation(["reports"]);

  const filterContext = useFilters();
  const { setFilterValue, clearFilterValue } = filterContext;

  const clearFilter = () => {
    // get filters and then filter out the object with name prooperty
    // const result = Object.fromEntries(Object.entries(filters).filter(([key]) => key !== name));
    // setFilters(result);
    clearFilterValue(name);
  };

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
              clearFilter("date");
            }}
          >
            <Typography variant="caption">{t("blotter:Filters.Clear")}</Typography>
          </ButtonBase>
        </Grid>
      </Grid>

      <Box my={1} className="w-full">
          <DatePicker
            fullWidth
            format="DD/MM/YYYY"
            inputVariant="outlined"
            inputProps={{
              shrink: "false",
            }}
            variant="dialog"
            showTodayButton
            placeholder="DD/MM/YYYY"
            maxDate={moment()}
            value={dateFilterValue}
            name="date"
            label={label}
            onChange={(selectedDate) => {
              setDateFilterValue(selectedDate.startOf("day"));
              setFilterValue(selectedDate.startOf("day"), name, label, "date");
            }}
          />
      </Box>
    </>
  );
};

export default DatePicker;
