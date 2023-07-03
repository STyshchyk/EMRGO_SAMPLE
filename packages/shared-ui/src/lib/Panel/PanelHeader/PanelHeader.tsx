import { FC } from "react";

import * as Styles from "./PanelHeader.styles";
import { IPanelHeaderProps } from "./PanelHeader.types";

export const PanelHeader: FC<IPanelHeaderProps> = ({ children }: IPanelHeaderProps) => {
  return <Styles.PanelHeader>{children}</Styles.PanelHeader>;
};
