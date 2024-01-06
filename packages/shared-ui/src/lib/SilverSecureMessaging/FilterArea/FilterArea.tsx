import React, { FC, useEffect, useRef } from "react";

import { ensureNotNull } from "@emrgo-frontend/utils";
import FilterListIcon from "@mui/icons-material/FilterList";
import Tooltip from "@mui/material/Tooltip";

import { Checkbox } from "../../Checkbox/Checkbox";
import { useSilverSecureMessagingContext } from "../SilverSecureMessaging.provider";
import * as Styles from "./FilterArea.styles";
import { IFilterAreaProps } from "./FilterArea.types";

export const FilterArea: FC<IFilterAreaProps> = ({}) => {
  const selectAllRef = useRef<HTMLInputElement>(null);
  const { messagesList, checked, setChecked, isCheckModeSelected, setCheckMode } = ensureNotNull(
    useSilverSecureMessagingContext()
  );
  useEffect(() => {
    if (!selectAllRef.current) return;
    if (checked.length === messagesList.length) {
      selectAllRef.current.indeterminate = false;
      selectAllRef.current.checked = true;
    } else if (checked.length > 0) {
      selectAllRef.current.indeterminate = true;
      selectAllRef.current.checked = false;
    }
  }, [checked.length]);

  function selectAll() {
    const newChecked: string[] = [...checked];
    messagesList.forEach((elem) => {
      if (newChecked.indexOf(elem.id) === -1) newChecked.push(elem.id);
    });
    setChecked(newChecked);
    setCheckMode(true);
  }

  function diSelectAll() {
    setChecked([]);
    setCheckMode(false);
  }

  return (
    <Styles.FilterArea>
      <Tooltip title={"Select All"} placement="top" aria-hidden={false}>
        <Checkbox
          style={{
            display: isCheckModeSelected ? "inline-flex" : "none",
          }}
          ref={selectAllRef}
          onChange={(event) => {
            if (event.target.checked) selectAll();
            else diSelectAll();
          }}
        />
      </Tooltip>
      <div>
        <Tooltip title={"Sort"} placement="top">
          <FilterListIcon />
        </Tooltip>
        <Tooltip title={"Select"} placement="top">
          <Checkbox
            onChange={() => {
              setCheckMode((prevState) => !prevState);
              isCheckModeSelected && diSelectAll();
            }}
            checked={isCheckModeSelected}
          />
        </Tooltip>
      </div>
    </Styles.FilterArea>
  );
};
