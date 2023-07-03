import { FC } from "react";

import { Button, Logo, RadioButton } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { LoginHelp } from "../..//components/LoginHelp";
import { Heading, OneCol, SubHeading } from "../../components/Form";
import { useResetPasswordOptionsContext } from "./ResetPasswordOptions.provider";
import * as Styles from "./ResetPasswordOptions.styles";
import { IResetPasswordOptionsProps } from "./ResetPasswordOptions.types";

export const ResetPasswordOptionsComponent: FC<IResetPasswordOptionsProps> = (
  props: IResetPasswordOptionsProps
) => {
  const { form } = ensureNotNull(useResetPasswordOptionsContext());

  return (
    <Styles.ResetPasswordOptionsForm onSubmit={form.handleSubmit}>
      <Logo />

      <div>
        <Heading>Reset your password</Heading>
        <SubHeading>Now choose how you’d like to receive your OTP.</SubHeading>
      </div>

      <OneCol>
        <RadioButton {...form.getFieldProps("options")} value="phone">
          Text message via your phone
        </RadioButton>
      </OneCol>

      <OneCol>
        <RadioButton {...form.getFieldProps("options")} value="authenticator">
          From your authenticator app
        </RadioButton>
      </OneCol>

      <OneCol>
        <Button size="large" disabled={!form.isValid}>
          Next
        </Button>
      </OneCol>

      <Styles.Spacer />

      <LoginHelp />
    </Styles.ResetPasswordOptionsForm>
  );
};
