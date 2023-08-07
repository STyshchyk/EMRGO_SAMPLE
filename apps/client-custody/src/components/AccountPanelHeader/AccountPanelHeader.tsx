import { FC } from "react";

import * as Styles from "./AccountPanelHeader.styles";
import { IAccountPanelHeaderProps } from "./AccountPanelHeader.types";

export const AccountPanelHeader: FC<IAccountPanelHeaderProps> = ({ children }) => {
  return <Styles.AccountPanelHeader>{children}</Styles.AccountPanelHeader>;
};
