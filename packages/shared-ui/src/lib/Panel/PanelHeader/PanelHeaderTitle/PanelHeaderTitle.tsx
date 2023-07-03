import { FC } from "react";

import * as Styles from "./PanelHeaderTitle.styles";
import { IPanelHeaderTitleProps } from "./PanelHeaderTitle.types";

export const PanelHeaderTitle: FC<IPanelHeaderTitleProps> = ({
  children,
}: IPanelHeaderTitleProps) => {
  return <Styles.PanelHeaderTitle>{children}</Styles.PanelHeaderTitle>;
};
