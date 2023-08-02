import { mdiCheck, mdiCropSquare } from "@mdi/js";
import Icon from "@mdi/react";
import cx from "classnames";
import { useField } from "formik";
import PropTypes from "prop-types";

import style from "./style.module.scss";

const CustomCheckboxIcon = ({ checked, handleClick, readOnly }) => {
  if (checked) {
    return (
      <Icon
        className={cx(
          style["checkbox-container__custom-checkbox"],
          readOnly
            ? style["checkbox-container__custom-checkbox--readonly"]
            : style["checkbox-container__custom-checkbox--complete"]
        )}
        onClick={handleClick}
        size={1.2}
        path={mdiCheck}
        title="Checked"
      />
    );
  }

  return (
    <Icon
      className={cx(
        style["checkbox-container__custom-checkbox"],
        readOnly
          ? style["checkbox-container__custom-checkbox--readonly"]
          : style["checkbox-container__custom-checkbox--incomplete"]
      )}
      onClick={handleClick}
      path={mdiCropSquare}
      size={1.2}
      title="Unchecked"
    />
  );
};

CustomCheckboxIcon.propTypes = {
  checked: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

CustomCheckboxIcon.defaultProps = {
  readOnly: false,
};

const Checkbox = (props) => {
  const { name, label, readOnly, changeCallback, className } = props;
  const [field, , helpers] = useField(props);
  const { value, ...rest } = field;
  return (
    <div className={cx(style["checkbox-container"], className)}>
      <label className={cx(style["checkbox-container__label"])} htmlFor={name}>
        {label}
      </label>
      <input
        disabled={readOnly}
        value={!!field.value}
        className={style["checkbox-container__default-checkbox"]}
        id={name}
        type="checkbox"
        {...rest}
      />
      <CustomCheckboxIcon
        checked={!!field.value}
        readOnly={readOnly}
        handleClick={() => {
          if (readOnly) return;
          changeCallback(!field.value, name);
          helpers.setValue(!field.value);
        }}
      />
    </div>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  changeCallback: PropTypes.func,
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  readOnly: false,
  changeCallback: () => {},
  className: "",
};

export default Checkbox;
