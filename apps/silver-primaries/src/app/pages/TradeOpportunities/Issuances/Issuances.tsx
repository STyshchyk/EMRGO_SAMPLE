import { FC } from "react";

import { IssuancesComponent } from "./Issuances.component";
import { IssuancesProvider } from "./Issuances.provider";
import { IIssuancesProps } from "./Issuances.types";

export const Issuances: FC<IIssuancesProps> = ({}: IIssuancesProps) => {
  return (
    <IssuancesProvider>
      <IssuancesComponent />
    </IssuancesProvider>
  );
};
