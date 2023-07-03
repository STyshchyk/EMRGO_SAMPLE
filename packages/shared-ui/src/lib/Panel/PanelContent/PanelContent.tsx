import { FC } from "react";

import * as Styles from "./PanelContent.styles";
import { IPanelContentProps } from "./PanelContent.types";

export const PanelContent: FC<IPanelContentProps> = ({ children }: IPanelContentProps) => {
  return <Styles.PanelContent>{children}</Styles.PanelContent>;
};
