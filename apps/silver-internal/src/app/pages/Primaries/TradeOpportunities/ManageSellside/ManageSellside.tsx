import { FC } from "react";

import { ManageSellsideComponent } from "./ManageSellside.component";
import { ManageSellsideProvider } from "./ManageSellside.provider";
import { IManageSellsideProps } from "./ManageSellside.types";

export const ManageSellside: FC<IManageSellsideProps> = ({}: IManageSellsideProps) => {
  return (
    <ManageSellsideProvider>
      <ManageSellsideComponent />
    </ManageSellsideProvider>
  );
};
