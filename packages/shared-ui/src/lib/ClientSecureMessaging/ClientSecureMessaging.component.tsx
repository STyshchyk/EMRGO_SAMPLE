import { FC } from "react";
import { Outlet } from "react-router-dom";

import { SecureSideBar } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useFilters } from "../Context/filter-context";
import { TabHeader } from "../SecureMessagingCommon/TabHeader";
import { useClientSecureMessagingContext } from "./ClientSecureMessaging.provider";
import * as Styles from "./ClientSecureMessaging.styles";
import { IClientSecureMessagingProps } from "./ClientSecureMessaging.types";
import { CreateNewMessageContainer } from "./CreateNewMessageContainer";

export const ClientSecureMessagingComponent: FC<IClientSecureMessagingProps> = ({
  children,
}: IClientSecureMessagingProps) => {
  const { messagesList } = ensureNotNull(useClientSecureMessagingContext());
  const { isNewMsgGroup, setNewMsgGroup } = useFilters();
  const isCreateMessageModeEnabled = isNewMsgGroup === "sent" || isNewMsgGroup === "draft";
  return (
    <Styles.ClientSecureMessaging>
      <TabHeader />
      <Styles.Container>
        <SecureSideBar messageList={messagesList} setNewMsgGroup={setNewMsgGroup} type={"client"} />
        <Styles.Content>
          {isCreateMessageModeEnabled ? (
            <CreateNewMessageContainer key={isNewMsgGroup} />
          ) : (
            <Outlet />
          )}
        </Styles.Content>
      </Styles.Container>
    </Styles.ClientSecureMessaging>
  );
};
