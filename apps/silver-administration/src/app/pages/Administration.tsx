import { FC } from "react";

import { SilverDashboardWrapper } from "@emrgo-frontend/shared-ui";

import { AdministrationComponent } from "./Administration.component";
import { AdministrationProvider } from "./Administration.provider";
import { IAdministrationProps } from "./Administration.types";
import { AdministrationWrapper } from "../components/AdministrationWrapper";

export const Administration: FC<IAdministrationProps> = ({}: IAdministrationProps) => {
  return (
    <AdministrationWrapper>
      <AdministrationProvider>
        <AdministrationComponent />
      </AdministrationProvider>
    </AdministrationWrapper>
  );
};
