import { FC } from "react";

import * as Styles from "./ModalFooter.styles";
import { IModalFooterProps } from "./ModalFooter.types";

export const ModalFooter: FC<IModalFooterProps> = ({ children }: IModalFooterProps) => {
  return <Styles.ModalFooter>{children}</Styles.ModalFooter>;
};
