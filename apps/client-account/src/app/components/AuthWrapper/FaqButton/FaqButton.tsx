import { FC } from "react";

import * as Styles from "./FaqButton.styles";
import { IFaqButtonProps } from "./FaqButton.types";

export const FaqButton: FC<IFaqButtonProps> = (props) => {
  return <Styles.FaqButton {...props}>FAQs</Styles.FaqButton>;
};
