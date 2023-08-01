import cx from "classnames";
import { useField } from "formik";
import PropTypes from "prop-types";

import Required from "../Required";
import style from "./style.module.scss";

const TextArea = (props) => {
  const [field, meta, helpers] = useField(props);
  const {
    name,
    rows,
    label,
    placeholder,
    readOnly,
    className,
    disableLabel,
    align,
    fullWidth,
    customOnchange,
    isRequired,
  } = props;

  return (
    <div className={cx(style.container, fullWidth ? style.fullWidth : "")}>
      <div
        className={cx(
          style["input-group"],
          align === "left" ? style["label-left"] : style["label-center"]
        )}
      >
        {label == null ? (
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
        <textarea
          {...field}
          value={field.value ?? ""}
          id={name}
          rows={rows}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cx(style["input-group__field"], fullWidth ? style.fullWidth : "", className)}
          onChange={(e) => {
            helpers.setValue(e.target.value);
            customOnchange(e.target.value);
          }}
        />
      </div>
      {meta.touched && meta.error ? (
        <div className={style["input-group__error"]}>{meta.error}</div>
      ) : null}
    </div>
  );
};

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  rows: PropTypes.number,
  disableLabel: PropTypes.bool,
  align: PropTypes.string,
  fullWidth: PropTypes.bool,
  customOnchange: PropTypes.func,
};

TextArea.defaultProps = {
  label: "",
  placeholder: "",
  readOnly: false,
  className: "",
  disableLabel: false,
  rows: 3,
  align: "left",
  fullWidth: false,
  customOnchange: () => {},
};

export default TextArea;
