import "./app.styles.css";

import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { silverOnboardingRoutes as routes } from "@emrgo-frontend/constants";
import { ToastProvider, UserProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { Onboarding } from "./pages/Onboarding";
import { OnboardingUser } from "./pages/Onboarding/OnboardingUser";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Navigate to={routes.onboarding.users} replace />,
  },
  {
    path: routes.onboarding.home,
    element: <Onboarding />,
    children: [
      {
        path: routes.onboarding.users,
        element: <OnboardingUser />,
      },
    ],
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
