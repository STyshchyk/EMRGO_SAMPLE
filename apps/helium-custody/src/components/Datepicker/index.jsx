// import "react-dates/initialize";

import { adaptV4Theme, createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import cx from "classnames";
import { useField } from "formik";
import moment from "moment";
import PropTypes from "prop-types";

import Required from "../Required";
import style from "./style.module.scss";

// KeyboardDatePicker API reference: https://material-ui-pickers.dev/api/KeyboardDatePicker

const muiTheme = createTheme(
  adaptV4Theme({
    overrides: {
      MuiInputBase: {
        input: {
          color: "#23389c",
          border: "none",
        },
      },
      MuiPickersToolbar: {
        toolbar: {
          backgroundColor: "#23389c",
        },
      },
      MuiPickersDay: {
        day: {
          color: "#23389c",
        },
        daySelected: {
          backgroundColor: "#23389c",
        },
        dayDisabled: {
          color: lightBlue["100"],
        },
      },
      MuiPickersModal: {
        dialogAction: {
          color: lightBlue["400"],
        },
      },
    },
  })
);

const Datepicker = (props) => {
  const {
    name,
    label,
    disabled,
    disableLabel,
    align,
    customClassName,
    minDate,
    format,
    animateYearScrolling,
    maxDate,
    disableFuture,
    disablePast,
    fullWidth,
    materialLabel,
    minDateMessage,
    isRequired,
  } = props;
  const [field, , helpers] = useField(props);
  // const [selectedDate, handleDateChange] = useState(new Date());
  // const currentError = meta?.error;

  const handleDateChange = (date) => {
    helpers.setValue(date);
  };

  // * FIXME: This doesn't play nicely with Formik lib
  /*
  const handleError = (error) => {
    if (error !== currentError) {
      helpers.setError(error);
    }
  };
  */

  return (
    <div className={style.container}>
      <div
        className={cx(
          materialLabel || style["input-group"],
          "datepicker-condensed",
          align === "left" ? "datepicker-left" : "datepicker-center",
          customClassName
        )}
      >
        {label == null || materialLabel ? (
          ""
        ) : (
          <label
            className={cx(style["input-group__label"], {
              [style["input-group__label--hidden"]]: disableLabel,
            })}
            htmlFor={name}
          >
            {label}
            {isRequired && <Required />}
          </label>
        )}
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={muiTheme}>
            <div
              style={{
                background: "#e6e6e6",
                width: fullWidth ? "100%" : "250px",
                borderRadius: "13px",
                padding: "0.5em",
              }}
            >
              <DatePicker
                disabled={disabled}
                clearable
                sx={{
                  width: fullWidth ? "100%" : "",
                }}
                name={field.name}
                value={field?.value ? moment(field?.value) : undefined}
                onChange={handleDateChange}
                format={format}
                animateYearScrolling={animateYearScrolling}
                minDate={minDate ? moment(minDate) : undefined}
                minDateMessage={minDateMessage ?? "Date should not be before minimal date"}
                maxDate={maxDate}
                label={materialLabel ? label : ""}
                disablePast={disablePast}
                disableFuture={disableFuture}
                inputVariant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </ThemeProvider>
        </StyledEngineProvider>
      </div>
    </div>
  );
};

Datepicker.propTypes = {
  align: PropTypes.string,
  customClassName: PropTypes.string,
  disabled: PropTypes.bool,
  disableLabel: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  format: PropTypes.string,
  animateYearScrolling: PropTypes.bool,
  disablePast: PropTypes.bool,
  disableFuture: PropTypes.bool,
  fullWidth: PropTypes.bool,
  materialLabel: PropTypes.bool,
};

Datepicker.defaultProps = {
  align: "left",
  customClassName: "",
  disabled: false,
  disableLabel: false,
  minDate: undefined,
  maxDate: undefined,
  format: "DD/MM/YYYY",
  animateYearScrolling: true,
  disablePast: false,
  disableFuture: false,
  fullWidth: false,
  materialLabel: false,
};

export default Datepicker;
