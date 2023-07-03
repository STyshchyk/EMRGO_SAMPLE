import { createContext, PropsWithChildren, useContext, useState } from "react";

import { clientPrimariesRoutes as routes } from "@emrgo-frontend/constants";
import { useUser } from "@emrgo-frontend/shared-ui";
import { navigateModule } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";

import { LoginSchema } from "./Login.schema";
import { loginUser } from "./Login.service";
import { ILoginContext, ILoginFormValues } from "./Login.types";

const LoginContext = createContext<ILoginContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const LoginProvider = ({ children }: PropsWithChildren) => {
  const { updateUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: doLoginUser, isError, error } = useMutation(loginUser);

  /**
   * Initial values for the form.
   */
  const initialValues: ILoginFormValues = {
    email: "john.d@jdenterprises.com",
    password: "hellowolf122!",
    code: "777777",
  };

  /**
   * @param values an object containing current form values
   * @returns void
   *
   */
  const onSubmit = (values: ILoginFormValues) => {
    // navigateModule("primaries", routes.home);

    doLoginUser(values, {
      onSuccess: (response) => {
        const user = response.data.user;
        updateUser(user);
        navigateModule("primaries", routes.home);
      },
    });
  };

  const form = useFormik<ILoginFormValues>({
    initialValues,
    validateOnMount: true,
    validationSchema: LoginSchema,
    onSubmit,
  });

  const state: ILoginContext = {
    form,
    showPassword,
    setShowPassword,
    isError,
    error,
  };

  return <LoginContext.Provider value={state}>{children}</LoginContext.Provider>;
};

export const useLoginContext = () => useContext(LoginContext);
