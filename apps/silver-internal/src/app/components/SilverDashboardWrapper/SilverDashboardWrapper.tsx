import { FC } from "react";

import { SilverDashboardWrapperComponent } from "./SilverDashboardWrapper.component";
import { SilverDashboardWrapperProvider } from "./SilverDashboardWrapper.provider";
import { IDashboardWrapperProps } from "./SilverDashboardWrapper.types";

export const SilverDashboardWrapper: FC<IDashboardWrapperProps> = ({}: IDashboardWrapperProps) => {
  return (
    <SilverDashboardWrapperProvider>
      <SilverDashboardWrapperComponent />
    </SilverDashboardWrapperProvider>
  );
};
