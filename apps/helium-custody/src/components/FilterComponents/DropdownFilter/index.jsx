import { useEffect } from "react";

import { Select } from "@emrgo-frontend/shared-ui";
import { selectStyles } from "@emrgo-frontend/theme";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import { useFilters } from "../../../context/filter-context";

const DropdownFilter = ({
  name,
  label,
  options,
  customOnChange,
  currentlySelectedOption,
  setCurrentlySelectedOption,
  customComponent,
  isDisabled,
  setClearDisabled,
  setCustomClear,
}) => {
  // const [currentlySelectedOption, setCurrentlySelectedOption] = useState(defaultFilter);

  const filterContext = useFilters();
  const { setFilterValue, clearFilterValue } = filterContext;

  const clearFilter = () => {
    setCurrentlySelectedOption(null);
    if (setClearDisabled) setClearDisabled(false);
    if (setCustomClear) setCustomClear();

    clearFilterValue(name);
  };

  const handleChange = (newValue) => {
    setCurrentlySelectedOption(newValue);
    setFilterValue(newValue, name, label, "dropdown");
  };
  useEffect(() => {
    //In order to update filter counter when value is autopopulated or deleted
    if (currentlySelectedOption) {
      setTimeout(() => {
        setFilterValue(currentlySelectedOption, name, label, "dropdown");
      }, 100);
    } else {
      setTimeout(() => {
        clearFilter();
      }, 100);
    }
  }, [currentlySelectedOption, name]);
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

      <Box my={1} sx={{ width: "100%" }}>
        <Select
          fullWidth
          closeMenuOnSelect
          components={customComponent}
          isSearchable
          placeholder={`${label}...`}
          styles={selectStyles()}
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
