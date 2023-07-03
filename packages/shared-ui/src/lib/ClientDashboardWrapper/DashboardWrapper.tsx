import { FC } from "react";

import { DashboardWrapperComponent } from "./DashboardWrapper.component";
import { DashboardWrapperProvider } from "./DashboardWrapper.provider";
import { IDashboardWrapperProps } from "./DashboardWrapper.types";

export const ClientDashboardWrapper: FC<IDashboardWrapperProps> = ({ children }) => {
  return (
    <DashboardWrapperProvider>
      <DashboardWrapperComponent>{children}</DashboardWrapperComponent>
    </DashboardWrapperProvider>
  );
};
