import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { clientAuthenticationRoutes as routes } from "@emrgo-frontend/constants";
import { useToast, useUser } from "@emrgo-frontend/shared-ui";
import { useMutation } from "@tanstack/react-query";
import { useDarkMode } from "usehooks-ts";

import { enableMFA, setupMFA, verifyMFA } from "../../services";
import { ISetupMFAContext } from "./SetupMFA.types";

const SetupMFAContext = createContext<ISetupMFAContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}W
 */

export const SetupMFAProvider = ({ children }: PropsWithChildren) => {
  const location = useLocation();

  const navigate = useNavigate();
  const { enable } = useDarkMode();

  const { showErrorToast } = useToast();
  const { setVerifyMFA } = useUser();

  const [authenticatorURL, setAuthenticatorURL] = useState("");

  const { mutate: doSetupAuthenticatorMFA, isLoading: isQRCodeLoading } = useMutation(setupMFA);
  const { mutate: doEnableAuthenticatorMFA } = useMutation(enableMFA);
  const { mutate: doVerifyAuthenticatorMFA } = useMutation(verifyMFA);

  const onVerifyMFA = (otp: string) => {
    doVerifyAuthenticatorMFA(otp, {
      onSuccess: (data) => {
        if (setVerifyMFA) {
          setVerifyMFA(false);
        }
      },
      onError: () => {
        showErrorToast("Error while verifing mfa code");
      },
    });
  };

  const onEnableMFA = (otp: string) => {
    doEnableAuthenticatorMFA(otp, {
      onSuccess: (data) => {
        navigate(routes.login);
      },
      onError: () => {
        showErrorToast("Error while trying to enable mfa");
      },
    });
  };

  const onSetupMFA = () => {
    doSetupAuthenticatorMFA(undefined, {
      onSuccess: (data) => {
        setAuthenticatorURL(data?.otpauth_url);
      },
    });
  };

  useEffect(() => {
    // to get the qr code
    onSetupMFA();
    // set to dark theme
    enable();
  }, []);

  const state: ISetupMFAContext = {
    otpauth_url: "",

    onEnableMFA,
    onSetupMFA,
    onVerifyMFA,

    isQRCodeLoading,
    authenticatorURL,
  };

  return <SetupMFAContext.Provider value={state}>{children}</SetupMFAContext.Provider>;
};

export const useSetupMFAContext = () => useContext(SetupMFAContext);
