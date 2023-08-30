import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { clientAccountRoutes as routes } from "@emrgo-frontend/constants";
import { navigateModule } from "@emrgo-frontend/utils";

import { IInvestmentProfileFormContext } from "./InvestmentProfileForm.types";

const InvestmentProfileFormContext = createContext<IInvestmentProfileFormContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const InvestmentProfileFormProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { typeFormId } = useParams();
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const sessionId = searchParams.get("session");
  const redirectPath = searchParams.get("redirect");
  const module = searchParams.get("module");

  const onSubmit = () => {
    if (module && redirectPath) {
      navigateModule(module, redirectPath);
    } else {
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        const route = `${routes.clientInvestmentProfile.home}?form=${typeFormId}`;
        navigate(route);
      }
    }
  };

  const state: IInvestmentProfileFormContext = {
    typeFormId: typeFormId || "",
    sessionId: sessionId || "",
    onSubmit,
  };

  return (
    <InvestmentProfileFormContext.Provider value={state}>
      {children}
    </InvestmentProfileFormContext.Provider>
  );
};

export const useInvestmentProfileFormContext = () => useContext(InvestmentProfileFormContext);
