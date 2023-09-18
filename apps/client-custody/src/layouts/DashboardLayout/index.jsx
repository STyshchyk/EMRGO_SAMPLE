import PropTypes from "prop-types";

import { ClientDashboardWrapper } from "../../../../../packages/shared-ui/src/";
import { CustodyWrapper as ClientCustodyWrapper } from "../../components/CustodyWrapper/CustodyWrapper";
import DashboardNavHeader from "../../components/DashboardNavHeader";
import { useTheme } from "../../context/theme-context";

const DashboardLayout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <ClientCustodyWrapper>
      <DashboardNavHeader />
      {children}
    </ClientCustodyWrapper>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default DashboardLayout;
