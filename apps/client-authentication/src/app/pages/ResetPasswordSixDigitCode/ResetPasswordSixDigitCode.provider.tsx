import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { clientAuthenticationRoutes as routes } from "@emrgo-frontend/constants";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";

import { ResetPasswordSixDigitCodeSchema } from "./ResetPasswordSixDigitCode.schema";
import { verifyOTP } from "./ResetPasswordSixDigitCode.service";
import {
  IResetPasswordSixDigitCodeContext,
  IResetPasswordSixDigitCodeProps,
  IResetPasswordSixDigitCodeValues,
} from "./ResetPasswordSixDigitCode.types";

const ResetPasswordSixDigitCodeContext = createContext<IResetPasswordSixDigitCodeContext | null>(
  null
);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const ResetPasswordSixDigitCodeProvider = ({
  method,
  children,
}: PropsWithChildren<IResetPasswordSixDigitCodeProps>) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const { mutate: doVerifyOTP } = useMutation(verifyOTP);

  /**
   * Initial values for the form.
   */
  const initialValues: IResetPasswordSixDigitCodeValues = {
    email: email,
    code: "",
    verificationType: method,
  };

  /**
   * @param values an object containing current form values
   * @returns void
   */
  const onSubmit = (values: IResetPasswordSixDigitCodeValues) => {
    doVerifyOTP(values, {
      onSuccess: (response) => {
        navigate(routes.resetPasswordEmailConfirmation);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          // const errorResponse = error?.response?.data.message;
          // TODO: wire up error message once error UI components are ready
        }
      },
    });
  };

  const form = useFormik<IResetPasswordSixDigitCodeValues>({
    initialValues,
    validateOnMount: true,
    validationSchema: ResetPasswordSixDigitCodeSchema,
    onSubmit,
  });

  const state: IResetPasswordSixDigitCodeContext = {
    form,
  };

  return (
    <ResetPasswordSixDigitCodeContext.Provider value={state}>
      {children}
    </ResetPasswordSixDigitCodeContext.Provider>
  );
};

export const useResetPasswordSixDigitCodeContext = () =>
  useContext(ResetPasswordSixDigitCodeContext);
