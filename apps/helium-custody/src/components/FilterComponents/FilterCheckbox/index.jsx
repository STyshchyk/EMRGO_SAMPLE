import { useEffect } from "react";

import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

import { useFilters } from "../../../context/filter-context";

const FilterCheckbox = ({ label, name, checked, onChange, handleFetch }) => {
  const filterContext = useFilters();
  const { filters } = filterContext;

  useEffect(() => {
    const dataUpdated = {
      ...filters,
    };
    dataUpdated[name] = { checked, label, type: "checkbox" };

    handleFetch(dataUpdated);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <Box>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={(e) => onChange(e)} name={name} />}
          label={label}
        />
      </FormGroup>
    </Box>
  );
};

export default FilterCheckbox;
