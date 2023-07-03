import { FC } from "react";

import * as Styles from "./ModalContent.styles";
import { IModalContentProps } from "./ModalContent.types";

export const ModalContent: FC<IModalContentProps> = ({ children }: IModalContentProps) => {
  return <Styles.ModalContent>{children}</Styles.ModalContent>;
};
