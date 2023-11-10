import { FC } from "react";
import { Link } from "react-router-dom";

import { Disclaimer, Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useVerificationContext } from "./Verification.provider";
import * as Styles from "./Verification.styles";
import { IVerificationProps } from "./Verification.types";

export const VerificationComponent: FC<IVerificationProps> = (props: IVerificationProps) => {
  const { onResendEmail } = ensureNotNull(useVerificationContext())

  return (
    <Styles.Verification>
      <Logo />

      <Styles.Paragraph>Thanks for your registration.</Styles.Paragraph>

      <Styles.Paragraph>
        We have sent you an email with a verification link. Please follow that to activate your
        account.
      </Styles.Paragraph>

      <Styles.Paragraph>
        <Link to="#" onClick={() => onResendEmail()}>Click here</Link> to resend email.
      </Styles.Paragraph>

      <Styles.Spacer />

      <Disclaimer />
    </Styles.Verification>
  );
};
