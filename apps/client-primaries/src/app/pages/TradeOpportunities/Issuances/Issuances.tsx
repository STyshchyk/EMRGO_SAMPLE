import { FC } from "react";

import { PrimariesWrapper } from "../../../components/PrimariesWrapper/PrimariesWrapper";
import { IssuancesComponent } from "./Issuances.component";
import { IssuancesProvider } from "./Issuances.provider";
import { IIssuancesProps } from "./Issuances.types";

export const Issuances: FC<IIssuancesProps> = (props: IIssuancesProps) => {
  return (
    <PrimariesWrapper>
      <IssuancesProvider>
        <IssuancesComponent />
      </IssuancesProvider>
    </PrimariesWrapper>
  );
};
