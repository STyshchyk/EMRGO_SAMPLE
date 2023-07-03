import { FC } from "react";

import * as Styles from "./Transition.styles";
import { ITransitionProps } from "./Transition.types";

export const Transition: FC<ITransitionProps> = ({ children, isVisible }: ITransitionProps) => {
  return <Styles.Transition $isVisible={isVisible}>{children}</Styles.Transition>;
};
