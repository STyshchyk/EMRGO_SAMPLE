import { FC } from "react";
import { Outlet } from "react-router-dom";

import { SecureSideBar } from "@emrgo-frontend/shared-ui";

import * as Styles from "./ClientSecureMessaging.styles";
import { IClientSecureMessagingProps } from "./ClientSecureMessaging.types";
import { TabHeader } from "./TabHeader";

export const ClientSecureMessagingComponent: FC<IClientSecureMessagingProps> = ({
  children,
}: IClientSecureMessagingProps) => {
  return (
    <Styles.ClientSecureMessaging>
      <TabHeader />
      <Styles.Container>
        <SecureSideBar />
        <Styles.Content>
          <Outlet />
        </Styles.Content>
      </Styles.Container>
    </Styles.ClientSecureMessaging>
  );
};
