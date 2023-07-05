import { FC } from "react";

import { IAdministrationWrapperProps } from "./AdministrationWrapper.types";
import { AdministrationWrapperProvider } from "./AdministrationWrapper.provider";
import { AdministrationWrapperComponent } from "./AdministrationWrapper.component";
import { SilverDashboardWrapper } from "@emrgo-frontend/shared-ui";

export const AdministrationWrapper: FC<IAdministrationWrapperProps> = ({ children }: IAdministrationWrapperProps) => {
  return (
    <SilverDashboardWrapper>
      <AdministrationWrapperProvider>
        <AdministrationWrapperComponent>{children}</AdministrationWrapperComponent>
      </AdministrationWrapperProvider>
    </SilverDashboardWrapper>
  );
};
