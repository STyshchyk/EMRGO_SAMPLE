import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { clientAuthenticationRoutes as routes } from "@emrgo-frontend/constants";
import { useMutation } from "@tanstack/react-query";

import { verifyEmailChange } from "./ChangeEmailVerification.service";
import { IChangeEmailVerificationContext } from "./ChangeEmailVerification.types";

const ChangeEmailVerificationContext = createContext<IChangeEmailVerificationContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const ChangeEmailVerificationProvider = ({ children }: PropsWithChildren) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { mutate: doVerifyEmailChange, isError, error, isLoading } = useMutation(verifyEmailChange);

  useEffect(() => {
    if (searchParams.has("token")) {
      const token = searchParams.get("token");
      const requestPayload = { token: token || "" };
      doVerifyEmailChange(requestPayload);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectToLogin = () => {
    navigate(routes.login);
  };

  const state: IChangeEmailVerificationContext = {
    isLoading,
    isError,
    error,
    redirectToLogin,
  };

  return (
    <ChangeEmailVerificationContext.Provider value={state}>
      {children}
    </ChangeEmailVerificationContext.Provider>
  );
};

export const useChangeEmailVerificationContext = () => useContext(ChangeEmailVerificationContext);
