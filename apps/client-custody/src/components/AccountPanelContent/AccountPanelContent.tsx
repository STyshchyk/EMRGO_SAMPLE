import { FC } from "react";

import * as Styles from "./AccountPanelContent.styles";
import { IAccountPanelContentProps } from "./AccountPanelContent.types";

export const AccountPanelContent: FC<IAccountPanelContentProps> = ({ children, className }) => {
  return <Styles.AccountPanelContent className={className}>{children}</Styles.AccountPanelContent>;
};
