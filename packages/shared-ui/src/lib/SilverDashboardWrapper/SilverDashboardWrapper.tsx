import { FC } from "react";

import { SilverDashboardWrapperComponent } from "./SilverDashboardWrapper.component";
import { SilverDashboardWrapperProvider } from "./SilverDashboardWrapper.provider";
import { ISilverDashboardWrapperProps } from "./SilverDashboardWrapper.types";

export const SilverDashboardWrapper: FC<ISilverDashboardWrapperProps> = ({
  children,
}: ISilverDashboardWrapperProps) => {
  return (
    <SilverDashboardWrapperProvider>
      <SilverDashboardWrapperComponent>{children}</SilverDashboardWrapperComponent>
    </SilverDashboardWrapperProvider>
  );
};
