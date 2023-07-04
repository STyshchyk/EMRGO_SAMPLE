import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IResetPasswordSixDigitCodeContext } from "./ResetPasswordSixDigitCode.types";

const ResetPasswordSixDigitCodeContext = createContext<IResetPasswordSixDigitCodeContext | null>(
  null
);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the ResetPasswordSixDigitCode template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const ResetPasswordSixDigitCodeProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const state: IResetPasswordSixDigitCodeContext = {
    onSubmit: () => {
      navigate("/reset-password-email-confirmation");
    },
  };

  return (
    <ResetPasswordSixDigitCodeContext.Provider value={state}>
      {children}
    </ResetPasswordSixDigitCodeContext.Provider>
  );
};

export const useResetPasswordSixDigitCodeContext = () =>
  useContext(ResetPasswordSixDigitCodeContext);
