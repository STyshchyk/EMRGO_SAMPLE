import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { silverDataRoomRoutes as routes } from "@emrgo-frontend/constants";
import { ToastProvider, UserProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { DataRoom } from "./pages";
import { OpportunitiesDocs } from "./pages/OpportunitiesDocs";
import { ManageDocuments } from "./pages/OpportunitiesDocs/ManageDocuments";
import { Platform } from "./pages/Platform";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Navigate to={routes.dataRoom.platform} replace />,
  },
  {
    path: routes.dataRoom.home,
    element: <DataRoom />,
    children: [
      {
        path: routes.dataRoom.platform,
        element: <Platform />,
      },
      {
        path: routes.dataRoom.manageDocuments,
        element: <ManageDocuments />,
      },
      {
        path: routes.dataRoom.opportunities,
        element: <OpportunitiesDocs />,
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
