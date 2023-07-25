import { FC } from "react";

import { SilverDashboardWrapper } from "@emrgo-frontend/shared-ui";

import { AdministrationWrapperComponent } from "./AdministrationWrapper.component";
import { AdministrationWrapperProvider } from "./AdministrationWrapper.provider";
import { IAdministrationWrapperProps } from "./AdministrationWrapper.types";

export const AdministrationWrapper: FC<IAdministrationWrapperProps> = ({
  children,
}: IAdministrationWrapperProps) => {
  return (
    <SilverDashboardWrapper>
      <AdministrationWrapperProvider>
        <AdministrationWrapperComponent>{children}</AdministrationWrapperComponent>
      </AdministrationWrapperProvider>
    </SilverDashboardWrapper>
  );
};
