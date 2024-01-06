import { FC } from "react";

import { ClientDashboardWrapper } from "../ClientDashboardWrapper";
import { FilterProvider } from "../Context/filter-context";
import { ClientSecureMessagingComponent } from "./ClientSecureMessaging.component";
import { ClientSecureMessagingProvider } from "./ClientSecureMessaging.provider";
import { IClientSecureMessagingProps } from "./ClientSecureMessaging.types";

export const ClientSecureMessaging: FC<
  IClientSecureMessagingProps
> = ({}: IClientSecureMessagingProps) => {
  return (
    <ClientDashboardWrapper>
      <FilterProvider>
        <ClientSecureMessagingProvider>
          <ClientSecureMessagingComponent />
        </ClientSecureMessagingProvider>
      </FilterProvider>
    </ClientDashboardWrapper>
  );
};
