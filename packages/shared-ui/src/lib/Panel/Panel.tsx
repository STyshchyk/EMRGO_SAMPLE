import { FC } from "react";

import * as Styles from "./Panel.styles";
import { IPanelProps } from "./Panel.types";

export const Panel: FC<IPanelProps> = ({
  variant = "standard",
  children,
  className,
}: IPanelProps) => {
  return (
    <Styles.Panel $variant={variant} className={className}>
      {children}
    </Styles.Panel>
  );
};
