import { FC } from "react";

import * as Styles from "./AccountPanelText.styles";
import { IAccountPanelTextProps } from "./AccountPanelText.types";

export const AccountPanelText: FC<IAccountPanelTextProps> = ({ children }) => {
  return <Styles.AccountPanelText>{children}</Styles.AccountPanelText>;
};
