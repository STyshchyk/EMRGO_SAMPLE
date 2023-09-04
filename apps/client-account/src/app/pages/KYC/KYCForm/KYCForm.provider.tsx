import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { clientAccountRoutes as routes } from "@emrgo-frontend/constants";
import { useToast } from "@emrgo-frontend/shared-ui";
import { navigateModule } from "@emrgo-frontend/utils";

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
  const { showSuccessToast } = useToast();
  const sessionId = searchParams.get("session");
  const redirectPath = searchParams.get("redirect");
  const module = searchParams.get("module");

  const onSubmit = () => {
    showSuccessToast(`Submitting form, please wait. You will be redirected automatically`);
    setTimeout(() => {
      if (module && redirectPath) {
        navigateModule(module, redirectPath);
      } else {
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          const route = `${routes.kyc.home}?form=${typeFormId}`;
          navigate(route);
        }
      }
    }, 3000);
  };

  const state: IKYCFormContext = {
    typeFormId: typeFormId || "",
    sessionId: sessionId || "",
    onSubmit,
  };

  return <KYCFormContext.Provider value={state}>{children}</KYCFormContext.Provider>;
};

export const useKYCFormContext = () => useContext(KYCFormContext);
