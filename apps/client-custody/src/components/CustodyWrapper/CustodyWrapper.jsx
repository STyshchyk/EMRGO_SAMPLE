import { ClientDashboardWrapper } from "@emrgo-frontend/shared-ui";

import { CustodyWrapperComponent } from "./CustodyWrapper.component";
import { CustodyWrapperProvider } from "./CustodyWrapper.provider";

export const CustodyWrapper = ({ children }) => {
  return (
    <ClientDashboardWrapper>
      <CustodyWrapperProvider>
        <CustodyWrapperComponent>{children}</CustodyWrapperComponent>
      </CustodyWrapperProvider>
    </ClientDashboardWrapper>
  );
};
