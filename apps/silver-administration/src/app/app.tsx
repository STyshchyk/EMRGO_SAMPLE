import "./app.styles.css";

import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { silverAdministrationRoutes as routes } from "@emrgo-frontend/constants";
import {
  MessageContainer,
  SilverSecureMessaging,
  ToastProvider,
  UserProvider,
} from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { Administration } from "./pages";
import { User } from "./pages/Users";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Navigate to={routes.administration.users} replace={true} />,
  },
  {
    path: routes.administration.users,
    element: <Administration />,
    children: [
      {
        index: true,
        element: <User />,
      },
      {
        index: true,
        element: <Navigate to={routes.administration.users} replace />,
      },
    ],
  },
  {
    path: routes.secureMessaging.inbox.home,
    element: <SilverSecureMessaging />,
    children: [
      {
        path: routes.secureMessaging.inbox.id,
        element: <MessageContainer />,
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
