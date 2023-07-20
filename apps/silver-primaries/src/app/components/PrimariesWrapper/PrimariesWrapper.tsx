import { FC } from "react";

import { SilverDashboardWrapper } from "@emrgo-frontend/shared-ui";

import { PrimariesWrapperComponent } from "./PrimariesWrapper.component";
import { PrimariesWrapperProvider } from "./PrimariesWrapper.provider";
import { IPrimariesWrapperProps } from "./PrimariesWrapper.types";

export const PrimariesWrapper: FC<IPrimariesWrapperProps> = ({
  children,
}: IPrimariesWrapperProps) => {
  return (
    <SilverDashboardWrapper>
      <PrimariesWrapperProvider>
        <PrimariesWrapperComponent />
      </PrimariesWrapperProvider>
    </SilverDashboardWrapper>
  );
};
