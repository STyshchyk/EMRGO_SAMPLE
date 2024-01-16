import React, { FC } from "react";

import FilterListIcon from "@mui/icons-material/FilterList";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";

import { useFilters } from "../../../Context/filter-context";
import { Tooltip as FathomTooltip } from "../../../Tooltip";
import * as Styles from "./FilterToggle.styles";
import { IFilterToggleProps } from "./FilterToggle.types";

const toggleFilter = [
  {
    value: "received",
    label: "Received",
  },
  {
    value: "drafts",
    label: "Drafts",
  },

  {
    value: "sent",
    label: "Sent",
  },
  {
    value: "archived",
    label: "Archived",
  },
];
export const FilterToggle: FC<IFilterToggleProps> = ({}) => {
  const { messageType, setMessageType } = useFilters();
  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: TMessageType) => {
    if (newAlignment !== null) setMessageType(newAlignment);
  };
  return (
    <Styles.FilterToggle>
      <FathomTooltip
        content={
          <ToggleButtonGroup
            color="primary"
            value={messageType}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            orientation="vertical"
          >
            {toggleFilter.map((elem) => {
              return (
                <ToggleButton
                  key={elem.label}
                  sx={{
                    textTransform: "capitalize",
                    border: "0",
                    justifyContent: "flex-start",
                  }}
                  value={elem.value}
                >
                  {elem.label}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        }
      >
        <Tooltip title={"Sort by"} placement="top">
          <FilterListIcon />
        </Tooltip>
      </FathomTooltip>
    </Styles.FilterToggle>
  );
};
