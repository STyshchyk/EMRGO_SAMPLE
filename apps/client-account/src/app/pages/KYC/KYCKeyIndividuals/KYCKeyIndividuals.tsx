import { FC } from "react";

import { KYCKeyIndividualsComponent } from "./KYCKeyIndividuals.component";
import { KYCKeyIndividualsProvider } from "./KYCKeyIndividuals.provider";
import { IKYCKeyIndividualsProps } from "./KYCKeyIndividuals.types";

export const KYCKeyIndividuals: FC<IKYCKeyIndividualsProps> = ({}: IKYCKeyIndividualsProps) => {
  return (
    <KYCKeyIndividualsProvider>
      <KYCKeyIndividualsComponent />
    </KYCKeyIndividualsProvider>
  );
};
