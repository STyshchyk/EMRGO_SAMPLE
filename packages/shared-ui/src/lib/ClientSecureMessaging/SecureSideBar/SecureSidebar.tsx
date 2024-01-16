import React, { FC, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { Button } from "../../Button";
import { SideBarList } from "../../SecureMessagingCommon";
import { FilterArea } from "../../SecureMessagingCommon/FilterArea";
import { useClientSecureMessagingContext } from "../ClientSecureMessaging.provider";
import * as Styles from "./SecureSidebar.styles";

export const SecureSideBar: FC = () => {
  const {
    messagesList,
    checked,
    setChecked,
    isCheckModeSelected,
    isNewMsgGroup,
    setNewMsgGroup,
    setCheckMode,
  } = ensureNotNull(useClientSecureMessagingContext());
  const localtion = useLocation();
  const navigate = useNavigate();

  const selectAllRef = useRef<HTMLInputElement>(null);

  // function handleCheck(value: string) {
  //   const checkIndex = checked.indexOf(value);
  //   const newChecked = [...checked];
  //   if (checkIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(checkIndex, 1);
  //   }
  //   if (newChecked.length === 0) setCheckMode(false);
  //   else setCheckMode(true);
  //   setChecked(newChecked);
  // }

  return (
    <Styles.DashboardSidebar>
      <Button
        size={"medium"}
        variant={"secondary"}
        onClick={() => {
          setNewMsgGroup(true);
        }}
      >
        Create new message
      </Button>
      <FilterArea />
      <SideBarList
        messagesList={messagesList}
        isMessageEditConsoleActive={() => {
          setNewMsgGroup(false);
        }}
      />
    </Styles.DashboardSidebar>
  );
};
