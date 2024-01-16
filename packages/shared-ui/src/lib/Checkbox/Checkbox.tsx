import { forwardRef } from "react";

import * as Styles from "./Checkbox.styles";
import { ICheckboxProps } from "./Checkbox.types";

export const Checkbox = forwardRef<HTMLInputElement, ICheckboxProps>(
  ({ children, className, ...checkboxProps }, ref) => {
    return (
      <Styles.Label className={className}>
        <Styles.Checkbox {...checkboxProps} type="checkbox" ref={ref} />
        <Styles.LabelText>{children}</Styles.LabelText>
      </Styles.Label>
    );
  }
);
