import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

import * as constants from "@emrgo-frontend/constants";

import { Button } from "../../Button";
import { FilterArea } from "../FilterArea";
import { SideBarList } from "../SideBarList";
import * as Styles from "./SecureSidebar.styles";
import { ISidebarProps } from "./SecureSidebar.types";

export const SecureSideBar: FC<ISidebarProps> = ({ type, setNewMsgGroup, messageList }) => {
  const navigate = useNavigate();
  return (
    <Styles.DashboardSidebar>
      <Button
        size={"medium"}
        variant={"secondary"}
        onClick={() => {
          setNewMsgGroup("sent");
          navigate(constants.clientAccountRoutes.secureMessaging.inbox.home);
        }}
      >
        Create new message
      </Button>
      <FilterArea />
      <SideBarList
        type={type}
        messagesList={messageList}
        isMessageEditConsoleActive={() => {
          setNewMsgGroup("none");
        }}
      />
    </Styles.DashboardSidebar>
  );
};
