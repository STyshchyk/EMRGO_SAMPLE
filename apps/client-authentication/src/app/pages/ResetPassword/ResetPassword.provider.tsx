import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { clientAuthenticationRoutes as routes } from "@emrgo-frontend/constants";
import { useFormik } from "formik";

import { ResetPasswordSchema } from "./ResetPassword.schema";
import { IResetPasswordContext, IResetPasswordFormValues } from "./ResetPassword.types";

const ResetPasswordContext = createContext<IResetPasswordContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const ResetPasswordProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  /**
   * Initial values for the form.
   */
  const initialValues: IResetPasswordFormValues = {
    email: "",
  };

  /**
   * @param values an object containing current form values
   * @returns void
   */
  const onSubmit = (values: IResetPasswordFormValues) => {
    const generatedURI = encodeURI(`${routes.resetPasswordOptions}?email=${values.email}`);
    navigate(generatedURI);
  };

  const form = useFormik<IResetPasswordFormValues>({
    initialValues,
    validateOnMount: true,
    validationSchema: ResetPasswordSchema,
    onSubmit,
  });

  const state: IResetPasswordContext = {
    form,
  };

  return <ResetPasswordContext.Provider value={state}>{children}</ResetPasswordContext.Provider>;
};

export const useResetPasswordContext = () => useContext(ResetPasswordContext);
