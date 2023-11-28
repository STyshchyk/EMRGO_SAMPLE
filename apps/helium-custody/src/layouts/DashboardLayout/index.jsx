import { useState } from "react";

import PropTypes from "prop-types";

import { CustodyWrapper } from "../../components/CustodyWrapper/CustodyWrapper";
import DashboardNavHeader from "../../components/DashboardNavHeader";
import { useTheme } from "../../context/theme-context";

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
    <CustodyWrapper>
      <DashboardNavHeader />
      {children}
    </CustodyWrapper>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default DashboardLayout;
