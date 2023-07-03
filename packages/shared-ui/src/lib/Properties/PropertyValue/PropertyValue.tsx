import { FC } from "react";

import * as Styles from "./PropertyValue.styles";
import { IPropertyValueProps } from "./PropertyValue.types";

export const PropertyValue: FC<IPropertyValueProps> = ({ children }: IPropertyValueProps) => {
  return <Styles.PropertyValue>{children}</Styles.PropertyValue>;
};
