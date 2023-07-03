import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";

import { isValidEmail } from "@emrgo-frontend/utils";
import { IResetPasswordContext, IResetPasswordFormValues } from "./ResetPassword.types";

const ResetPasswordContext = createContext<IResetPasswordContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the ResetPassword template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const ResetPasswordProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  /**
   *
   * @param values an object containing current form values
   * @returns an object containing errors for each field
   */
  const validate = (values: IResetPasswordFormValues) => {
    const errors = {} as IResetPasswordFormValues;
    if (!values.email) {
      errors.email = "Email is required";
    }
    if (!isValidEmail(values.email)) {
      errors.email = "Email is invalid";
    }
    // TODO: Implement validation
    return errors;
  };

  /**
   * Initial values for the form.
   */
  const initialValues: IResetPasswordFormValues = {
    email: "",
  };

  /**
   * @param values an object containing current form values
   * @returns void
   *
   * TODO: Implement this code.
   *
   * This function is called when the form is submitted.
   * You can use this function to call an API to create a new user.
   * You can also use this function to navigate to the next page.
   *
   */
  const onSubmit = (values: IResetPasswordFormValues) => {
    console.log("Submitting");
    navigate("/reset-password-options");
    // TODO: Implement this code.
  };

  const form = useFormik<IResetPasswordFormValues>({
    initialValues,
    validateOnMount: true,
    validate,
    onSubmit,
  });

  const state: IResetPasswordContext = {
    form,
  };

  return <ResetPasswordContext.Provider value={state}>{children}</ResetPasswordContext.Provider>;
};

export const useResetPasswordContext = () => useContext(ResetPasswordContext);
