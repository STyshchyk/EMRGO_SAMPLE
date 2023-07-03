import { FC } from "react";

import * as Styles from "./PropertyKey.styles";
import { IPropertyKeyProps } from "./PropertyKey.types";

export const PropertyKey: FC<IPropertyKeyProps> = ({ children }: IPropertyKeyProps) => {
  return <Styles.PropertyKey>{children}</Styles.PropertyKey>;
};
