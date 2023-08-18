import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Box } from "@mui/material";
import cx from "classnames";
import PropTypes from "prop-types";

import { ClientDashboardWrapper } from "../../../../../packages/shared-ui/src/";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardNavHeader from "../../components/DashboardNavHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useTheme } from "../../context/theme-context";
import style from "./style.module.scss";

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const { theme } = useTheme();
  const { locale } = theme;
  // const classes = useStyles();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <ClientDashboardWrapper>
      <DashboardNavHeader />
      {children}
    </ClientDashboardWrapper>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default DashboardLayout;
