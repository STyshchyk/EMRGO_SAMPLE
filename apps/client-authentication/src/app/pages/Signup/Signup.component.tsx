import { FC } from "react";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { Link } from "react-router-dom";

import { Button, Checkbox, Disclaimer, Input, Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { Heading, OneCol, OneColCheck, SubHeading } from "../../components/Form";
import { useSignupContext } from "./Signup.provider";
import * as Styles from "./Signup.styles";
import { ISignupProps } from "./Signup.types";

export const SignupComponent: FC<ISignupProps> = (props: ISignupProps) => {
  const { form, onVerify } = ensureNotNull(useSignupContext());

  return (
    <Styles.SignupForm onSubmit={form.handleSubmit}>
      <Logo />

      <div>
        <Heading>Registration</Heading>
        <SubHeading>You are only one step away from the Emerging Markets.</SubHeading>
      </div>

      <Styles.TwoCol>
        <Input
          label="First Name"
          id="firstName"
          valid={form.touched.firstName && !form.errors.firstName}
          {...form.getFieldProps("firstName")}
          error={form.touched.firstName && form.errors.firstName}
        />
        <Input
          label="Last Name"
          id="lastName"
          valid={form.touched.lastName && !form.errors.lastName}
          {...form.getFieldProps("lastName")}
          error={form.touched.lastName && form.errors.lastName}
        />
      </Styles.TwoCol>

      <OneCol>
        <Input
          label="Corporate Legal Name"
          id="entityName"
          valid={form.touched.entityName && !form.errors.entityName}
          {...form.getFieldProps("entityName")}
          error={form.touched.entityName && form.errors.entityName}
        />
      </OneCol>

      <OneCol>
        <Input
          label="Corporate Email Address"
          id="email"
          valid={form.touched.email && !form.errors.email}
          {...form.getFieldProps("email")}
          error={form.touched.email && form.errors.email}
        />
      </OneCol>

      <GoogleReCaptcha onVerify={onVerify} />

      <OneColCheck>
        <Checkbox id="hasConfirmedClientType" {...form.getFieldProps("hasConfirmedClientType")}>
          I confirm that I am a <Link to="">Professional Client</Link> or a{" "}
          <Link to="">Market Counterparty</Link> as defined by the Dubai Financial Services
          Authority (DFSA)
        </Checkbox>
      </OneColCheck>

      <OneColCheck>
        <Checkbox id="hasAcceptedPrivacyPolicy" {...form.getFieldProps("hasAcceptedPrivacyPolicy")}>
          I consent to the use of my personal information according to the Emergo Privacy Policy
        </Checkbox>
      </OneColCheck>

      <OneCol>
        <Button
          size="large"
          disabled={
            !form.isValid ||
            form.values.captchaToken === "" ||
            !form.values.hasConfirmedClientType ||
            !form.values.hasAcceptedPrivacyPolicy
          }
        >
          Register
        </Button>
      </OneCol>
      <Disclaimer />
    </Styles.SignupForm>
  );
};