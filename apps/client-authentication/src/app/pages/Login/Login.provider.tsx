import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { clientAuthenticationRoutes as routes,clientCustodyRoutes as custodyRoutes } from "@emrgo-frontend/constants";
// import { useUser } from "@emrgo-frontend/shared-ui";
import { useToast } from "@emrgo-frontend/shared-ui";
// import { IMFA,IUser } from "@emrgo-frontend/types";
import { navigateModule } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useDarkMode } from "usehooks-ts";

import { useUser } from "../../components/UserContext"; //* using app level user context with further mfa checks
import { IUser } from "../../components/UserContext/UserContext.types";
import { IMFA, verifyMFA } from "../../services";
import { LoginCode, LoginSchema } from "./Login.schema";
import { loginUser } from "./Login.service";
import { ILoginCode, ILoginContext, ILoginFormValues } from "./Login.types";


const LoginContext = createContext<ILoginContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const LoginProvider = ({ children }: PropsWithChildren) => {
  const { showErrorToast } = useToast();
  const navigate = useNavigate();
  const { enable, disable } = useDarkMode();

  const { updateUser, setMFA } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [code, setCode] = useState<string | null>("");
  const { mutate: doLoginUser, isError, error } = useMutation(loginUser);
  const { mutate: doVerifyAuthenticatorMFA } = useMutation(verifyMFA);
  /**
   * Initial values for the form.
   */
  const initialValues: ILoginFormValues = {
    email: "",
    password: ""
  };
  const codeInitial: ILoginCode = {
    code: ""
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
        const MFA = user instanceof Object && "email" in user;
        if (!MFA || !user.mfaEnabled) {
          setMFA?.(response as unknown as IMFA);
          navigate(routes.setupTwoFactorAuth);
          return;
        }
        updateUser({ ...user as IUser  });
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      },
      onError: (err) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        showErrorToast(err?.response?.data?.message ?? "Error appeared during login");
      }
    });

  };

  const handleNext = (code: ILoginCode) => {
    if (!code) return;
    doVerifyAuthenticatorMFA(code, {
      onSuccess: (data) => {
        // navigateModule("primaries", routes.home);  
        navigateModule("custody", custodyRoutes.custody.onboarding.home);  
      },
      onError: () => {
        showErrorToast("Error while verifing mfa code");
      }
    });
    disable();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    enable();
  }, []);


  const form = useFormik<ILoginFormValues>({
    initialValues,
    validateOnMount: true,
    validationSchema: LoginSchema,
    onSubmit
  });
  const formCode = useFormik<ILoginCode>({
    initialValues: codeInitial,
    validateOnMount: true,
    enableReinitialize: true,
    validationSchema: LoginCode,
    onSubmit: handleNext
  });


  const state: ILoginContext = {
    form,
    formCode,
    showPassword,
    setShowPassword,
    activeStep,
    handleNext,
    handleBack,
    isError,
    error

  };

  return <LoginContext.Provider value={state}>{children}</LoginContext.Provider>;
};

export const useLoginContext = () => useContext(LoginContext);
