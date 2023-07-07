import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import * as constants from "@emrgo-frontend/constants";
import { useToast, useUser } from "@emrgo-frontend/shared-ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { reverse } from "named-urls";

import { createFormSession, fetchKYCForms } from "./KYC.services";
import { IKYCContext, IKYCSection } from "./KYC.types";

const KYCContext = createContext<IKYCContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const KYCProvider = ({ children }: PropsWithChildren) => {
  const { user } = useUser();
  const firstName = user?.firstName || "";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccessToast } = useToast();

  const { data: kycForms, refetch } = useQuery({
    staleTime: Infinity,
    queryKey: [constants.queryKeys.account.kyc.fetch],
    queryFn: () => fetchKYCForms(),
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutate: doCreateFormSession } = useMutation(createFormSession);

  const forms = kycForms?.forms;

  const onStartForm = (formId: string, formReferenceId: string) => {
    const requestPayload = {
      formReferenceId,
    };

    doCreateFormSession(requestPayload, {
      onSuccess: (response) => {
        const sessionId = response.sessionId;

        const route = `${reverse(constants.clientAccountRoutes.kyc.form, {
          typeFormId: formId,
        })}/?session=${sessionId}`;

        navigate(route);
      },
    });
  };

  const onSubmit = () => {
    navigate("thank-you");
  };

  useEffect(() => {
    if (searchParams.has("form")) {
      const callbackFormId = searchParams.get("form");
      if (callbackFormId) {
        searchParams.delete("form");
        if (kycForms) {
          const completedForm = kycForms?.forms.find(
            (form: IKYCSection) => form.formId === callbackFormId
          );
          showSuccessToast(`Successfully completed KYC ${completedForm?.label} form`);

          setTimeout(() => {
            refetch();
          }, 1000);
        }
        setSearchParams(searchParams);
      }
    } else {
      refetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const state: IKYCContext = {
    forms,
    firstName,
    onStartForm,
    onSubmit,
  };

  return <KYCContext.Provider value={state}>{children}</KYCContext.Provider>;
};

export const useKYCContext = () => useContext(KYCContext);
