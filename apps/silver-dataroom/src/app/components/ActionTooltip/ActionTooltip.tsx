import { FC } from "react";
import * as React from "react";

import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Tooltip from "@mui/material/Tooltip";
// TODO : FIX this


import * as Styles from "./ActionTooltip.styles";
import { IActionTooltipProps } from "./ActionTooltip.types";
import {
  PanelHeaderIconCustom,
  TableActionButton
} from "../../pages/Administration/Users/InvitedUsersTable/IvitedUsersTable.styles";

export const ActionTooltip: FC<IActionTooltipProps> = ({ children, title }) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <Styles.ActionTooltip>
      <ClickAwayListener onClickAway={handleClose}>
        <Tooltip
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          title={title}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          PopperProps={{
            disablePortal: true,
          }}
          placement={"left"}
          sx={{ marginLeft: "auto" }}
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: "common.white",
                "& .MuiTooltip-arrow": {
                  color: "common.black",
                },
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 0.25rem 0.5rem",
              },
            },
          }}
        >
          <Button sx={{ padding: "5px 10px", minWidth: "40px" }} onClick={handleOpen}>

            <PanelHeaderIconCustom>
              <TableActionButton/>
            </PanelHeaderIconCustom>
          </Button>
        </Tooltip>
      </ClickAwayListener>
    </Styles.ActionTooltip>
  );
};
