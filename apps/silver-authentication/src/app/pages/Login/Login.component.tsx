import * as React from "react";
import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { silverAdministrationRoutes, silverRoles } from "@emrgo-frontend/constants";
import { ArrowBackwardIcon, Button, Checkbox, FormikInput, Logo, useToast } from "@emrgo-frontend/shared-ui";
import { IUser } from "@emrgo-frontend/types";
import { navigateSilverModule, silverModule } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useDarkMode } from "usehooks-ts";

import { Heading, OneCol, SubHeading } from "../../components/Form";
import { LoginHelp } from "../../components/LoginHelp";
import { SixDigitCodeInput } from "../../components/SixDigitCodeInput";
import routes from "../../constants/routes";
import { IMFA } from "../../services";
import { useUserStore } from "../store";
import { loginSchema } from "./Login.schema";
import { loginUser } from "./Login.services";
import * as Styles from "./Login.styles";
import { ILoginFormValues, ILoginProps } from "./Login.types";

const steps = [1, 2];
export const LoginComponent: FC<ILoginProps> = ({}: ILoginProps) => {
  const { showErrorToast } = useToast();
  const [activeStep, setActiveStep] = React.useState(0);
  const navigate = useNavigate();
  const { enable, disable } = useDarkMode();
  const { updateUser, removeUser, setMFA, mfa } = useUserStore();
  const { mutate: doLoginUser } = useMutation(loginUser);
  const [isPassShown, setPassShown] = useState(false);
  const onSubmit = (values: ILoginFormValues) => {
    doLoginUser(values, {
      onSuccess: (response) => {
        const user = response;
        //Check if user type implement IMFA interface, means mfa is not set
        //if user type iMFA or user has type IUSER and mfa is not enabled - redirect to MFa setup page
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if ("otpauth_url" in user || user?.user?.mfaEnabled && user.user.mfaEnabled === false) {
          navigate(routes.auth.completeRegistration);
          return;
        }
        // Update user, set verify MFA false. For futher MFA checking
        updateUser({ ...(user as IUser), verifyMFA: false });
        const navigateModileRole = silverRoles.find(role => user?.user?.role === role.key);
        //set light theme
        disable();
        navigateSilverModule(navigateModileRole?.module, navigateModileRole?.route);
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

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <Styles.LoginForm>
      <Logo />
      <Formik
        validateOnMount={true}
        enableReinitialize={true}
        initialValues={{
          email: "",
          password: "",
          code: "777777"
        }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({ values, setFieldValue, isValid, errors }) => (
          <Form>
            <React.Fragment>
              {activeStep === 0 && (
                <Styles.Form $isAligned={false}>
                  <div>
                    <Heading>Login</Heading>
                    <SubHeading>You&apos;re now ready to access Emrgo.</SubHeading>
                  </div>

                  <OneCol>
                    <Field
                      id="email"
                      name="email"
                      component={FormikInput}
                      as={"email"}
                      label={"Email Address"}
                    />
                  </OneCol>

                  <OneCol>
                    <Field
                      id="password"
                      name="password"
                      component={FormikInput}
                      as={"password"}
                      type={!isPassShown ? "password" : "text"}
                      label={"Password"}
                    />
                  </OneCol>
                  <OneCol>
                    <Checkbox
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassShown(e.target.checked)}
                    >
                      Show password
                    </Checkbox>
                  </OneCol>
                  <OneCol>
                    <Field
                      size="large"
                      type={"submit"}
                      component={Button}
                      disabled={errors.password || errors.email}
                      onClick={() => {
                        if (errors.password || errors.email) return;
                        handleNext();
                      }}
                    >
                      Submit
                    </Field>
                  </OneCol>
                  <OneCol>

                  </OneCol>


                </Styles.Form>
              )}

              {activeStep === 1 && (
                <Styles.Form $isAligned={true}>
                  <Styles.BackButton onClick={handleBack} type={"button"}>
                    <ArrowBackwardIcon />
                  </Styles.BackButton>
                  <Heading align={"center"}>Enter Security Code</Heading>
                  <SubHeading align={"center"}>
                    Enter the security code generated by your two-factor authentication app. You
                    will be provided a new security code every 30 seconds.
                  </SubHeading>
                  <OneCol>
                    <SixDigitCodeInput
                      value={values.code}
                      onChange={(value) => {
                        setFieldValue("code", value);

                        if (isValid) console.log("valid");
                      }}
                    />
                  </OneCol>
                  <OneCol>
                    <Field size="large" type={"submit"} component={Button} disabled={!isValid}>
                      Submit
                    </Field>
                  </OneCol>
                  <Styles.Spacer />
                  <Styles.HelpListItem>
                    <Link to={routes.auth.troubleSigningIn}>Raise support ticket</Link>
                  </Styles.HelpListItem>
                </Styles.Form>
              )}
            </React.Fragment>


          </Form>
        )}
      </Formik>
      <Styles.Spacer />
      <LoginHelp />
    </Styles.LoginForm>
  );
};
