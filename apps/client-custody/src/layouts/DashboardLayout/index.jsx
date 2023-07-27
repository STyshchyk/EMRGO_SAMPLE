import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Box } from "@mui/material";
import cx from "classnames";
import PropTypes from "prop-types";

import DashboardHeader from "../../components/DashboardHeader";
import DashboardNavHeader from "../../components/DashboardNavHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useTheme } from "../../context/theme-context";
import style from "./style.module.scss";

const drawerWidth = 240;

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//   },
//   appBar: {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: drawerWidth,
//   },
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   // necessary for content to be below app bar
//   toolbar: theme.mixins.toolbar,
//   content: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.default,
//     padding: theme.spacing(3),
//   },
// }));

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const { theme } = useTheme();
  const { locale } = theme;
  // const classes = useStyles();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <div className={style.container__root}>
      <DashboardHeader open={open} handleDrawerToggle={handleDrawerToggle} />
      <div className={cx(style.bodyContainer)}>
        <DashboardSidebar open={open} />
        <main
          className={cx(
            style.container__content,
            locale.rtl ? style.container__content__right : style.container__content__left,
            {
              [style.container__contentShift]: open,
            }
          )}
        >
          <DashboardNavHeader />
          <div className={style.drawerHeader} />
          <Box sx={(muiTheme) => muiTheme.mixins.toolbar} />
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default DashboardLayout;
