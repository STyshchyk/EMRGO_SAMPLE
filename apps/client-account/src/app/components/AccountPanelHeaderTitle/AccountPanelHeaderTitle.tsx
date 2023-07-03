import { FC } from "react";

import * as Styles from "./AccountPanelHeaderTitle.styles";
import { IAccountPanelHeaderTitleProps } from "./AccountPanelHeaderTitle.types";

export const AccountPanelHeaderTitle: FC<IAccountPanelHeaderTitleProps> = ({ children }) => {
  return <Styles.AccountPanelHeaderTitle>{children}</Styles.AccountPanelHeaderTitle>;
};
