import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IResetPasswordOptionsContext } from "./ResetPasswordOptions.types";

const ResetPasswordOptionsContext = createContext<IResetPasswordOptionsContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the ResetPasswordOptions template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const ResetPasswordOptionsProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  const state: IResetPasswordOptionsContext = {
    isButtonEnabled: true,
    onSubmit: () => {
      navigate("/reset-password-code-from-auth");
    },
  };

  return (
    <ResetPasswordOptionsContext.Provider value={state}>
      {children}
    </ResetPasswordOptionsContext.Provider>
  );
};

export const useResetPasswordOptionsContext = () => useContext(ResetPasswordOptionsContext);
