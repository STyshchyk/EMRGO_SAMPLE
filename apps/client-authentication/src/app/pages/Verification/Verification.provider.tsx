import { createContext, PropsWithChildren, useContext } from "react";

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
  const state: IVerificationContext = {};

  return <VerificationContext.Provider value={state}>{children}</VerificationContext.Provider>;
};

export const useVerificationContext = () => useContext(VerificationContext);
