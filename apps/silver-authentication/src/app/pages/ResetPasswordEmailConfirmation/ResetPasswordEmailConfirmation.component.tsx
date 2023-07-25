import { FC } from "react";

import { Disclaimer, Logo } from "@emrgo-frontend/shared-ui";

import { Heading, SubHeading } from "../../components/Form";
import * as Styles from "./ResetPasswordEmailConfirmation.styles";
import { IResetPasswordEmailConfirmationProps } from "./ResetPasswordEmailConfirmation.types";

export const ResetPasswordEmailConfirmationComponent: FC<
  IResetPasswordEmailConfirmationProps
> = ({}: IResetPasswordEmailConfirmationProps) => {
  return (
    <Styles.ResetPasswordEmailConfirmation>
      <Logo />

      <div>
        <Heading>Reset your password</Heading>
        <SubHeading>We’ve sent a password reset link to your email.</SubHeading>
      </div>

      <Styles.Spacer />

      <Disclaimer />
    </Styles.ResetPasswordEmailConfirmation>
  );
};
