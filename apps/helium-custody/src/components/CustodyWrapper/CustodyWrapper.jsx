import { SilverDashboardWrapper } from "@emrgo-frontend/shared-ui";

import { CustodyWrapperComponent } from "./CustodyWrapper.component";
import { CustodyWrapperProvider } from "./CustodyWrapper.provider";

export const CustodyWrapper = ({ children }) => {
  return (
    <SilverDashboardWrapper>
      <CustodyWrapperProvider>
        <CustodyWrapperComponent>{children}</CustodyWrapperComponent>
      </CustodyWrapperProvider>
    </SilverDashboardWrapper>
  );
};
