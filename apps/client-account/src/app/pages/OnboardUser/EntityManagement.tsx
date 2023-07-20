import { FC } from "react";

import { AccountsWrapper } from "../../components/AccountsWrapper/AccountsWrapper";
import { EntityManagementComponent } from "./EntityManagement.component";
import { EntityManagementProvider } from "./EntityManagement.provider";
import { IEntityManagementProps } from "./EntityManagement.types";

export const EntityManagement: FC<IEntityManagementProps> = ({}: IEntityManagementProps) => {
  return (
    <AccountsWrapper>
        <EntityManagementProvider>
          <EntityManagementComponent />
        </EntityManagementProvider>
    </AccountsWrapper>
  );
};
