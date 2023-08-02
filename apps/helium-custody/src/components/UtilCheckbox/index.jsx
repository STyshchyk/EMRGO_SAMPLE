import { mdiCheck, mdiCropSquare } from "@mdi/js";
import Icon from "@mdi/react";
import cx from "classnames";
import PropTypes from "prop-types";

import style from "./style.module.scss";

const CustomCheckboxIcon = ({ checked, handleClick }) => {
  if (checked) {
    return (
      <Icon
        className={cx(
          style["checkbox-container__custom-checkbox"],
          style["checkbox-container__custom-checkbox--complete"]
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
        style["checkbox-container__custom-checkbox--incomplete"]
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
};

const UtilCheckbox = ({ name, onClick, label, readOnly, checked }) => (
  <div className={cx(style["checkbox-container"])}>
    <label className={cx(style["checkbox-container__label"])} htmlFor={name}>
      {label}
    </label>
    <input
      disabled={readOnly}
      className={style["checkbox-container__default-checkbox"]}
      id={name}
      type="checkbox"
    />
    <CustomCheckboxIcon
      checked={checked}
      handleClick={() => {
        if (readOnly) return;
        onClick(!checked);
      }}
    />
  </div>
);

UtilCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

UtilCheckbox.defaultProps = {
  readOnly: false,
};

export default UtilCheckbox;
