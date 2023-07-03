import { FC } from "react";

import * as Styles from "./ModalSubtitle.styles";
import { IModalSubtitleProps } from "./ModalSubtitle.types";

export const ModalSubtitle: FC<IModalSubtitleProps> = ({ children }: IModalSubtitleProps) => {
  return <Styles.ModalSubtitle>{children}</Styles.ModalSubtitle>;
};
