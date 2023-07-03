import "./InviteUser.scss";

import React from "react";

import { InviteUserComponent } from "./InviteUser.component";
import { InviteUserProvider } from "./InviteUser.provider";

export const InviteUser = () => {
  return (
    <InviteUserProvider>
      <InviteUserComponent />
    </InviteUserProvider>
  );
};
