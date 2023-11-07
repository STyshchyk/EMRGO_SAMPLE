import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { silverAuthenticationRoutes as routes } from "@emrgo-frontend/constants";
import { ToastProvider, UserProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles } from "@emrgo-frontend/theme";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { ResetPasswordSixDigitCode } from "../../../client-authentication/src/app/pages/ResetPasswordSixDigitCode";
import { CreatePassword } from "./pages/CreatePassword";
import { Login } from "./pages/Login";
import { ResetPassword } from "./pages/ResetPassword";
import { ResetPasswordEmailConfirmation } from "./pages/ResetPasswordEmailConfirmation";
import { ResetPasswordOptions } from "./pages/ResetPasswordOptions";
import { SetupMFA } from "./pages/SetupMFA";
import { TroubleSigningIn } from "./pages/TroubleSigningIn";
import { TroubleSigningInThanks } from "./pages/TroubleSigningInThanks";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Login />,
  },
  {
    path: routes.login,
    element: <Login />,
  },
  {
    path: routes.createPassword,
    element: <CreatePassword />,
  },
  {
    path: routes.resetPassword,
    element: <ResetPassword />,
  },
  {
    path: routes.resetPasswordOptions,
    element: <ResetPasswordOptions />,
  },
  {
    path: routes.resetPasswordCodeFromAuth,
    element: <ResetPasswordSixDigitCode method="authenticator" />,
  },
  {
    path: routes.resetPasswordCodeFromText,
    element: <ResetPasswordSixDigitCode method="phone" />,
  },
  {
    path: routes.completeRegistration,
    element: <SetupMFA />,
  },
  {
    path: routes.resetPasswordEmailConfirmation,
    element: <ResetPasswordEmailConfirmation />,
  },
  {
    path: routes.troubleSigningIn,
    element: <TroubleSigningIn />,
  },
  {
    path: routes.troubleSigningInThanks,
    element: <TroubleSigningInThanks />,
  },
  {
    path: "/*",
    element: <p>Error element</p>,
  },
  {
    index: true,
    element: <Navigate to={`${routes.login}`} replace />,
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
