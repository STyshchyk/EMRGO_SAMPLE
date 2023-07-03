import { FC } from "react";

import { Button, Logo, RadioButton } from "@emrgo-frontend/shared-ui";

import { LoginHelp } from "../../../components/LoginHelp";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { Heading, OneCol, OneColCheck, SubHeading } from "../../../components/Form";
import { useResetPasswordOptionsContext } from "./ResetPasswordOptions.provider";
import * as Styles from "./ResetPasswordOptions.styles";
import { IResetPasswordOptionsProps } from "./ResetPasswordOptions.types";

export const ResetPasswordOptionsComponent: FC<
  IResetPasswordOptionsProps
> = ({}: IResetPasswordOptionsProps) => {
  const { isButtonEnabled, onSubmit } = ensureNotNull(useResetPasswordOptionsContext());

  return (
    <Styles.ResetPasswordOptionsForm onSubmit={onSubmit}>
      <Logo />

      <div>
        <Heading>Reset your password</Heading>
        <SubHeading>Now choose how you’d like to receive your OTP.</SubHeading>
      </div>

      <OneCol>
        <RadioButton name="options">Text message via your phone</RadioButton>
      </OneCol>

      <OneCol>
        <RadioButton name="options">From your authenticator app</RadioButton>
      </OneCol>

      <OneCol>
        <Button size="large" disabled={!isButtonEnabled}>
          Next
        </Button>
      </OneCol>

      <Styles.Spacer />

      <LoginHelp />
    </Styles.ResetPasswordOptionsForm>
  );
};
