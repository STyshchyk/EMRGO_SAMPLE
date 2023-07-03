import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IKYCKeyIndividualsContext } from "./KYCKeyIndividuals.types";

const KYCKeyIndividualsContext = createContext<IKYCKeyIndividualsContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the KYCKeyIndividuals template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const KYCKeyIndividualsProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const typeFormId = "C5kZ63J8";
  const entityId = "dec358dc-66a6-4795-887c-8cf1d9fa7905";

  const onSubmit = () => {
    navigate("/kyc");
  };

  const state: IKYCKeyIndividualsContext = { typeFormId, onSubmit, entityId };

  return (
    <KYCKeyIndividualsContext.Provider value={state}>{children}</KYCKeyIndividualsContext.Provider>
  );
};

export const useKYCKeyIndividualsContext = () => useContext(KYCKeyIndividualsContext);
