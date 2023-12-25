import { FC } from "react";
import { Outlet } from "react-router-dom";

import { SecureSideBar } from "@emrgo-frontend/shared-ui";

import * as Styles from "./ClientSecureMessaging.styles";
import { IClientSecureMessagingProps } from "./ClientSecureMessaging.types";

export const ClientSecureMessagingComponent: FC<IClientSecureMessagingProps> = ({
  children,
}: IClientSecureMessagingProps) => {
  return (
    <Styles.ClientSecureMessaging>
      <Styles.TabHeader>hello</Styles.TabHeader>
      <Styles.Container>
        <SecureSideBar />
        <Styles.Content>
          <Outlet />
        </Styles.Content>
      </Styles.Container>
    </Styles.ClientSecureMessaging>
  );
};
