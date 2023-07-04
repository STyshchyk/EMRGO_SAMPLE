import { FC } from "react";

import { Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { TwoFAstepper } from "../../../components/TwoFAstepper";
import { MFATYPE } from "../../../components/TwoFAstepper/TwoFAstepper.types";
import { useCompleteRegistrationContext } from "./CompleteRegistration.provider";
import * as Styles from "./CompleteRegistration.styles";
import { ICompleteRegistrationProps } from "./CompleteRegistration.types";

export const CompleteRegistrationComponent: FC<
  ICompleteRegistrationProps
> = ({}: ICompleteRegistrationProps) => {
  const { secret, otpauth_url } = ensureNotNull(useCompleteRegistrationContext());
  return (
    <Styles.CompleteRegistration>
      <Logo />
      {/*<TwoFactorAuth position={"absolute"} />*/}
      <TwoFAstepper mode={MFATYPE.enable} otpauth_url={otpauth_url} secret={secret} />
    </Styles.CompleteRegistration>
  );
};
