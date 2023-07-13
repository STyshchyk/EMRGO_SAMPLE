import { FC } from "react";



import { AdministrationWrapper } from "../components/AdministrationWrapper";
import { AdministrationComponent } from "./Administration.component";
import { AdministrationProvider } from "./Administration.provider";
import { IAdministrationProps } from "./Administration.types";

export const Administration: FC<IAdministrationProps> = ({}: IAdministrationProps) => {
  return (
    <AdministrationWrapper>
      <AdministrationProvider>
        <AdministrationComponent />
      </AdministrationProvider>
    </AdministrationWrapper>
  );
};
