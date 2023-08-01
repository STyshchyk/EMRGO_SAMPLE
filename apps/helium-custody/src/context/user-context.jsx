import { createContext, useContext } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import * as authSelectors from "../redux/selectors/auth";

const UserContext = createContext();
UserContext.displayName = "User";

const DisconnectedUserProvider = (props) => {
  const { userData } = props;

  const { userRole, userFullName, corporateEntityName } = userData;

  return (
    <UserContext.Provider
      value={{
        data: {
          userRole,
          userFullName,
          corporateEntityName,
        },
      }}
      {...props}
    />
  );
};

const mapStateToProps = (state) => ({
  userData: {
    corporateEntityName: authSelectors.selectCorporateEntityName(state),
    userFullName: authSelectors.selectUserFullName(state),
    userRole: authSelectors.selectUserRole(state),
  },
});

DisconnectedUserProvider.propTypes = {
  userData: PropTypes.shape({
    corporateEntityName: PropTypes.string,
    userFullName: PropTypes.string,
    userRole: PropTypes.string,
  }).isRequired,
};

const useUser = () => useContext(UserContext);
const UserProvider = connect(mapStateToProps, {})(DisconnectedUserProvider);

export { useUser, UserProvider };
