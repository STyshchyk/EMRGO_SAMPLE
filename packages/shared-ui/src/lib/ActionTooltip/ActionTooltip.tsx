import { FC } from "react";
import * as React from "react";

import { colors } from "@emrgo-frontend/theme";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Tooltip from "@mui/material/Tooltip";
import { useDarkMode } from "usehooks-ts";

import * as Styles from "./ActionTooltip.styles";
import { IActionTooltipProps } from "./ActionTooltip.types";

export const ActionTooltip: FC<IActionTooltipProps> = ({ children, title }) => {
  const [open, setOpen] = React.useState(false);
  const { isDarkMode } = useDarkMode();
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
            disablePortal: true
          }}
          placement={"left"}
          sx={{ marginLeft: "auto" }}
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: isDarkMode ? colors.green3 : colors.white["100"],
                "& .MuiTooltip-arrow": {
                  color: "common.black"
                },
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 0.25rem 0.5rem"
              }
            }
          }}
        >
          <Button sx={{ padding: "5px 10px", minWidth: "40px" }} onClick={handleOpen}>
            <Styles.PanelHeaderIconCustom>
              <Styles.TableActionButton />
            </Styles.PanelHeaderIconCustom>
          </Button>
        </Tooltip>
      </ClickAwayListener>
    </Styles.ActionTooltip>
  );
};
