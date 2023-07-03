import { FC } from "react";

import { Button, Disclaimer, Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull, processAPIErrors } from "@emrgo-frontend/utils";

import { FormError, FormErrorIcon, OneCol, SubHeading } from "../../components/Form";
import { useChangeEmailVerificationContext } from "./ChangeEmailVerification.provider";
import * as Styles from "./ChangeEmailVerification.styles";
import { IChangeEmailVerificationProps } from "./ChangeEmailVerification.types";

export const ChangeEmailVerificationComponent: FC<IChangeEmailVerificationProps> = (
  props: IChangeEmailVerificationProps
) => {
  const { isLoading, isError, error, redirectToLogin } = ensureNotNull(
    useChangeEmailVerificationContext()
  );

  return (
    <Styles.ChangeEmailVerification>
      <Logo />

      {isLoading ? (
        <SubHeading>Verifying...</SubHeading>
      ) : (
        <div>
          {isError ? (
            <FormError>
              <FormErrorIcon />
              <span>{processAPIErrors(error)}</span>
            </FormError>
          ) : (
            <SubHeading>
              Thank you for verifying your new email. You can now login with your new credentials.
            </SubHeading>
          )}
        </div>
      )}
      <OneCol>
        <Button size="large" onClick={() => redirectToLogin()}>
          Back to Login
        </Button>
      </OneCol>

      <Styles.Spacer />

      <Disclaimer />
    </Styles.ChangeEmailVerification>
  );
};
