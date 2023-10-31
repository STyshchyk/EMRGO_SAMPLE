import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { supportTypes } from "@emrgo-frontend/constants";
import { createSupportTicket } from "@emrgo-frontend/services";
import {
  useToast
} from "@emrgo-frontend/shared-ui";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";

import { TroubleSigningInSchema } from "./TroubleSigningIn.schema";
import { ITroubleSigningInContext,ITroubleSigningInFormValues } from "./TroubleSigningIn.types";

const TroubleSigningInContext = createContext<ITroubleSigningInContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the TroubleSigningIn template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const TroubleSigningInProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const { mutate: doCreateSupportTicket } = useMutation(createSupportTicket);


  const initialValues: ITroubleSigningInFormValues = {
    type: supportTypes.LOGIN_SUPPORT_TICKET,
    email: "",
    desc: ""
  };

  const onSubmit = (values: ITroubleSigningInFormValues) => {
    doCreateSupportTicket(values, {
      onSuccess: (response) => {
        showSuccessToast("Successfully created a support ticket.");
        navigate("/trouble-signing-in-thanks");
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.status === 412) {
          showErrorToast(error.response?.data?.message);
        }        
        return error 
      },
    });
  };


  const form = useFormik<ITroubleSigningInFormValues>({
    initialValues,
    validateOnMount: true,
    validationSchema: TroubleSigningInSchema,
    onSubmit,
  });


  const state: ITroubleSigningInContext = {
    form,
  };

  return (
    <TroubleSigningInContext.Provider value={state}>{children}</TroubleSigningInContext.Provider>
  );
};

export const useTroubleSigningInContext = () => useContext(TroubleSigningInContext);
