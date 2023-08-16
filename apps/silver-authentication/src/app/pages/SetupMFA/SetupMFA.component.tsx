import { FC } from "react";

import {
Logo
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { TwoFactorAuth } from "../../components/TwoFactorAuth";
import { MFATYPE } from "../../components/TwoFactorAuth/TwoFactorAuth.types";
import { useSetupMFAContext } from "./SetupMFA.provider";
import * as Styles from "./SetupMFA.styles";
import { ISetupMFAProps } from "./SetupMFA.types";

export const SetupMFAComponent: FC<ISetupMFAProps> = (props: ISetupMFAProps) => {
  const {authenticatorURL, isQRCodeLoading,onEnableMFA,onVerifyMFA} = ensureNotNull(useSetupMFAContext());
  return (
    <Styles.SetupMFA>
        <Logo/>
        <TwoFactorAuth
          position={"relative"}
          mode={MFATYPE.enable}
          otpauth_url={authenticatorURL}
          isQRCodeLoading={isQRCodeLoading}
          onEnableMFA={onEnableMFA}
          onVerifyMFA={onVerifyMFA}
        />
    </Styles.SetupMFA>
  );
};
