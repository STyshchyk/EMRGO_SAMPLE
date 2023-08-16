import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Box } from "@mui/material";
import cx from "classnames";
import PropTypes from "prop-types";

import { ClientDashboardWrapper } from "../../../../../packages/shared-ui/src/";
import { useUser } from "../../../../../packages/shared-ui/src/";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardNavHeader from "../../components/DashboardNavHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useTheme } from "../../context/theme-context";
import * as authActionCreators from "../../redux/actionCreators/auth";
import * as authSelectors from "../../redux/selectors/auth";
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
  const authenticatedUserObject = useSelector(authSelectors.selectAuthenticatedUserObject);
  const {updateUser } = useUser();


  const { theme } = useTheme();
  const { locale } = theme;
  // const classes = useStyles();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchUserProfile = (payload) => dispatch(authActionCreators.doFetchUserProfile(payload));

    fetchUserProfile({
      successCallback: () => {
        console.log("success call")
        updateUser(authenticatedUserObject)
      },
    });
  }, [dispatch]);

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
