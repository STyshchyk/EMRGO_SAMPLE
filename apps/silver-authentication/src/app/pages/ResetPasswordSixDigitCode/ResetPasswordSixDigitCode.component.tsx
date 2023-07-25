import { FC } from "react";

import { Button, Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { Heading, OneCol, SubHeading } from "../../components/Form";
import { LoginHelp } from "../../components/LoginHelp";
import { SixDigitCodeInput } from "../../components/SixDigitCodeInput";
import { useResetPasswordSixDigitCodeContext } from "./ResetPasswordSixDigitCode.provider";
import * as Styles from "./ResetPasswordSixDigitCode.styles";
import { IResetPasswordSixDigitCodeProps } from "./ResetPasswordSixDigitCode.types";

export const ResetPasswordSixDigitCodeComponent: FC<IResetPasswordSixDigitCodeProps> = ({
  method,
}: IResetPasswordSixDigitCodeProps) => {
  const { onSubmit } = ensureNotNull(useResetPasswordSixDigitCodeContext());

  return (
    <Styles.ResetPasswordSixDigitCode onSubmit={onSubmit}>
      <Logo />

      <div>
        <Heading>Reset your password</Heading>
        <SubHeading>
          {method === "auth" && "Enter the 6-digit verification code from your authenticator app."}
          {method === "text" &&
            "A text message with a 6-digit verification code has been sent to your mobile ending ***** 888 530."}
        </SubHeading>
      </div>

      <OneCol>
        <SixDigitCodeInput
          value=""
          onChange={() => {
            console.log("");
          }}
        />
      </OneCol>

      <OneCol>
        <Button size="large" disabled={false}>
          Next
        </Button>
      </OneCol>

      <Styles.Spacer />

      <LoginHelp />
    </Styles.ResetPasswordSixDigitCode>
  );
};
