import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { clientAccountRoutes as routes } from "@emrgo-frontend/constants";

import { IKYCFormContext } from "./KYCForm.types";

const KYCFormContext = createContext<IKYCFormContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const KYCFormProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { typeFormId } = useParams();
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const sessionId = searchParams.get("session");

  const onSubmit = () => {
    const route = `${routes.clientInvestmentProfile.home}?form=${typeFormId}`;
    navigate(route);
  };

  const state: IKYCFormContext = {
    typeFormId: typeFormId || "",
    sessionId: sessionId || "",
    onSubmit,
  };

  return (
    <KYCFormContext.Provider value={state}>
      {children}
    </KYCFormContext.Provider>
  );
};

export const useKYCFormContext = () => useContext(KYCFormContext);
