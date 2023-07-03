import { forwardRef } from "react";

import * as Styles from "./RadioButton.styles";
import { IRadioButtonProps } from "./RadioButton.types";

export const RadioButton = forwardRef<HTMLInputElement, IRadioButtonProps>(
  ({ children, className, ...radioButtonProps }, ref) => {
    return (
      <Styles.Label className={className}>
        <Styles.RadioButton {...radioButtonProps} type="radio" ref={ref} />
        <span>{children}</span>
      </Styles.Label>
    );
  }
);
