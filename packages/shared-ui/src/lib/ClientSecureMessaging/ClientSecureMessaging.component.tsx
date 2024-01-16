import { FC } from "react";
import { Outlet } from "react-router-dom";

import { SecureSideBar } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { TabHeader } from "../SecureMessagingCommon/TabHeader";
import { useClientSecureMessagingContext } from "./ClientSecureMessaging.provider";
import * as Styles from "./ClientSecureMessaging.styles";
import { IClientSecureMessagingProps } from "./ClientSecureMessaging.types";
import { CreateNewMessageContainer } from "./CreateNewMessageContainer";

export const ClientSecureMessagingComponent: FC<IClientSecureMessagingProps> = ({
  children,
}: IClientSecureMessagingProps) => {
  const { isNewMsgGroup } = ensureNotNull(useClientSecureMessagingContext());
  return (
    <Styles.ClientSecureMessaging>
      <TabHeader />
      <Styles.Container>
        <SecureSideBar />
        <Styles.Content>
          {isNewMsgGroup ? <CreateNewMessageContainer key={"sendMsgMode"} /> : <Outlet />}
        </Styles.Content>
      </Styles.Container>
    </Styles.ClientSecureMessaging>
  );
};
