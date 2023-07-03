import { FC } from "react";

import { Button, FormikInput, Logo } from "@emrgo-frontend/shared-ui";

import { LoginHelp } from "../../../components/LoginHelp";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { Heading, OneCol, SubHeading } from "../../../components/Form";
import { useResetPasswordContext } from "./ResetPassword.provider";
import * as Styles from "./ResetPassword.styles";
import { IResetPasswordFormValues, IResetPasswordProps } from "./ResetPassword.types";

export const ResetPasswordComponent: FC<IResetPasswordProps> = ({}: IResetPasswordProps) => {
  const { form } = ensureNotNull(useResetPasswordContext());

  return (
    <Styles.ResetPasswordForm onSubmit={form.handleSubmit}>
      <Logo />

      <div>
        <Heading>Reset your password</Heading>
        <SubHeading>
          To reset your password, enter your account&apos;s verified email address.
        </SubHeading>
      </div>

      <OneCol>
        <FormikInput<IResetPasswordFormValues>
          form={form}
          id="email"
          label="Email Address"
          maxWidth={458}
          type="email"
        />
      </OneCol>

      <OneCol>
        <Button size="large" disabled={!form.isValid}>
          Next
        </Button>
      </OneCol>

      <Styles.Spacer />

      <LoginHelp />
    </Styles.ResetPasswordForm>
  );
};
