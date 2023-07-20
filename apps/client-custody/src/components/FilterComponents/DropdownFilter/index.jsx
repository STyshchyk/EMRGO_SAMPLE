import Select from "react-select";
import makeAnimated from "react-select/animated";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
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
    height: "3rem",
  }),
};

const DropdownFilter = ({
  name,
  label,
  options,
  customOnChange,
  currentlySelectedOption,
  setCurrentlySelectedOption,
  customComponent,
  isDisabled,
}) => {
  // const [currentlySelectedOption, setCurrentlySelectedOption] = useState(defaultFilter);

  const filterContext = useFilters();
  const { setFilterValue, clearFilterValue } = filterContext;

  const clearFilter = () => {
    setCurrentlySelectedOption(null);
    // get filters and then filter out the object with name prooperty
    // const result = Object.fromEntries(Object.entries(filters).filter(([key]) => key !== name));
    // setFilters(result);
    clearFilterValue(name);
  };

  const handleChange = (newValue) => {
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

      <Box my={1} className="full-width">
        <Select
          fullWidth
          closeMenuOnSelect
          components={customComponent || { ...animatedComponents }}
          isSearchable
          placeholder={`${label}...`}
          styles={customSelectStyles}
          options={options}
          value={currentlySelectedOption}
          onChange={(opt) => {
            handleChange(opt);
            customOnChange(opt, setFilterValue);
          }}
          isDisabled={isDisabled}
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
};

DropdownFilter.defaultProps = {
  isDisabled: false,
  setSelectedOption: () => {},
  customOnChange: () => {},
};

export default DropdownFilter;
