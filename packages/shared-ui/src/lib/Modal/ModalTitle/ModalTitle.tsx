import { FC } from "react";

import * as Styles from "./ModalTitle.styles";
import { IModalTitleProps } from "./ModalTitle.types";

export const ModalTitle: FC<IModalTitleProps> = ({ children, className }: IModalTitleProps) => {
  return <Styles.ModalTitle className={className}>{children}</Styles.ModalTitle>;
};
