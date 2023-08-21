import { useState } from "react";
import { Select } from "@emrgo-frontend/shared-ui";
import makeAnimated from "react-select/animated";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import { useFilters } from "../../../context/filter-context";

const animatedComponents = makeAnimated();
const customSelectStyles = {
  menu: (styles) => ({
    ...styles,
    zIndex: 100,
  }),
  control: (styles) => ({
    ...styles,
    border: "none",
    borderRadius: "6px",
    backgroundColor: "rgba(0, 0, 0, 0.09)",
    minHeight: "3rem",
    overflow: "hidden",
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
};

const DropdownFilter = ({ name, label, customOnChange, options, defaultFilter, isMulti }) => {
  const [currentlySelectedOption, setCurrentlySelectedOption] = useState([]);

  const filterContext = useFilters();
  const { setFilterValue, clearFilterValue } = filterContext;
  // console.log(filters, 'dropdownfilter updated');

  const clearFilter = () => {
    setCurrentlySelectedOption([]);
    // get filters and then filter out the object with name prooperty
    // const result = Object.fromEntries(Object.entries(filters).filter(([key]) => key !== name));
    // setFilters(result);
    clearFilterValue(name);
  };

  const handleChange = (newValue, { action }) => {
    if (action === "clear") {
      clearFilter();
      return;
    }
    if (customOnChange)customOnChange(newValue, {action});
    setCurrentlySelectedOption(newValue);
    setFilterValue(newValue, name, label, "dropdown");
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="flex-start">
        <Typography variant="body1" className="bold">
          {label}
        </Typography>

        <ButtonBase onClick={() => clearFilter()}>
          <Typography variant="caption">Clear</Typography>
        </ButtonBase>
      </Grid>

      <Box my={1} className="w-full">
        <Select
          closeMenuOnSelect
          fullWidth
          components={{
            ...animatedComponents,
            MultiValueContainer: ({ data }) => (
              <Chip key={data.value} label={data.value} className="" color="secondary" />
            ),
          }}
          isMulti={isMulti}
          isSearchable
          placeholder={`${label}...`}
          styles={customSelectStyles}
          options={options}
          value={currentlySelectedOption}
          onChange={handleChange}
        />
      </Box>
    </>
  );
};

DropdownFilter.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  options: PropTypes.array.isRequired,
  setDefaultFilterValue: PropTypes.func,
  customOnChange: PropTypes.func
};

DropdownFilter.defaultProps = {
  isDisabled: false,
};

export default DropdownFilter;
