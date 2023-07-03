import { FC } from "react";

import * as Styles from "./PanelText.styles";
import { IPanelTextProps } from "./PanelText.types";

export const PanelText: FC<IPanelTextProps> = ({ children }) => {
  return <Styles.PanelText>{children}</Styles.PanelText>;
};
