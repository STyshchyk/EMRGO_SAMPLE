import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IInvestmentProfileThankYouContext } from "./InvestmentProfileThankYou.types";

const InvestmentProfileThankYouContext = createContext<IInvestmentProfileThankYouContext | null>(
  null
);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the InvestmentProfileThankYou template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const InvestmentProfileThankYouProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  const onGoBackToPlatform = () => {
    navigate("/");
  };

  const state: IInvestmentProfileThankYouContext = { onGoBackToPlatform };

  return (
    <InvestmentProfileThankYouContext.Provider value={state}>
      {children}
    </InvestmentProfileThankYouContext.Provider>
  );
};

export const useInvestmentProfileThankYouContext = () =>
  useContext(InvestmentProfileThankYouContext);
