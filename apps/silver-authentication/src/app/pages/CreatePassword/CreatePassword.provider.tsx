import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { silverAuthenticationRoutes } from "@emrgo-frontend/constants";
import { useToast } from "@emrgo-frontend/shared-ui";
import { navigateSilverModule, silverModule } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";

import { useUserStore } from "../store";
import { CreatePasswordSchema } from "./CreatePassword.schema";
import { createPassword, ISetPassword } from "./CreatePassword.services";
import { ICreatePasswordContext, ICreatePasswordFormValues } from "./CreatePassword.types";

const CreatePasswordContext = createContext<ICreatePasswordContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the CreatePassword template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const CreatePasswordProvider = ({ children }: PropsWithChildren) => {
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Initial values for the form.
   */
  const initialValues: ICreatePasswordFormValues = {
    password: "",
    confirmPassword: "",
  };
  const { showErrorToast } = useToast();

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
  const url = window.location;
  const access_token = new URLSearchParams(url.search).get("token") || "";
  const { mutate: doCreatePassword } = useMutation(createPassword);

  const onSubmit = (values: ICreatePasswordFormValues) => {
    const password = values.password;
    const payload: ISetPassword = {
      password,
      token: access_token,
    };
    doCreatePassword(payload, {
      onSuccess: (response) => {
        navigateSilverModule(
          silverModule.authentication,
          silverAuthenticationRoutes.completeRegistration
        );
      },
      onError: (error) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        showErrorToast(`${error?.data.message ?? "Error during creating password"}`);
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
