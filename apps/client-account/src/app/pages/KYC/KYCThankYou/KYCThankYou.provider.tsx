import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IKYCThankYouContext } from "./KYCThankYou.types";

const KYCThankYouContext = createContext<IKYCThankYouContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the KycThankYou template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const KYCThankYouProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  const onGoBackToPlatform = () => {
    navigate("/");
  };

  const state: IKYCThankYouContext = { onGoBackToPlatform };

  return <KYCThankYouContext.Provider value={state}>{children}</KYCThankYouContext.Provider>;
};

export const useKYCThankYouContext = () => useContext(KYCThankYouContext);
