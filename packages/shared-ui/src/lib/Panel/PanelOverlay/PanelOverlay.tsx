import { FC } from "react";

import * as Styles from "./PanelOverlay.styles";
import { IPanelOverlayProps } from "./PanelOverlay.types";

export const PanelOverlay: FC<IPanelOverlayProps> = ({ children }: IPanelOverlayProps) => {
  return <Styles.PanelOverlay>{children}</Styles.PanelOverlay>;
};
