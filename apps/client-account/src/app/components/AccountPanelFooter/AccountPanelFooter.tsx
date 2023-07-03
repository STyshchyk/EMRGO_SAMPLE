import { FC } from "react";

import * as Styles from "./AccountPanelFooter.styles";
import { IAccountPanelFooterProps } from "./AccountPanelFooter.types";

export const AccountPanelFooter: FC<IAccountPanelFooterProps> = ({ children }) => {
  return <Styles.AccountPanelFooter>{children}</Styles.AccountPanelFooter>;
};
