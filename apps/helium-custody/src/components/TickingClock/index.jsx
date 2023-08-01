import moment from "moment";
import PropTypes from "prop-types";

import useTime from "../../hooks/useTime";

// import '../../constants/locales/moment';

import "moment/locale/ru";
import "moment/locale/ar";
import "moment/locale/en-gb";

const TickingClock = ({ format, lang }) => {
  const now = useTime();
  const formattedDate = moment(now).locale(lang).format(format);

  return (
    <strong
      style={{
        fontSize: "0.85em",
        color: "#2e373d",
      }}
      data-testid="clock"
    >
      {formattedDate}
    </strong>
  );
};

TickingClock.propTypes = {
  format: PropTypes.string, // https://momentjs.com/docs/#/parsing/string-format/
};

TickingClock.defaultProps = {
  format: "YYYY-MM-DDTHH:mm:ss",
};

export default TickingClock;
