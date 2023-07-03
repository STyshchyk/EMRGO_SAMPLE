// eslint-disable-next-line simple-import-sort/imports
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ToastProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";
import routes from "./constants/routes";
import { DataRoom } from "./pages/DataRoom";
import { Platform } from "./pages/DataRoom/Platform";
import { Onboarding } from "./pages/Onboarding";
import { OnboardingUser } from "./pages/Onboarding/OnboardingUser";
import { Primaries } from "./pages/Primaries";
import { PostTrade } from "./pages/Primaries/PostTrade";
import { TradeManagement } from "./pages/Primaries/TradeManagement";
import { TradeOpportunities } from "./pages/Primaries/TradeOpportunities";
import { Issuances } from "./pages/Primaries/TradeOpportunities/Issuances";
import { ManageIssuers } from "./pages/Primaries/TradeOpportunities/ManageIssuers";
import { ManageSellside } from "./pages/Primaries/TradeOpportunities/ManageSellside";

import { DashboardWrapper } from "./components/DashboardWrapper";
import { Administration } from "./pages/Administration";
import { User } from "./pages/Administration/Users";
import { CompleteRegistration } from "./pages/Authentication/CompleteRegistration";
import { CreatePassword } from "./pages/Authentication/CreatePassword";
import { Login } from "./pages/Authentication/Login";

import { ResetPassword } from "./pages/Authentication/ResetPassword";
import { ResetPasswordEmailConfirmation } from "./pages/Authentication/ResetPasswordEmailConfirmation";
import { ResetPasswordOptions } from "./pages/Authentication/ResetPasswordOptions";
import { TroubleSigningIn } from "./pages/Authentication/TroubleSigningIn";
import { TroubleSigningInThanks } from "./pages/Authentication/TroubleSigningInThanks";
import { OpportunitiesDocs } from "./pages/DataRoom/OpportunitiesDocs";
import { ManageDocuments } from "./pages/DataRoom/OpportunitiesDocs/ManageDocuments";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardWrapper />,
    children: [
      {
        path: routes.dash.onboarding.home,
        element: <Onboarding />,
        children: [
          {
            path: routes.dash.onboarding.users,
            element: <OnboardingUser />
          },
          {
            index: true,
            element: <Navigate to={routes.dash.onboarding.users} replace />
          }
        ]
      },
      {
        path: routes.dash.dataRoom.home,
        element: <DataRoom />,
        children: [
          {
            path: routes.dash.dataRoom.platform,
            element: <Platform />
          },
          {
            path: routes.dash.dataRoom.manageDocuments,
            element: <ManageDocuments />
          },
          {
            path: routes.dash.dataRoom.opportunities,
            element: <OpportunitiesDocs />
          },
          {
            index: true,
            element: <Navigate to={routes.dash.dataRoom.platform} replace />
          }
        ]
      },
      {
        path: routes.dash.administration.home,
        element: <Administration />,
        children: [
          {
            path: routes.dash.administration.users,
            element: <User />
          },
          {
            index: true,
            element: <Navigate to={routes.dash.administration.users} replace />
          }
        ]
      },
      {
        path: routes.dash.primaries.home,
        element: <Primaries />,
        children: [
          {
            path: routes.dash.primaries.tradeOpportunityHome,
            element: <TradeOpportunities />
          },
          {
            path: routes.dash.primaries.tradeOpportunity.issuances,
            element: <Issuances />
          },
          {
            path: routes.dash.primaries.tradeOpportunity.manageIssuers,
            element: <ManageIssuers />
          },
          {
            path: routes.dash.primaries.tradeOpportunity.manageSellside,
            element: <ManageSellside />
          },
          {
            path: routes.dash.primaries.tradeManagement,
            element: <TradeManagement />
          },
          {
            path: routes.dash.primaries.postTrade,
            element: <PostTrade />
          },
          {
            index: true,
            element: <Navigate to={`${routes.dash.primaries.tradeOpportunityHome}`} replace />
          }
        ]
      },
      {
        index: true,
        errorElement: <p>Error element</p>,
        element: <Navigate to={`${routes.dash.administration.users}`} replace />
      },
      {
        path: "/*",
        element: <p>Error element</p>
      }
    ]
  },

  {
    path: routes.auth.createPassword,
    element: <CreatePassword />
  },
  {
    path: routes.auth.login,
    element: <Login />
  },
  {
    path: routes.auth.resetPassword,
    element: <ResetPassword />
  },
  {
    path: routes.auth.resetPasswordOptions,
    element: <ResetPasswordOptions />
  },
  {
    path: routes.auth.completeRegistration,
    element: <CompleteRegistration />
  },
  {
    path: routes.auth.resetPasswordEmailConfirmation,
    element: <ResetPasswordEmailConfirmation />
  },
  {
    path: routes.auth.troubleSigningIn,
    element: <TroubleSigningIn />
  },
  {
    path: routes.auth.troubleSigningInThanks,
    element: <TroubleSigningInThanks />
  },
  {
    path: "/*",
    element: <p>Error element</p>
  },
  {
    index: true,
    element: <Navigate to={`${routes.auth.login}`} replace />
  }

]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: 3,
      staleTime: 5 * 1000
    }
  }
});

function App() {
  const { isDarkMode } = useDarkMode();

  return (
    // eslint-disable-next-line react/jsx-no-undef
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <GlobalStyles />
        <ToastProvider />
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>

  );
}

export default App;
