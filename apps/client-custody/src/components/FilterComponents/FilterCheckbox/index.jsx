import { useEffect } from "react";

import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

import { useFilters } from "../../../context/filter-context";

const FilterCheckbox = ({ label, name, checked, onChange, handleFetch, isFetch }) => {
  const filterContext = useFilters();
  const { filters } = filterContext;
  const isEntitySelected = filters.hasOwnProperty("entity");

  useEffect(() => {
    const dataUpdated = {
      ...filters,
    };
    dataUpdated[name] = { checked, label, type: "checkbox" };

    // if (checked) {
    //   handleFetch(dataUpdated);
    // }

    if (isFetch) {
      handleFetch(dataUpdated);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, isFetch]);

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
