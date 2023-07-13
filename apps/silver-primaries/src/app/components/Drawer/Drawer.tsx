import { FC } from "react";

import * as Styles from "./Drawer.styles";
import { IDrawerProps } from "./Drawer.types";

export const Drawer: FC<IDrawerProps> = ({ children, isOpen }) => {
  return <Styles.Drawer $isOpen={isOpen}>{children}</Styles.Drawer>;
};
