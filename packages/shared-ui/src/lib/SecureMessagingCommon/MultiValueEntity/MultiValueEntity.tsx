import React from "react";
import { MultiValueProps } from "react-select";

import { colors } from "@emrgo-frontend/theme";
import { extractInitials } from "@emrgo-frontend/utils";
import ClearIcon from "@mui/icons-material/Clear";
import { Avatar } from "@mui/material";
import Chip from "@mui/material/Chip";

export function MultiValue<OptionType>(props: MultiValueProps<OptionType>): JSX.Element {
  const {
    children,
    className,
    cx,
    getStyles,
    innerProps,
    isDisabled,
    removeProps,
    data,
    selectProps,
  } = props;
  // @ts-ignore
  return (
    <div
      {...innerProps}
      onClick={(event) => {
        event.nativeEvent.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <Chip
        sx={{
          "& .MuiChip-label": {
            maxWidth: "125px",
          },
          "& svg": {
            fontSize: "18px !important",
            fill: `${colors.green3} !important`,
            "&:hover": {
              fill: `${colors.green5} !important`,
            },
          },
        }}
        variant={"outlined"}
        avatar={<Avatar>{extractInitials(children as string)}</Avatar>}
        label={<span className={"text-ellipsis overflow-hidden "}>{children}</span>}
        deleteIcon={<ClearIcon {...removeProps} />}
        onDelete={() => {
          if (removeProps?.onClick) {
            removeProps.onClick(data);
          }
        }}
      />
    </div>
  );
}
