import { FC } from "react";

import { DashboardWrapperComponent } from "./DashboardWrapper.component";
import { DashboardWrapperProvider } from "./DashboardWrapper.provider";
import { IDashboardWrapperProps } from "./DashboardWrapper.types";

export const DashboardWrapper: FC<IDashboardWrapperProps> = ({}: IDashboardWrapperProps) => {
  return (
    <DashboardWrapperProvider>
      <DashboardWrapperComponent />
    </DashboardWrapperProvider>
  );
};
