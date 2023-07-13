import { FC } from "react";

import { ManageIssuersComponent } from "./ManageIssuers.component";
import { ManageIssuersProvider } from "./ManageIssuers.provider";
import { IManageIssuersProps } from "./ManageIssuers.types";

export const ManageIssuers: FC<IManageIssuersProps> = ({}: IManageIssuersProps) => {
  return (
    <ManageIssuersProvider>
      <ManageIssuersComponent />
    </ManageIssuersProvider>
  );
};
