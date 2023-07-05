import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { silverPrimariesRoutes as routes } from "@emrgo-frontend/constants";
import { ToastProvider, UserProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { TradeOpportunities } from "./pages/TradeOpportunities";
import { Issuances } from "./pages/TradeOpportunities/Issuances";
import { ManageIssuers } from "./pages/TradeOpportunities/ManageIssuers";
import { ManageSellside } from "./pages/TradeOpportunities/ManageSellside";
import { PrimariesWrapper } from "./components/PrimariesWrapper";



const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Navigate to={routes.tradeOpportunity.home} replace={true} />
  },
  {
    path: routes.tradeOpportunity.home,
    element: <PrimariesWrapper />,
    children: [
      {
        index: true,
        element: <TradeOpportunities />
      },
      {
        path: routes.tradeOpportunity.issuances,
        element: <Issuances />
      },
      {
        path: routes.tradeOpportunity.manageIssuers,
        element: <ManageIssuers />
      },
      {
        path: routes.tradeOpportunity.manageSellside,
        element: <ManageSellside />
      },
      {
        index: true,
        element: <Navigate to={`${routes.tradeOpportunity.home}`} replace />
      }
    ]
  }


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
