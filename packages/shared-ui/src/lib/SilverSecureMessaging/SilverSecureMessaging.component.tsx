import { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { SecureSideBar } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useFilters } from "../Context/filter-context";
import { MessagesContainerCommon, TabHeader } from "../SecureMessagingCommon";
import { GroupMessagingAuditHistory } from "../SecureMessagingCommon/AuditLogs";
import { CreateNewMessageContainer } from "./CreateNewMessageContainer";
import { useSilverSecureMessagingContext } from "./SilverSecureMessaging.provider";
import * as Styles from "./SilverSecureMessaging.styles";
import { ISilverSecureMessagingProps } from "./SilverSecureMessaging.types";

export const SilverSecureMessagingComponent: FC<ISilverSecureMessagingProps> = ({
  children,
}: ISilverSecureMessagingProps) => {
  const { messagesList } = ensureNotNull(useSilverSecureMessagingContext());
  const { isNewMsgGroup, setNewMsgGroup, auditUrl, setAuditUrl } = useFilters();
  const isCreateMessageModeEnabled = isNewMsgGroup === "sent" || isNewMsgGroup === "draft";
  return (
    <Styles.SilverSecureMessaging>
      <TabHeader />
      <Styles.Container>
        <GroupMessagingAuditHistory
          open={auditUrl.length > 0}
          handleClose={() => {
            setAuditUrl("");
          }}
        />
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
