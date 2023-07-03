import { FC } from "react";

import * as Styles from "./PanelFooter.styles";
import { IPanelFooterProps } from "./PanelFooter.types";

export const PanelFooter: FC<IPanelFooterProps> = ({ children }: IPanelFooterProps) => {
  return <Styles.PanelFooter>{children}</Styles.PanelFooter>;
};
