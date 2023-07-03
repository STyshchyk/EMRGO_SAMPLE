import { FC } from "react";

import * as Styles from "./Property.styles";
import { IPropertyProps } from "./Property.types";

export const Property: FC<IPropertyProps> = ({ children }: IPropertyProps) => {
  return <Styles.Property>{children}</Styles.Property>;
};
