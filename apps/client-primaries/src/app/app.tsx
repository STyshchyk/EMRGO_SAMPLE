import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { clientPrimariesRoutes as routes } from "@emrgo-frontend/constants";
import { ToastProvider, UserProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { PostTrade } from "./pages/PostTrade";
import { TradeManagement } from "./pages/TradeManagement";
import { TradeOpportunities } from "./pages/TradeOpportunities";
import { Issuance } from "./pages/TradeOpportunities/Issuance";
import { IssuanceDataRoom } from "./pages/TradeOpportunities/IssuanceDataRoom";
import { Issuances } from "./pages/TradeOpportunities/Issuances";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Navigate to={routes.tradeOpportunities.home} replace={true} />,
  },
  // Trade Opportunities
  {
    path: routes.tradeOpportunities.home,
    element: <TradeOpportunities />,
  },
  {
    path: routes.tradeOpportunities.bank.issuances.home,
    element: <Issuances />,
  },
  {
    path: routes.tradeOpportunities.bank.issuances.details.home,
    element: <Issuance />,
  },
  {
    path: routes.tradeOpportunities.bank.issuances.details.dataRoom,
    element: <IssuanceDataRoom />,
  },
  // Trade Management
  {
    path: routes.tradeManagement.home,
    element: <TradeManagement />,
  },

  //  Post Trade
  {
    path: routes.postTrade.home,
    element: <PostTrade />,
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
