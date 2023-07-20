import { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const TableFiltersWrapper = ({ children }) => {
  const [expanded, setExpanded] = useState(true);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <MuiAccordion
      TransitionProps={{ unmountOnExit: true }}
      square
      expanded={expanded === "filter-toolbar"}
      onChange={handleChange("filter-toolbar")}
    >
      <MuiAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="filter-toolbar-content"
        id="filter-toolbar-header"
      >
        <Grid container alignItems="center">
          <FilterListIcon
            style={{
              marginRight: "0.1em",
            }}
          />
          <Typography>Filters</Typography>
        </Grid>
      </MuiAccordionSummary>
      <MuiAccordionDetails>
        <div
          style={{
            width: "100%",
          }}
        >
          {children}
        </div>
      </MuiAccordionDetails>
    </MuiAccordion>
  );
};

TableFiltersWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default TableFiltersWrapper;
