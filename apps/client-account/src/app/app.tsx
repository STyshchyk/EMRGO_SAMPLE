import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { clientAccountRoutes as routes } from "@emrgo-frontend/constants";
import { ToastProvider, UserProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { AccountSecurity } from "./pages/AccountSecurity";
import { DataRoom } from "./pages/DataRoom";
import { InvestmentProfile } from "./pages/InvestmentProfile";
import { InvestmentProfileForm } from "./pages/InvestmentProfile/InvestmentProfileForm";
import { InvestmentProfileThankYou } from "./pages/InvestmentProfile/InvestmentProfileThankYou";
import { KYC } from "./pages/KYC";
import { KYCForm } from "./pages/KYC/KYCForm";
import { PlatformAccess } from "./pages/PlatformAccess";
import { UserDetails } from "./pages/UserDetails";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Navigate to={routes.account.home} replace={true} />,
  },
  {
    path: routes.account.home,
    element: <Navigate to={routes.account.userDetails} replace={true} />,
  },
  {
    path: routes.account.userDetails,
    element: <UserDetails />,
  },
  {
    path: routes.account.accountSecurity,
    element: <AccountSecurity />,
  },
  {
    path: routes.account.platformAccess,
    element: <PlatformAccess />,
  },
  {
    path: routes.account.dataRoom,
    element: <DataRoom />,
  },
  {
    path: routes.clientInvestmentProfile.home,
    element: <InvestmentProfile />,
  },
  {
    path: routes.clientInvestmentProfile.form,
    element: <InvestmentProfileForm />,
  },
  {
    path: routes.clientInvestmentProfile.thankYou,
    element: <InvestmentProfileThankYou />,
  },
  {
    path: routes.kyc.home,
    element: <KYC />,
  },
  {
    path: routes.kyc.form,
    element: <KYCForm />,
  },
]);

export function App() {
  const { isDarkMode } = useDarkMode();
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
      <ToastProvider />
    </ThemeProvider>
  );
}

export default App;
