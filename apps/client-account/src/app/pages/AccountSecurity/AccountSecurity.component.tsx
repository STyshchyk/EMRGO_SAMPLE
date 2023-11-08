import { FC } from "react";

import {
  Button,
  DashboardContent,
  EnterEmailAddressModal,
  EnterOTPCodeModal,
  SetupTwoFactorAuthenticationModal,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { AccountPanel } from "../../components/AccountPanel";
import { AccountPanelContent } from "../../components/AccountPanelContent";
import { AccountPanelFooter } from "../../components/AccountPanelFooter";
import { AccountPanelHeader } from "../../components/AccountPanelHeader/AccountPanelHeader";
import { AccountPanelHeaderTitle } from "../../components/AccountPanelHeaderTitle";
import { AccountPanelText } from "../../components/AccountPanelText";
import { useAccountSecurityContext } from "./AccountSecurity.provider";
import * as Styles from "./AccountSecurity.styles";
import { IAccountSecurityProps } from "./AccountSecurity.types";

export const AccountSecurityComponent: FC<IAccountSecurityProps> = (
  props: IAccountSecurityProps
) => {
  const {
    user,
    onResetMFAClick,
    onSetupMFAClick,
    onResetPasswordClick,
    onCloseSecureAccountFlowClick,

    onResetMFA,
    onSetupMFA,
    secureAccountFlowView,
    setSecureAccountFlowView,
    onResetPassword,
    resetPasswordFlowView,
    setResetPasswordFlowView,
    onVerifyResetMFA,
    isQRCodeLoading,
    authenticatorURL,
  } = ensureNotNull(useAccountSecurityContext());

  const isMFAEnabled = user?.mfaEnabled;
  // const isMFAEnabled = false;

  return (
    <DashboardContent>
      <Styles.Container>
        <AccountPanel>
          <AccountPanelHeader>
            <AccountPanelHeaderTitle>Reset Password</AccountPanelHeaderTitle>
          </AccountPanelHeader>
          <AccountPanelContent>
            <AccountPanelText>
              To reset your password, you will need to enter your registered email id in the popup.
              This will send an email to it with further instructions
            </AccountPanelText>
          </AccountPanelContent>
          <AccountPanelFooter>
            <Button variant="secondary" size="large" onClick={onResetPasswordClick}>
              Reset Password
            </Button>
          </AccountPanelFooter>
        </AccountPanel>

        <AccountPanel>
          <AccountPanelHeader>
            <AccountPanelHeaderTitle>{`${
              isMFAEnabled ? "Reset" : "Enable"
            } Authenticator`}</AccountPanelHeaderTitle>
          </AccountPanelHeader>
          <AccountPanelContent>
            <AccountPanelText>
              To {isMFAEnabled ? "reset" : "enable"} your authenticator, you&apos;ll scan a new QR
              code using a two-factor authentication app on your phone. Once you do this,
              you&apos;ll enter the security code generated by your two-factor authentication app.
            </AccountPanelText>
          </AccountPanelContent>
          <AccountPanelFooter>
            <Button
              variant="secondary"
              size="large"
              onClick={() => {
                if (isMFAEnabled) {
                  onResetMFAClick();
                } else {
                  onSetupMFAClick();
                }
              }}
            >
              {`${isMFAEnabled ? "Reset" : "Enable"} Authenticator`}
            </Button>
          </AccountPanelFooter>
        </AccountPanel>
      </Styles.Container>

      <SetupTwoFactorAuthenticationModal
        isOpen={secureAccountFlowView === "setup-two-factor-auth"}
        onBack={() => {
          if (user?.mfaEnabled) {
            setSecureAccountFlowView("enter-otp-code");
          } else {
            onCloseSecureAccountFlowClick();
          }
        }}
        isQRCodeLoading={isQRCodeLoading}
        authenticatorURL={authenticatorURL}
        onSetup={onSetupMFA}
      />

      <EnterOTPCodeModal
        isOpen={secureAccountFlowView === "enter-otp-code"}
        onClose={onCloseSecureAccountFlowClick}
        onSetup={onVerifyResetMFA}
        title="Enter the code sent to your email"
        subtitle="To reset MFA, enter the 6-digit verification code sent to your email"
        buttonText="Next"
      />

      <EnterEmailAddressModal
        isOpen={resetPasswordFlowView === "enter-email-address"}
        onClose={() => setResetPasswordFlowView(undefined)}
        onResetPassword={onResetPassword}
      />
    </DashboardContent>
  );
};
