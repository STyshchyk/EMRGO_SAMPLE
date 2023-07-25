import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { ToastProvider, UserProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import routes from "./constants/routes";
import { CompleteRegistration } from "./pages/CompleteRegistration";
import { CreatePassword } from "./pages/CreatePassword";
import { Login } from "./pages/Login";
import { ResetPassword } from "./pages/ResetPassword";
import { ResetPasswordEmailConfirmation } from "./pages/ResetPasswordEmailConfirmation";
import { ResetPasswordOptions } from "./pages/ResetPasswordOptions";
import { TroubleSigningIn } from "./pages/TroubleSigningIn";
import { TroubleSigningInThanks } from "./pages/TroubleSigningInThanks";

const router = createBrowserRouter([
  {
    path: routes.auth.home,
    element: <Login />,
  },
  {
    path: routes.auth.login,
    element: <Login />,
  },
  {
    path: routes.auth.createPassword,
    element: <CreatePassword />,
  },
  {
    path: routes.auth.resetPassword,
    element: <ResetPassword />,
  },
  {
    path: routes.auth.resetPasswordOptions,
    element: <ResetPasswordOptions />,
  },
  {
    path: routes.auth.completeRegistration,
    element: <CompleteRegistration />,
  },
  {
    path: routes.auth.resetPasswordEmailConfirmation,
    element: <ResetPasswordEmailConfirmation />,
  },
  {
    path: routes.auth.troubleSigningIn,
    element: <TroubleSigningIn />,
  },
  {
    path: routes.auth.troubleSigningInThanks,
    element: <TroubleSigningInThanks />,
  },
  {
    path: "/*",
    element: <p>Error element</p>,
  },
  {
    index: true,
    element: <Navigate to={`${routes.auth.login}`} replace />,
  },
]);

function App() {
  const { isDarkMode } = useDarkMode();

  return (
    // eslint-disable-next-line react/jsx-no-undef
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles />
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
      <ToastProvider />
    </ThemeProvider>
  );
}

export default App;
