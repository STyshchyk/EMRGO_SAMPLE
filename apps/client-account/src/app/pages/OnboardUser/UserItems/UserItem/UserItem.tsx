import { FC } from "react";

import {
  Button,
} from "@emrgo-frontend/shared-ui";

import * as Styles from "./UserItem.styles";
import { IUserItemProps } from "./UserItem.types";

export const UserItem: FC<IUserItemProps> = ({
  children,
  handleCallback,
  disabled
}) => {
  return (
    <Styles.UserItem>
      {children}

      <Styles.Spacer/>

      <Button variant="primary" onClick={handleCallback} disabled={disabled}>
        View
      </Button>
    </Styles.UserItem>
  );
};
