import { FC } from "react";

import * as Styles from "./TextBox.styles";
import { ITextBoxProps } from "./TextBox.types";

export const TextBox: FC<ITextBoxProps> = ({
  maxWidth,
  className,
  rows,
  ...rest
}: ITextBoxProps) => {
  return <Styles.Textarea $maxWidth={maxWidth} rows={rows} className={className} {...rest} />;
};
