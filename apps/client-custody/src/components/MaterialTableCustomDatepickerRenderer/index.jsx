import MomentUtils from "@date-io/moment";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import PropTypes from "prop-types";

const MaterialTableCustomDatepickerRenderer = (props) => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <KeyboardDatePicker
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
  </MuiPickersUtilsProvider>
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
