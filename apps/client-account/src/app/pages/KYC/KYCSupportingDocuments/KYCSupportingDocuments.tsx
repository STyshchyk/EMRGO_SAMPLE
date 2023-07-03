import { FC } from "react";

import { KYCSupportingDocumentsComponent } from "./KYCSupportingDocuments.component";
import { KYCSupportingDocumentsProvider } from "./KYCSupportingDocuments.provider";
import { IKYCSupportingDocumentsProps } from "./KYCSupportingDocuments.types";

export const KYCSupportingDocuments: FC<
  IKYCSupportingDocumentsProps
> = ({}: IKYCSupportingDocumentsProps) => {
  return (
    <KYCSupportingDocumentsProvider>
      <KYCSupportingDocumentsComponent />
    </KYCSupportingDocumentsProvider>
  );
};
