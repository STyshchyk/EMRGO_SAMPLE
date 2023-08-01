/* eslint-disable react/jsx-props-no-spreading */

import Select, { components } from "react-select";

import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import Icon from "@mdi/react";
import cx from "classnames";
import PropTypes from "prop-types";

import style from "./style.module.scss";

const customSelectStyles = {
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  container: (provided) => ({
    ...provided,
    width: "200px",
    outline: "none",
    height: "30px",
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
    borderRadius: 0,
    border: 0,
    minHeight: "30px",
    height: "30px",
    outline: "none",
    borderBottom: "2px dotted",
    width: "100%",
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "30px",
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#28ccbf" : "#fff",
    color: state.isFocused ? "#fff" : "#23389c",
    borderRadius: 0,
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "#8d99bf",
    display: "flex",
    top: "36%",
    justifyContent: "start",
    width: "100%",
  }),

  singleValue: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    top: "36%",
    color: "#23389c",
  }),

  multiValue: (provided) => ({
    ...provided,
    color: "#fff",
    backgroundColor: "#28ccbf",
    borderRadius: "50px",
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ":hover": {
      color: "#eb0000",
    },
  }),
  menu: (provided) => ({
    ...provided,
    width: "100%",
    borderRadius: 0,
  }),
};

const DropdownIndicator = (props) => {
  // eslint-disable-next-line react/prop-types
  const { selectProps } = props;
  // eslint-disable-next-line react/prop-types
  const { menuIsOpen } = selectProps;

  return (
    <components.DropdownIndicator {...props}>
      <Icon
        path={menuIsOpen ? mdiChevronUp : mdiChevronDown}
        className={style["dropdown-indicator"]}
        title="Open"
        size={1}
      />
    </components.DropdownIndicator>
  );
};

const ClearSelect = (props) => {
  const { name, options, placeholder, disabled, isMulti, fullWidth, onChange, value } = props;
  return (
    <div className={cx(style.container, fullWidth ? style.fullWidth : "")}>
      <div className={style["input-group"]}>
        <Select
          className="select"
          isDisabled={disabled}
          components={{ DropdownIndicator }}
          name={name}
          menuPortalTarget={document.body}
          onChange={(option) => {
            onChange(option);
          }}
          options={options}
          placeholder={placeholder}
          styles={customSelectStyles}
          value={value}
          isMulti={isMulti}
        />
      </div>
    </div>
  );
};

ClearSelect.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.func]).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

ClearSelect.defaultProps = {
  placeholder: "Select...",
  disabled: false,
  isMulti: false,
  fullWidth: false,
};

export default ClearSelect;
