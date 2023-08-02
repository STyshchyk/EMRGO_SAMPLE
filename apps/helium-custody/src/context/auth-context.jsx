import { createContext, useContext } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import * as authSelectors from "../redux/selectors/auth";

const AuthContext = createContext();
AuthContext.displayName = "Auth";

const DisconnectedAuthProvider = (props) => {
  const { isAuthenticated, isMFAVerified, isMFAEnabled, isMFAActive } = props;

  return (
    <AuthContext.Provider
      value={{
        data: {
          isAuthenticated,
          isMFAVerified,
          isMFAEnabled,
          isMFAActive,
        },
      }}
      {...props}
    />
  );
};

DisconnectedAuthProvider.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isMFAVerified: PropTypes.bool.isRequired,
  isMFAEnabled: PropTypes.bool.isRequired,
  isMFAActive: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: authSelectors.selectIsUserAuthenticated(state),
  isMFAVerified: authSelectors.hasMFAVerified(state),
  isMFAEnabled: authSelectors.hasMFAEnabled(state),
  isMFAActive: authSelectors.hasMFAActive(state),
});

const useAuth = () => useContext(AuthContext);
const AuthProvider = connect(mapStateToProps, {})(DisconnectedAuthProvider);

export { useAuth, AuthProvider };
