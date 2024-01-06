import { FC } from "react";

import { SilverDashboardWrapper } from "@emrgo-frontend/shared-ui";

import { FilterProvider } from "../Context/filter-context";
import { SilverSecureMessagingComponent } from "./SilverSecureMessaging.component";
import { SilverSecureMessagingProvider } from "./SilverSecureMessaging.provider";
import { ISilverSecureMessagingProps } from "./SilverSecureMessaging.types";

export const SilverSecureMessaging: FC<
  ISilverSecureMessagingProps
> = ({}: ISilverSecureMessagingProps) => {
  return (
    <SilverDashboardWrapper>
      <FilterProvider>
        <SilverSecureMessagingProvider>
          <SilverSecureMessagingComponent />
        </SilverSecureMessagingProvider>
      </FilterProvider>
    </SilverDashboardWrapper>
  );
};
