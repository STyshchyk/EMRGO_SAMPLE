import { FC } from "react";

import { CustomThemeProvider } from "@emrgo-frontend/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { DashboardWrapperComponent } from "./DashboardWrapper.component";
import { DashboardWrapperProvider } from "./DashboardWrapper.provider";
import { IDashboardWrapperProps } from "./DashboardWrapper.types";

export const ClientDashboardWrapper: FC<IDashboardWrapperProps> = ({ children }) => {
  return (
    <DashboardWrapperProvider>
      <CustomThemeProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DashboardWrapperComponent>{children}</DashboardWrapperComponent>
        </LocalizationProvider>
      </CustomThemeProvider>
    </DashboardWrapperProvider>
  );
};
