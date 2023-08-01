/* eslint-disable react/require-default-props */
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";

import PropTypes from "prop-types";

import MFAReset from "../../components/MFAReset";
import RegistrationForm from "../../components/RegistrationForm";
import RegistrationSuccess from "../../components/RegistrationSuccess";
import TwoFactorAuthentication from "../../components/TwoFactorAuthentication";
import TwoFactorAuthenticationExp from "../../components/TwoFactorAuthenticationExp";
import routes from "../../constants/routes";
import MFASetup from "../../pages/Administration/IndividualKYC/Details";
import ForgotPasswordPage from "../../pages/ForgotPasswordPage";
import ResetPasswordPage from "../../pages/ResetPasswordPage";
import { doPasswordReset } from "../../redux/actionCreators/auth";
import {
  hasSuccessfullyRequestedPassword,
  hasSuccessfullyResetPassword,
  selectResetEmailID,
} from "../../redux/selectors/auth";
import useIsProduction from "../../utils/useIsProduction";

const AuthContainer = ({ requestPasswordReset, resetPasswordSuccess }) => {
  const location = useLocation().pathname;
  const inProd = useIsProduction();

  switch (location) {
    case routes.authentication.forgotPassword:
      return <ForgotPasswordPage />;
    case routes.authentication.reset:
      return <ResetPasswordPage />;
    case routes.authentication.resetMFAAndPassword:
      return <ResetPasswordPage />;
    case routes.authentication.registration:
      return (
        <RegistrationForm
          requestPasswordReset={requestPasswordReset}
          resetPasswordSuccess={resetPasswordSuccess}
        />
      );
    case routes.authentication.success:
      return <RegistrationSuccess />;
    case routes.authentication.otp:
      return inProd ? <TwoFactorAuthentication /> : <TwoFactorAuthenticationExp />;
    case routes.authentication.setupMFA:
      return <MFASetup />;
    case routes.authentication.resetMFA:
      return <MFAReset />;
    default:
      return null;
  }
};

const mapStateToProps = (state) => ({
  requestedPasswordSuccess: hasSuccessfullyRequestedPassword(state),
  resetPasswordSuccess: hasSuccessfullyResetPassword(state),
  resetEmailID: selectResetEmailID(state),
});

const mapDispatchToProps = (dispatch) => ({
  requestPasswordReset: (payload) => dispatch(doPasswordReset(payload)),
});

AuthContainer.propTypes = {
  requestPasswordReset: PropTypes.func.isRequired,
  resetPasswordSuccess: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
