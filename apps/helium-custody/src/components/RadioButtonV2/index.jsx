import {
  mdiCheckboxBlankOutline,
  mdiCheckboxIntermediate,
  mdiRadioboxBlank,
  mdiRadioboxMarked,
} from "@mdi/js";
import Icon from "@mdi/react";
import cx from "classnames";
import { Field } from "formik";
import PropTypes from "prop-types";

import style from "./style.module.scss";

const CustomRadioButton = ({ checked, handleClick, roundIcon, disabled }) => {
  if (roundIcon) {
    return checked ? (
      <Icon
        className={cx(
          style["radio-button-container__custom-radio-button"],
          style["radio-button-container__custom-radio-button--complete"],
          disabled ? style.disabled : ""
        )}
        onClick={() => handleClick()}
        path={mdiRadioboxMarked}
        size="1.3rem"
        title="Action Complete"
      />
    ) : (
      <Icon
        className={cx(
          style["radio-button-container__custom-radio-button"],
          style["radio-button-container__custom-radio-button--incomplete"],
          disabled ? style.disabled : ""
        )}
        onClick={() => handleClick()}
        path={mdiRadioboxBlank}
        size="1.3rem"
        title="Action Incomplete"
      />
    );
  }
  return checked ? (
    <Icon
      className={cx(
        style["radio-button-container__custom-radio-button"],
        style["radio-button-container__custom-radio-button--complete"]
      )}
      onClick={() => handleClick()}
      path={mdiCheckboxIntermediate}
      size="1.3rem"
      title="Action Complete"
    />
  ) : (
    <Icon
      className={cx(
        style["radio-button-container__custom-radio-button"],
        style["radio-button-container__custom-radio-button--incomplete"]
      )}
      onClick={() => handleClick()}
      path={mdiCheckboxBlankOutline}
      size="1.3rem"
      title="Action Incomplete"
    />
  );
};

CustomRadioButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  roundIcon: PropTypes.bool.isRequired,
};

CustomRadioButton.defaultProps = {
  checked: false,
  disabled: false,
};

const RadioButtonV2 = ({
  radioButtonGroupName,
  label,
  id,
  customChange = () => {},
  className,
  roundIcon,
  disabled,
}) => (
  <Field name={radioButtonGroupName}>
    {({
      field, // { name, value, onChange, onBlur }
      form: { setFieldValue },
    }) => (
      <div className={cx(style["radio-button-container"], className)}>
        <label className={style["radio-button-container__label"]} htmlFor={radioButtonGroupName}>
          {label}
        </label>
        <input
          checked={id === field.value}
          className={style["radio-button-container__default-radio-button"]}
          id={id.toString()}
          name={radioButtonGroupName}
          onBlur={field.onBlur}
          onChange={field.onChange}
          type="radio"
          value={id}
        />
        <CustomRadioButton
          checked={id === field.value}
          roundIcon={!!roundIcon}
          handleClick={() => {
            if (!disabled) {
              setFieldValue(field.name, id);
              customChange(field.name, id);
            }
          }}
          disabled={disabled}
        />
      </div>
    )}
  </Field>
);

RadioButtonV2.propTypes = {
  label: PropTypes.string,
  radioButtonGroupName: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  customChange: PropTypes.func,
  roundIcon: PropTypes.bool,
  disabled: PropTypes.bool,
};

RadioButtonV2.defaultProps = {
  label: "",
  className: "",
  id: "",
  customChange: () => {},
  roundIcon: false,
  disabled: false,
};

export default RadioButtonV2;
