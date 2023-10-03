import { createContext, PropsWithChildren, useContext, useLayoutEffect,
useState,  } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { clientAuthenticationRoutes as routes } from "@emrgo-frontend/constants";
import { useToast } from "@emrgo-frontend/shared-ui";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useDarkMode } from "usehooks-ts";

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
  const { disable,enable } = useDarkMode();
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const type = searchParams.get("type") || "";
  const navigate = useNavigate();
  const { showErrorToast } = useToast();

  useLayoutEffect(() => {
    enable();
  }, []);

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
        if (type === "reset") {
          navigate(routes.login);
        } else {
          navigate(routes.setupTwoFactorAuth);
        }
      },
      onError: (response) => {
        console.log("🚀 ~ file: CreatePassword.provider.tsx:62 ~ onSubmit ~ response:", response);
        showErrorToast("Your token has expired. Please try again to get a new reset link");
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
    type,
  };

  return <CreatePasswordContext.Provider value={state}>{children}</CreatePasswordContext.Provider>;
};

export const useCreatePasswordContext = () => useContext(CreatePasswordContext);
