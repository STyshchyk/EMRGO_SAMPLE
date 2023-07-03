import { FC } from "react";

import * as Styles from "./IconButton.styles";
import { IIconButtonProps } from "./IconButton.types";

export const IconButton: FC<IIconButtonProps> = (props: IIconButtonProps) => {
  return <Styles.IconButton {...props} />;
};
