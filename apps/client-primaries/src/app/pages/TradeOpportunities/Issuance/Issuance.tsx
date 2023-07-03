import { FC } from "react";

import { PrimariesWrapper } from "../../../components/PrimariesWrapper/PrimariesWrapper";
import { IssuanceComponent } from "./Issuance.component";
import { IssuanceProvider } from "./Issuance.provider";
import { IIssuanceProps } from "./Issuance.types";

export const Issuance: FC<IIssuanceProps> = (props: IIssuanceProps) => {
  return (
    <PrimariesWrapper>
      <IssuanceProvider>
        <IssuanceComponent />
      </IssuanceProvider>
    </PrimariesWrapper>
  );
};
