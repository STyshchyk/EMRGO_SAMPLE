import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IKYCCorporateDetailsContext } from "./KYCCorporateDetails.types";

const KYCCorporateDetailsContext = createContext<IKYCCorporateDetailsContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the KYCCorporateDetails template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const KYCCorporateDetailsProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const typeFormId = "C5kZ63J8";
  const entityId = "dec358dc-66a6-4795-887c-8cf1d9fa7905";

  const onSubmit = () => {
    navigate("/kyc");
  };

  const state: IKYCCorporateDetailsContext = { typeFormId, onSubmit, entityId };

  return (
    <KYCCorporateDetailsContext.Provider value={state}>
      {children}
    </KYCCorporateDetailsContext.Provider>
  );
};

export const useKYCCorporateDetailsContext = () => useContext(KYCCorporateDetailsContext);
