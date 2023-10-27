import { FC } from "react";

import * as Styles from "./TextBox.styles";
import { ITextBoxProps } from "./TextBox.types";

export const TextBox: FC<ITextBoxProps> = ({
  maxWidth,
  className,
  rows,
  error,
  ...rest
}: ITextBoxProps) => {
  return (
   <Styles.Wrapper> 
    <Styles.Textarea $maxWidth={maxWidth} rows={rows} className={className} {...rest} />
    {!!error && (
      <Styles.Error>
        <Styles.ErrorIcon />
        <span>{error}</span>
      </Styles.Error>
    )}
  </Styles.Wrapper>
  )
};
