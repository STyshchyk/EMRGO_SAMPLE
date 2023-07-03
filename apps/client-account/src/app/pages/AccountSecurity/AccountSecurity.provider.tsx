import { createContext, PropsWithChildren, useContext, useState } from "react";

import { queryKeys } from "@emrgo-frontend/constants";
import {
  enableAuthenticatorMFA,
  requestResetAuthenticatorMFA,
  setupAuthenticatorMFA,
} from "@emrgo-frontend/services";
import { useToast, useUser } from "@emrgo-frontend/shared-ui";
import { TResetPasswordFlowView, TSecureAccountFlowView } from "@emrgo-frontend/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IAccountSecurityContext } from "./AccountSecurity.types";

const AccountSecurityContext = createContext<IAccountSecurityContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const AccountSecurityProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [secureAccountFlowView, setSecureAccountFlowView] =
    useState<TSecureAccountFlowView>(undefined);
  const [resetPasswordFlowView, setResetPasswordFlowView] =
    useState<TResetPasswordFlowView>(undefined);
  const { user } = useUser();
  const { showSuccessToast } = useToast();

  const [authenticatorURL, setAuthenticatorURL] = useState("");

  const { mutate: doSetupAuthenticatorMFA, isLoading: isQRCodeLoading } =
    useMutation(setupAuthenticatorMFA);

  const { mutate: doEnableAuthenticatorMFA } = useMutation(enableAuthenticatorMFA);

  const { mutate: doRequestResetAuthenticatorMFA } = useMutation(requestResetAuthenticatorMFA);

  const refreshProfile = () => {
    queryClient.invalidateQueries({
      queryKey: [queryKeys.account.profile.fetch],
      exact: true,
    });
  };

  const onResetPasswordClick = () => {
    setResetPasswordFlowView("enter-email-address");
  };

  const onResetPassword = (email: string) => {
    console.log("Reset Password", email);
  };

  const onResetMFA = () => {
    console.log("Reset MFA");
  };

  const onSetupMFA = (otp: string) => {
    const requestPayload = { code: otp };
    doEnableAuthenticatorMFA(requestPayload, {
      onSuccess: (response) => {
        setSecureAccountFlowView(undefined);
        refreshProfile();
        showSuccessToast("Successfully enabled authenticator");
      },
    });
  };

  const onResetMFAClick = () => {
    doRequestResetAuthenticatorMFA(undefined);
    setSecureAccountFlowView("enter-otp-code");
  };

  const onSetupMFAClick = () => {
    doSetupAuthenticatorMFA(undefined, {
      onSuccess: (response) => {
        const { data } = response;
        setAuthenticatorURL(data?.otpauth_url);
      },
    });
    setSecureAccountFlowView("setup-two-factor-auth");
  };

  const onCloseSecureAccountFlowClick = () => {
    setSecureAccountFlowView(undefined);
  };

  const state: IAccountSecurityContext = {
    user,
    onResetPasswordClick,
    onResetMFAClick,
    onSetupMFAClick,
    onCloseSecureAccountFlowClick,

    onResetMFA,
    onSetupMFA,
    secureAccountFlowView,
    setSecureAccountFlowView,
    onResetPassword,
    resetPasswordFlowView,
    setResetPasswordFlowView,

    isQRCodeLoading,
    authenticatorURL,
  };

  return (
    <AccountSecurityContext.Provider value={state}>{children}</AccountSecurityContext.Provider>
  );
};

export const useAccountSecurityContext = () => useContext(AccountSecurityContext);
