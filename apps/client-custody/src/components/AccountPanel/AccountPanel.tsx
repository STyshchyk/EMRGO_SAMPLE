import { FC } from "react";

import * as Styles from "./AccountPanel.styles";
import { IAccountPanelProps } from "./AccountPanel.types";

export const AccountPanel: FC<IAccountPanelProps> = ({ children }) => {
  return <Styles.AccountPanel>{children}</Styles.AccountPanel>;
};
