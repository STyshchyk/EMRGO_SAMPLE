import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { silverPrimariesRoutes as routes } from "@emrgo-frontend/constants";
import { ToastProvider, UserProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { PrimariesWrapper } from "./components/PrimariesWrapper";
import { TradeManagement } from "./pages/TradeManagement";
import { TradeOpportunities } from "./pages/TradeOpportunities";
import { Issuances } from "./pages/TradeOpportunities/Issuances";
import { ManageIssuers } from "./pages/TradeOpportunities/ManageIssuers";
import { ManageSellside } from "./pages/TradeOpportunities/ManageSellside";
import { TradeInterestComponent } from "./pages/TradeOpportunities/TradeInteretsTable";



const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Navigate to={routes.primaries.tradeOpportunity.home} replace={true} />
  },
  {
    path: routes.primaries.home,
    element: <PrimariesWrapper />,
    children: [
      {
        path: routes.primaries.tradeOpportunity.home,
        element: <TradeOpportunities />
      },
      {
        path: routes.primaries.tradeOpportunity.tradeTickets,
        element: <p>asdasd</p>
      },
      {
        path: routes.primaries.tradeOpportunity.issuances,
        element: <Issuances />
      },
      {
        path: routes.primaries.tradeOpportunity.manageIssuers,
        element: <ManageIssuers />
      },
      {
        path: routes.primaries.tradeOpportunity.details.home,
        element: <TradeInterestComponent />
      },
      {
        path: routes.primaries.tradeOpportunity.manageSellside,
        element: <ManageSellside />
      },
      {
        path: routes.primaries.tradeManagement.home,
        element: <TradeManagement/>
      },
    ]
  }


]);

export function App() {
  const { isDarkMode } = useDarkMode();

  return (
    <ThemeProvider theme={ lightTheme}>
      <GlobalStyles />
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
      <ToastProvider />
    </ThemeProvider>
  );
}

export default App;
