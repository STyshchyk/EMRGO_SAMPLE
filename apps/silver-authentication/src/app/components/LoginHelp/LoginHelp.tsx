import { FC } from "react";
import { Link } from "react-router-dom";

import * as Styles from "./LoginHelp.styles";
import { ILoginHelpProps } from "./LoginHelp.types";

export const LoginHelp: FC<ILoginHelpProps> = (props: ILoginHelpProps) => (
  <Styles.HelpList>
    <Styles.HelpListItem>
      <Link to="/reset-password">Forgot password?</Link>
    </Styles.HelpListItem>

    <Styles.HelpListItem>
      Trouble signing in? <Link to="/trouble-signing-in">Click here</Link>
    </Styles.HelpListItem>
  </Styles.HelpList>
);
