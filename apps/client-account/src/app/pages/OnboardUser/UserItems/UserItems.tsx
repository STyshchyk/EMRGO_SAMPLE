import { FC } from "react";

import * as Styles from "./UserItems.styles";
import { IUserItemsProps } from "./UserItems.types";

export const UserItems: FC<IUserItemsProps> = ({ children }) => {
  return <Styles.UserItems>{children}</Styles.UserItems>;
};
