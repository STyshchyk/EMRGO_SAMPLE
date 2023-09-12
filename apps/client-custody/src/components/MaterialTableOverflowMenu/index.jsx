import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import style from "./style.module.scss";

const MaterialTableOverflowMenu = ({ id, actions, anchorEl, setAnchorEl, selectedRow }) => (
  <Menu
    id={id || "simple-menu"}
    data-testid="overflow-menu"
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={() => setAnchorEl(null)}
  >
    {actions.map((action) => {
      const isHidden =
        typeof action.hidden === "function" ? action.hidden(selectedRow) : action.hidden;
      return (
        !isHidden && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              action.callback(selectedRow);
            }}
            key={action.label}
            className={style.actionicon}
            disabled={
              typeof action.disabled === "function" ? action.disabled(selectedRow) : action.disabled
            }
            data-testid={action.label}
          >
            {action.icon && <ListItemIcon className={style.listItem}>{action.icon}</ListItemIcon>}
            <Typography variant="inherit">{action.label}</Typography>
          </MenuItem>
        )
      );
    })}
  </Menu>
);

MaterialTableOverflowMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      callback: PropTypes.func,
      icon: PropTypes.node,
      label: PropTypes.string,
    })
  ),
};

MaterialTableOverflowMenu.defaultProps = {
  actions: [],
};

export default MaterialTableOverflowMenu;
