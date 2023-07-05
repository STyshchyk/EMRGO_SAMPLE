import { createContext, PropsWithChildren, useContext } from "react";

import { IResetPasswordEmailConfirmationContext } from "./ResetPasswordEmailConfirmation.types";

const ResetPasswordEmailConfirmationContext =
  createContext<IResetPasswordEmailConfirmationContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the ResetPasswordEmailConfirmation template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const ResetPasswordEmailConfirmationProvider = ({ children }: PropsWithChildren) => {
  const state: IResetPasswordEmailConfirmationContext = {};

  return (
    <ResetPasswordEmailConfirmationContext.Provider value={state}>
      {children}
    </ResetPasswordEmailConfirmationContext.Provider>
  );
};

export const useResetPasswordEmailConfirmationContext = () =>
  useContext(ResetPasswordEmailConfirmationContext);
