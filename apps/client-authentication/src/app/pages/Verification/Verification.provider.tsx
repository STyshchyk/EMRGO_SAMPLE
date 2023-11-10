import { createContext, PropsWithChildren, useContext } from "react";
import { useSearchParams } from "react-router-dom";

import { useToast } from "@emrgo-frontend/shared-ui";
import { useMutation } from "@tanstack/react-query";

import { resendEmail } from "./Verification.service";
import { IVerificationContext } from "./Verification.types";

const VerificationContext = createContext<IVerificationContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the Verification template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */

export const VerificationProvider = ({ children }: PropsWithChildren) => {
  const [searchParams] = useSearchParams();
  const userEmail = searchParams.get("email") || "";

  const { showErrorToast, showSuccessToast } = useToast();

  const { mutate: doResendEmail } = useMutation(resendEmail);

  const onResendEmail = () => {
    doResendEmail(userEmail, {
      onSuccess: () => {
        showSuccessToast("Resent Email successfully");
      },
      onError: () => {
        showErrorToast("Error while trying to Resend Email");
      },
    });
  };

  const state: IVerificationContext = {
    onResendEmail,
  };

  return <VerificationContext.Provider value={state}>{children}</VerificationContext.Provider>;
};

export const useVerificationContext = () => useContext(VerificationContext);
