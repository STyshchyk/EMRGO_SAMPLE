import { FC } from "react";
import { Link } from "react-router-dom";

import { clientAuthenticationRoutes as routes } from "@emrgo-frontend/constants";

import * as Styles from "./LoginHelp.styles";
import { ILoginHelpProps } from "./LoginHelp.types";

export const LoginHelp: FC<ILoginHelpProps> = (props: ILoginHelpProps) => (
  <Styles.HelpList>
    <Styles.HelpListItem>
      <Link to={routes.resetPassword}>Forgot password?</Link>
    </Styles.HelpListItem>

    <Styles.HelpListItem>
      Dont have an Account? <Link to={routes.signUp}>Sign up here</Link>
    </Styles.HelpListItem>
    <Styles.HelpListItem>
      Trouble signing in? <Link to={routes.troubleSigningIn}>Click here</Link>
    </Styles.HelpListItem>
  </Styles.HelpList>
);
