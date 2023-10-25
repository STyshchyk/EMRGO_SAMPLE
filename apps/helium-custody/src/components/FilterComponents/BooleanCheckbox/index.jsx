import { useState } from "react";

import { Box, Checkbox, FormControlLabel, Grid } from "@mui/material";

import { useFilters } from "../../../context/filter-context";

const BooleanCheckbox = ({ name, label, defaultFilter = false }) => {
  const [currentState, setCurrentState] = useState(defaultFilter);

  const filterContext = useFilters();
  const { setFilterValue } = filterContext;

  const handleChange = (event) => {
    const isChecked = event.target.checked;
    setCurrentState(isChecked);
    setFilterValue(isChecked, name, label, "boolean");
  };

  return (
    <Box mt={4} mb={1}>
      <Grid container className="h-full" alignContent="flex-end">
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={currentState} onChange={handleChange} name={name} />}
            label={label}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BooleanCheckbox;
