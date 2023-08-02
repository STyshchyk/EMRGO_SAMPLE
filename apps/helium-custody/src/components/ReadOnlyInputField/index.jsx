import PropTypes from "prop-types";

import style from "./style.module.scss";

const ReadOnlyInputField = ({ label, value, error, name }) => (
  <div className={style.container}>
    <div className={style["input-group"]}>
      {label !== null ? (
        <label className={style["input-group__label"]} htmlFor={name}>
          {label}
        </label>
      ) : null}
      <input className={style["input-group__field"]} disabled value={value} id={name} />
    </div>
    {error ? <div className={style["input-group__error"]}>{error}</div> : null}
  </div>
);

ReadOnlyInputField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
  name: PropTypes.string,
};

ReadOnlyInputField.defaultProps = {
  label: null,
  value: "TBD",
  error: null,
  name: "name",
};

export default ReadOnlyInputField;
