import { FC } from "react";

import { Button, Logo, SixDigitCodeInput } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { Heading, OneCol, SubHeading } from "../../components/Form";
import { LoginHelp } from "../../components/LoginHelp";
import { useResetPasswordSixDigitCodeContext } from "./ResetPasswordSixDigitCode.provider";
import * as Styles from "./ResetPasswordSixDigitCode.styles";
import { IResetPasswordSixDigitCodeProps } from "./ResetPasswordSixDigitCode.types";

export const ResetPasswordSixDigitCodeComponent: FC<IResetPasswordSixDigitCodeProps> = ({
  method,
}: IResetPasswordSixDigitCodeProps) => {
  const { form } = ensureNotNull(useResetPasswordSixDigitCodeContext());

  return (
    <Styles.ResetPasswordSixDigitCode onSubmit={form.handleSubmit}>
      <Logo />

      <div>
        <Heading>Reset your password</Heading>
        <SubHeading>
          {method === "authenticator" &&
            "Enter the 6-digit verification code from your authenticator app."}
          {method === "phone" &&
            "A text message with a 6-digit verification code has been sent to your mobile."}
        </SubHeading>
      </div>

      <OneCol>
        <SixDigitCodeInput
          value={form.values.code}
          onChange={(otp) => {
            form.setFieldValue("code", otp);
          }}
          variant="signup"
        />
      </OneCol>

      <OneCol>
        <Button size="large" disabled={!form.isValid}>
          Next
        </Button>
      </OneCol>

      <Styles.Spacer />

      <LoginHelp />
    </Styles.ResetPasswordSixDigitCode>
  );
};
