import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { clientAuthenticationRoutes as routes } from "@emrgo-frontend/constants";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";

import { ResetPasswordOptionsSchema } from "./ResetPasswordOptions.schema";
import { resetPasswordWithPhone } from "./ResetPasswordOptions.service";
import {
  IResetPasswordOptionsContext,
  IResetPasswordOptionsPhoneValues,
} from "./ResetPasswordOptions.types";

const ResetPasswordOptionsContext = createContext<IResetPasswordOptionsContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const ResetPasswordOptionsProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const { mutate: doResetPasswordWithPhone } = useMutation(resetPasswordWithPhone);

  /**
   * Initial values for the form.
   */
  const initialValues: IResetPasswordOptionsPhoneValues = {
    email: email,
    options: null,
  };

  /**
   * @param values an object containing current form values
   * @returns void
   */
  const onSubmit = (values: IResetPasswordOptionsPhoneValues) => {
    const isPhone = values.options === "phone";

    if (isPhone) {
      delete values.options;
      doResetPasswordWithPhone(values, {
        onSuccess: () => {
          const generatedURI = encodeURI(`${routes.resetPasswordCodeFromText}?email=${email}`);
          navigate(generatedURI);
        },
        onError: () => {
          // TODO: wire up error message once error UI components are ready
        },
      });
    } else {
      const generatedURI = encodeURI(`${routes.resetPasswordCodeFromAuth}?email=${email}`);
      navigate(generatedURI);
    }
  };

  const form = useFormik<IResetPasswordOptionsPhoneValues>({
    initialValues,
    validateOnMount: true,
    validationSchema: ResetPasswordOptionsSchema,
    onSubmit,
  });

  const state: IResetPasswordOptionsContext = {
    form,
  };

  return (
    <ResetPasswordOptionsContext.Provider value={state}>
      {children}
    </ResetPasswordOptionsContext.Provider>
  );
};

export const useResetPasswordOptionsContext = () => useContext(ResetPasswordOptionsContext);
