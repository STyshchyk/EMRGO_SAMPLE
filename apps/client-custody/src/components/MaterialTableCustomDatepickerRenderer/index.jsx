import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PropTypes from "prop-types";

const MaterialTableCustomDatepickerRenderer = (props) => (
  <DatePicker
    disableToolbar
    variant="inline"
    format="DD/MM/yyyy"
    autoOk
    // minDate={moment()}
    // margin="normal"
    label={props.label}
    value={props.value}
    inputVariant="filled"
    onChange={(selected) => {
      props.onChange(selected);
    }}
    KeyboardButtonProps={{
      "aria-label": "change date",
    }}
    {...props}
  />
);

MaterialTableCustomDatepickerRenderer.propTypes = {
  options: [
    {
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      meta: {},
    },
  ],
};

export default MaterialTableCustomDatepickerRenderer;
