import { createContext, PropsWithChildren, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { clientAuthenticationRoutes as routes } from "@emrgo-frontend/constants";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";

import { SignupSchema } from "./Signup.schema";
import { registerEntity } from "./Signup.service";
import { ISignupContext, ISignupFormValues } from "./Signup.types";

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
const SignupContext = createContext<ISignupContext | null>(null);

export const SignupProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { mutate: doRegisterEntity } = useMutation(registerEntity);

  /**
   * Initial values for the form.
   */
  const initialValues: ISignupFormValues = {
    firstName: "",
    lastName: "",
    entityName: "",
    email: "",
    hasConfirmedClientType: false,
    hasAcceptedPrivacyPolicy: false,
    captchaToken: "",
  };

  /**
   * @param values an object containing current form values
   * @returns void
   * This function is called when the form is submitted.
   */
  const onSubmit = (values: ISignupFormValues) => {
    doRegisterEntity(values, {
      onSuccess: () => {
        navigate(routes.registrationSucess);
      },
      onError: () => {
        // TODO: wire up error message once error UI components are ready
      },
    });
  };

  const form = useFormik<ISignupFormValues>({
    initialValues,
    validateOnMount: true,
    validationSchema: SignupSchema,
    onSubmit,
    validateOnChange: false,
  });

  const onVerify = useCallback((token: string) => {
    form.setFieldValue("captchaToken", token);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const state: ISignupContext = {
    form,
    onVerify,
  };

  return <SignupContext.Provider value={state}>{children}</SignupContext.Provider>;
};

export const useSignupContext = () => useContext(SignupContext);
