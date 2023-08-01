// eslint-disable-next-line simple-import-sort/imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { clientAuthenticationRoutes as routes } from "@emrgo-frontend/constants";
// import { ToastProvider, UserProvider } from "@emrgo-frontend/shared-ui";
import { ToastProvider } from "@emrgo-frontend/shared-ui";
import { UserProvider } from "./components/UserContext"; //! using app level user context with further mfa checks
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { ChangeEmailVerification } from "./pages/ChangeEmailVerification";
import { CreatePassword } from "./pages/CreatePassword";
import { InvestorProfile } from "./pages/InvestorProfile";
import { Login } from "./pages/Login";
import { ResetPassword } from "./pages/ResetPassword";
import { ResetPasswordEmailConfirmation } from "./pages/ResetPasswordEmailConfirmation";
import { ResetPasswordOptions } from "./pages/ResetPasswordOptions";
import { ResetPasswordSixDigitCode } from "./pages/ResetPasswordSixDigitCode";
import { Signup } from "./pages/Signup";
import { TroubleSigningIn } from "./pages/TroubleSigningIn";
import { TroubleSigningInThanks } from "./pages/TroubleSigningInThanks";
import { Verification } from "./pages/Verification";
import { SetupMFA } from "./pages/SetupMFA";


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
    path: routes.signUp,
    element: <Signup />,
  },
  {
    path: routes.createPassword,
    element: <CreatePassword />,
  },
  {
    path: routes.setupTwoFactorAuth,
    element: <SetupMFA />,
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
    path: routes.resetPasswordEmailConfirmation,
    element: <ResetPasswordEmailConfirmation />,
  },
  {
    path: routes.registrationSucess,
    element: <Verification />,
  },
  {
    path: routes.investorProfile,
    element: <InvestorProfile />,
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
    path: routes.changePasswordVerification,
    element: <ChangeEmailVerification />,
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
