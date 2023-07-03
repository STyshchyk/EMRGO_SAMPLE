import { forwardRef } from "react";

import * as Styles from "./Checkbox.styles";
import { ICheckboxProps } from "./Checkbox.types";

export const Checkbox = forwardRef<HTMLInputElement, ICheckboxProps>(
  ({ children, className, ...checkboxProps }, ref) => {
    return (
      <Styles.Label className={className}>
        <Styles.Checkbox {...checkboxProps} type="checkbox" ref={ref} />
        <span>{children}</span>
      </Styles.Label>
    );
  }
);
