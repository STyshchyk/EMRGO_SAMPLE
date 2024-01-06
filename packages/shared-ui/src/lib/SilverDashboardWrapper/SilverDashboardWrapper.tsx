import { FC } from "react";

import { CustomThemeProvider } from "@emrgo-frontend/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { SilverDashboardWrapperComponent } from "./SilverDashboardWrapper.component";
import { SilverDashboardWrapperProvider } from "./SilverDashboardWrapper.provider";
import { ISilverDashboardWrapperProps } from "./SilverDashboardWrapper.types";

export const SilverDashboardWrapper: FC<ISilverDashboardWrapperProps> = ({
  children,
}: ISilverDashboardWrapperProps) => {
  return (
    <SilverDashboardWrapperProvider>
      <CustomThemeProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <SilverDashboardWrapperComponent>{children}</SilverDashboardWrapperComponent>
        </LocalizationProvider>
      </CustomThemeProvider>
    </SilverDashboardWrapperProvider>
  );
};
