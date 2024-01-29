import { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { SecureSideBar } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useFilters } from "../Context/filter-context";
import { MessagesContainerCommon, TabHeader } from "../SecureMessagingCommon";
import { CreateNewMessageContainer } from "./CreateNewMessageContainer";
import { useSilverSecureMessagingContext } from "./SilverSecureMessaging.provider";
import * as Styles from "./SilverSecureMessaging.styles";
import { ISilverSecureMessagingProps } from "./SilverSecureMessaging.types";

export const SilverSecureMessagingComponent: FC<ISilverSecureMessagingProps> = ({
  children,
}: ISilverSecureMessagingProps) => {
  const { messagesList } = ensureNotNull(useSilverSecureMessagingContext());
  const { isNewMsgGroup, setNewMsgGroup } = useFilters();
  const isCreateMessageModeEnabled = isNewMsgGroup === "sent" || isNewMsgGroup === "draft";
  return (
    <Styles.SilverSecureMessaging>
      <TabHeader />
      <Styles.Container>
        <SecureSideBar
          messageList={messagesList}
          setNewMsgGroup={setNewMsgGroup}
          type={"internal"}
        />
        <Styles.Content>
          {isCreateMessageModeEnabled ? (
            <CreateNewMessageContainer key={isNewMsgGroup} />
          ) : (
            <>
              <Routes>
                <Route
                  path="id/:id"
                  element={<MessagesContainerCommon sendMode={"internal"} />}
                ></Route>
              </Routes>
            </>
          )}
        </Styles.Content>
      </Styles.Container>
    </Styles.SilverSecureMessaging>
  );
};
