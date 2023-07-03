import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IKYCSupportingDocumentsContext } from "./KYCSupportingDocuments.types";

const KYCSupportingDocumentsContext = createContext<IKYCSupportingDocumentsContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the KYCSupportingDocuments template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const KYCSupportingDocumentsProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const typeFormId = "C5kZ63J8";
  const entityId = "dec358dc-66a6-4795-887c-8cf1d9fa7905";

  const onSubmit = () => {
    navigate("/kyc");
  };

  const state: IKYCSupportingDocumentsContext = { typeFormId, onSubmit, entityId };

  return (
    <KYCSupportingDocumentsContext.Provider value={state}>
      {children}
    </KYCSupportingDocumentsContext.Provider>
  );
};

export const useKYCSupportingDocumentsContext = () => useContext(KYCSupportingDocumentsContext);
