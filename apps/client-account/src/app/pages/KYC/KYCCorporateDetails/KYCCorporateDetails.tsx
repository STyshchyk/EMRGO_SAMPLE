import { FC } from "react";

import { KYCCorporateDetailsComponent } from "./KYCCorporateDetails.component";
import { KYCCorporateDetailsProvider } from "./KYCCorporateDetails.provider";
import { IKYCCorporateDetailsProps } from "./KYCCorporateDetails.types";

export const KYCCorporateDetails: FC<
  IKYCCorporateDetailsProps
> = ({}: IKYCCorporateDetailsProps) => {
  return (
    <KYCCorporateDetailsProvider>
      <KYCCorporateDetailsComponent />
    </KYCCorporateDetailsProvider>
  );
};
