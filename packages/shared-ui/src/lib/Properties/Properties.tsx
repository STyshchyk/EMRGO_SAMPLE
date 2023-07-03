import { FC } from "react";

import * as Styles from "./Properties.styles";
import { IPropertiesProps } from "./Properties.types";

export const Properties: FC<IPropertiesProps> = ({ children, className }: IPropertiesProps) => {
  return <Styles.Properties className={className}>{children}</Styles.Properties>;
};
