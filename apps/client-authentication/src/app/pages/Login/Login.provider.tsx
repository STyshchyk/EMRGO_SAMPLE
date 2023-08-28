import { createContext, PropsWithChildren, useContext, useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

import { clientAuthenticationRoutes as routes } from "@emrgo-frontend/constants";
// import { useUser } from "@emrgo-frontend/shared-ui";
import { useToast } from "@emrgo-frontend/shared-ui";
// import { IMFA,IUser } from "@emrgo-frontend/types";
import { navigateModule } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useDarkMode } from "usehooks-ts";

import { useUser } from "../../components/UserContext"; //* using app level user context with further mfa checks
import { IUser } from "../../components/UserContext/UserContext.types";
import { IMFA } from "../../services";
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
  const { showErrorToast } = useToast();
  const navigate = useNavigate();
  const { enable,disable } = useDarkMode();

  const { updateUser, setMFA } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const { mutate: doLoginUser, isError, error } = useMutation(loginUser);

  /**
   * Initial values for the form.
   */
  const initialValues: ILoginFormValues = {
    email: "helen@emrgo.com",
    password: "hellowolf122!",
    code: null,
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

        updateUser({ ...user as IUser, verifyMFA: false });
        disable();
        navigateModule("primaries", routes.home);  //* navigate to custody once dashboard is ready
      },
      onError: (response) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        showErrorToast(response?.data?.message ?? "Error appeared during login");
      }
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
  enable()
  }, [])
  

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
    activeStep,
    handleNext,
    handleBack,
    isError,
    error,
  };

  return <LoginContext.Provider value={state}>{children}</LoginContext.Provider>;
};

export const useLoginContext = () => useContext(LoginContext);
