import * as React from "react";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

import { silverAdministrationRoutes } from "@emrgo-frontend/constants";
import { ArrowBackwardIcon, Button, FormikInput, Logo, useToast } from "@emrgo-frontend/shared-ui";
import { navigateSilverModule, silverModule } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useDarkMode } from "usehooks-ts";

import { Heading, OneCol, SubHeading } from "../../components/Form";
import { LoginHelp } from "../../components/LoginHelp";
import { SixDigitCodeInput } from "../../components/SixDigitCodeInput";
import routes from "../../constants/routes";
import { IMFA } from "../../services";
import { IUser, useUserStore } from "../store";
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

  const onSubmit = (values: ILoginFormValues) => {
    doLoginUser(values, {
      onSuccess: (response) => {
        const user = response;
        //Check if user type implement IMFA interface, means mfa is not set
        const MFA = response instanceof Object && "email" in response;
        //if user type iMFA or user has type IUSER and mfa is not enabled - redirect to MFa setup page
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!MFA || !user.mfaEnabled) {
          setMFA(response as IMFA);
          navigate(routes.auth.completeRegistration);
          return;
        }
        // Update user, set verify MFA false. For futher MFA checking
        updateUser({ ...user as IUser, verifyMFA: false });
        //set light theme
        disable();
        // window.location.assign(routes.dash.administration.users);
        navigateSilverModule(silverModule.administration, silverAdministrationRoutes.home);
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
        enableReinitialize={true}
        initialValues={{
          email: "",
          password: "",
          code: ""
        }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({ values, setFieldValue, isValid }) => (
          <Form>
            <React.Fragment>
              {activeStep === 0 && (
                <Styles.LoginForm $isAligned={false}>
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
                      label={"Enter Email"}
                    />
                  </OneCol>

                  <OneCol>
                    <Field
                      id="password"
                      name="password"
                      component={FormikInput}
                      as={"password"}
                      type={"password"}
                      label={"Enter Password"}
                    />
                  </OneCol>

                  <OneCol>
                    <Field
                      size="large"
                      type={"submit"}
                      component={Button}
                      onClick={handleNext}
                    >
                      Submit
                    </Field>
                  </OneCol>


                </Styles.LoginForm>
              )}

              {activeStep === 1 && (
                <Styles.LoginForm $isAligned={true}>
                  <Styles.BackButton onClick={handleBack} type={"button"}>
                    <ArrowBackwardIcon />
                  </Styles.BackButton>
                  <Heading align={"center"}>Enter Security Code</Heading>
                  <SubHeading align={"center"}>
                    Enter the security code generated by your two-factor authentication app. You will be
                    provided a new security code every 30 seconds.
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
                    <Field
                      size="large"
                      type={"submit"}
                      component={Button}
                      disabled={!isValid}
                    >
                      Submit
                    </Field>
                  </OneCol>
                  <Styles.Spacer />
                  <Styles.HelpListItem>
                    <Link to={routes.dash.administration.home}>Raise support ticket</Link>
                  </Styles.HelpListItem>
                </Styles.LoginForm>
              )}
            </React.Fragment>
            <Styles.Spacer />
            <LoginHelp />

          </Form>

        )}
      </Formik>

    </Styles.LoginForm>
  );
};