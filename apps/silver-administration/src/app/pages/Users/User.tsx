import { FC } from "react";

import { UserComponent } from "./User.component";
import { UserProvider } from "./User.provider";
import { IUserProps } from "./User.types";

export const User: FC<IUserProps> = ({}: IUserProps) => {
  return (
    <UserProvider>
      <UserComponent />
    </UserProvider>
  );
};
