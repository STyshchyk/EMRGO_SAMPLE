import { FC } from "react";

import { KYCFormComponent } from "./KYCForm.component";
import { KYCFormProvider } from "./KYCForm.provider";
import { IKYCFormProps } from "./KYCForm.types";

export const KYCForm: FC<IKYCFormProps> = (props: IKYCFormProps) => {
  return (
    <KYCFormProvider>
      <KYCFormComponent />
    </KYCFormProvider>
  );
};
