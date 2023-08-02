import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { clientAuthenticationRoutes as routes } from "@emrgo-frontend/constants";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";

import { CreatePasswordSchema } from "./CreatePassword.schema";
import { createPassword } from "./CreatePassword.service";
import { ICreatePasswordContext, ICreatePasswordFormValues } from "./CreatePassword.types";

const CreatePasswordContext = createContext<ICreatePasswordContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const CreatePasswordProvider = ({ children }: PropsWithChildren) => {
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const { mutate: doCreatePassword } = useMutation(createPassword);

  /**
   * Initial values for the form.
   */
  const initialValues: ICreatePasswordFormValues = {
    password: "",
    confirmPassword: "",
    token: token,
  };

  /**
   * @param values an object containing current form values
   * @returns void
   */
  const onSubmit = (values: ICreatePasswordFormValues) => {
    delete values.confirmPassword;
    doCreatePassword(values, {
      onSuccess: () => {
        //* navigate to twofactor auth page instead
        // navigate(routes.login);
        navigate(routes.setupTwoFactorAuth)
      },
      onError: () => {
        // TODO: wire up error message once error UI components are ready
      },
    });
  };

  const form = useFormik<ICreatePasswordFormValues>({
    initialValues,
    validateOnMount: true,
    validationSchema: CreatePasswordSchema,
    onSubmit,
  });

  const state: ICreatePasswordContext = {
    form,
    showPassword,
    setShowPassword,
  };

  return <CreatePasswordContext.Provider value={state}>{children}</CreatePasswordContext.Provider>;
};

export const useCreatePasswordContext = () => useContext(CreatePasswordContext);
