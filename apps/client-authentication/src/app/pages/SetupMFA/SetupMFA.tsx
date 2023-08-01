import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { SetupMFAComponent } from "./SetupMFA.component";
import { SetupMFAProvider } from "./SetupMFA.provider";
import { ISetupMFAProps } from "./SetupMFA.types";

export const SetupMFA: FC<ISetupMFAProps> = (props: ISetupMFAProps) => {
  return (
    <SetupMFAProvider>
      <AuthWrapper>
        <SetupMFAComponent />
      </AuthWrapper>
    </SetupMFAProvider>
  );
};
