import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IKYCShareholdersUBOContext } from "./KYCShareholdersUBO.types";

const KYCShareholdersUBOContext = createContext<IKYCShareholdersUBOContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the KYCShareholdersUBO template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const KYCShareholdersUBOProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const typeFormId = "C5kZ63J8";
  const entityId = "dec358dc-66a6-4795-887c-8cf1d9fa7905";

  const onSubmit = () => {
    navigate("/kyc");
  };

  const state: IKYCShareholdersUBOContext = { typeFormId, onSubmit, entityId };

  return (
    <KYCShareholdersUBOContext.Provider value={state}>
      {children}
    </KYCShareholdersUBOContext.Provider>
  );
};

export const useKYCShareholdersUBOContext = () => useContext(KYCShareholdersUBOContext);
