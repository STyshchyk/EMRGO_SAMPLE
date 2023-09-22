import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { silverAuthenticationRoutes, silverRoles } from "@emrgo-frontend/constants";
// import { useUser } from "@emrgo-frontend/shared-ui";
import { useToast, useUser } from "@emrgo-frontend/shared-ui";
import { IUser } from "@emrgo-frontend/types";
// import { IMFA,IUser } from "@emrgo-frontend/types";
import { navigateSilverModule } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useDarkMode } from "usehooks-ts";

import { IMFA, verifyMFA } from "../../services";
import { LoginCode, LoginSchema } from "./Login.schema";
import { loginUser } from "./Login.services";
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

  const { updateUser, setMFA, user: LoggedUser } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isTFAModalOpen, setTFAModalOpen] = useState<boolean>(false);
  const [code, setCode] = useState<string | null>("");
  const { mutate: doLoginUser, isError, error } = useMutation(loginUser);
  const { mutate: doVerifyAuthenticatorMFA } = useMutation(verifyMFA);
  /**
   * Initial values for the form.
   */
  const initialValues: ILoginFormValues = {
    email: "",
    password: "",
  };
  const codeInitial: ILoginCode = {
    code: "",
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
        console.log(user);
        const MFA = user instanceof Object && "email" in user;
        if (!MFA || !user.mfaEnabled) {
          setMFA?.(response as unknown as IMFA);
          navigate(silverAuthenticationRoutes.completeRegistration);
          return;
        }
        updateUser({ ...(user as IUser) });
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      },
      onError: (response) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        showErrorToast(response?.response?.data?.message ?? "Error appeared during login");
      },
    });
  };

  const handleNext = (code: ILoginCode) => {
    if (!code) return;
    doVerifyAuthenticatorMFA(code, {
      onSuccess: (data) => {
        disable();
        const user: IUser = LoggedUser;
        const navigateModileRole = silverRoles.find((role) => user?.role === role.key);
        if (!navigateModileRole) {
          showErrorToast("Module not found");
          return;
        }
        if (!user) {
          showErrorToast("User is not found, return to login page");
          return;
        }
        navigateSilverModule(navigateModileRole?.module, navigateModileRole?.route);
      },
      onError: () => {
        showErrorToast("Error while verifing mfa code");
      },
    });
    disable();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const openTFASupportTicketModal = () => {
    setTFAModalOpen(true);
  };

  const closeTFASupportTicketModal = () => {
    setTFAModalOpen(false);
  };

  useEffect(() => {
    enable();
  }, []);

  const form = useFormik<ILoginFormValues>({
    initialValues,
    validateOnMount: true,
    validationSchema: LoginSchema,
    onSubmit,
  });
  const formCode = useFormik<ILoginCode>({
    initialValues: codeInitial,
    validateOnMount: true,
    enableReinitialize: true,
    validationSchema: LoginCode,
    onSubmit: handleNext,
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
    error,
    isTFAModalOpen,
    openTFASupportTicketModal,
    closeTFASupportTicketModal,
  };

  return <LoginContext.Provider value={state}>{children}</LoginContext.Provider>;
};

export const useLoginContext = () => useContext(LoginContext);
