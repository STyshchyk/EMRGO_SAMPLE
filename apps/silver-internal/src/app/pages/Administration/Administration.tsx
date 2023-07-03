import { FC } from "react";

import { AdministrationComponent } from "./Administration.component";
import { AdministrationProvider } from "./Administration.provider";
import { IAdministrationProps } from "./Administration.types";

export const Administration: FC<IAdministrationProps> = ({}: IAdministrationProps) => {
  return (
    <AdministrationProvider>
      <AdministrationComponent />
    </AdministrationProvider>
  );
};
