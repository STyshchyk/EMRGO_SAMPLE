import { FC } from "react";

import { ClientDashboardWrapper } from "@emrgo-frontend/shared-ui";

import { PrimariesWrapperComponent } from "./PrimariesWrapper.component";
import { PrimariesWrapperProvider } from "./PrimariesWrapper.provider";
import { IPrimariesWrapperProps } from "./PrimariesWrapper.types";

export const PrimariesWrapper: FC<IPrimariesWrapperProps> = ({ children }) => {
  return (
    <ClientDashboardWrapper>
      <PrimariesWrapperProvider>
        <PrimariesWrapperComponent>{children}</PrimariesWrapperComponent>
      </PrimariesWrapperProvider>
    </ClientDashboardWrapper>
  );
};
