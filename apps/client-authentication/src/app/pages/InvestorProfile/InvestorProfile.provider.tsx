import { createContext, PropsWithChildren, useContext } from "react";

import { IInvestorProfileContext } from "./InvestorProfile.types";

const InvestorProfileContext = createContext<IInvestorProfileContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the InvestorProfile template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const InvestorProfileProvider = ({ children }: PropsWithChildren) => {
  const state: IInvestorProfileContext = {};

  return (
    <InvestorProfileContext.Provider value={state}>{children}</InvestorProfileContext.Provider>
  );
};

export const useInvestorProfileContext = () => useContext(InvestorProfileContext);
