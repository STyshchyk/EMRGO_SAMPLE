import { FC } from "react";

import { KYCShareholdersUBOComponent } from "./KYCShareholdersUBO.component";
import { KYCShareholdersUBOProvider } from "./KYCShareholdersUBO.provider";
import { IKYCShareholdersUBOProps } from "./KYCShareholdersUBO.types";

export const KYCShareholdersUBO: FC<IKYCShareholdersUBOProps> = ({}: IKYCShareholdersUBOProps) => {
  return (
    <KYCShareholdersUBOProvider>
      <KYCShareholdersUBOComponent />
    </KYCShareholdersUBOProvider>
  );
};
