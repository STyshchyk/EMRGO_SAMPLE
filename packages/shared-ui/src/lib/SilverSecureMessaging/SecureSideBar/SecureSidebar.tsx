import React, { FC, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import * as constants from "@emrgo-frontend/constants";
import { ensureNotNull } from "@emrgo-frontend/utils";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import EventIcon from "@mui/icons-material/Event";
import { Avatar } from "@mui/material";
import { reverse } from "named-urls";

import { Button } from "../../Button/Button";
import { Checkbox } from "../../Checkbox/Checkbox";
import { FilterArea } from "../FilterArea";
import { useSilverSecureMessagingContext } from "../SilverSecureMessaging.provider";
import * as Styles from "./SecureSidebar.styles";

export const SecureSideBar: FC = () => {
  const { messagesList, checked, setChecked, isCheckModeSelected, setCheckMode } = ensureNotNull(
    useSilverSecureMessagingContext()
  );
  const localtion = useLocation();
  const navigate = useNavigate();

  const selectAllRef = useRef<HTMLInputElement>(null);

  function handleCheck(value: string) {
    const checkIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (checkIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(checkIndex, 1);
    }
    if (newChecked.length === 0) setCheckMode(false);
    else setCheckMode(true);
    setChecked(newChecked);
  }

  return (
    <Styles.DashboardSidebar>
      <Button size={"medium"} variant={"secondary"}>
        Create new message
      </Button>
      <FilterArea />
      <nav style={{ padding: "2rem 0" }}>
        {messagesList.map((message: any) => {
          const route = reverse(`${constants.clientAccountRoutes.secureMessaging.inbox.id}`, {
            id: message.id,
          });
          return (
            <Styles.SidebarList key={message.id}>
              <Styles.SidebarListItem>
                <Styles.SidebarListItemLink
                  active={localtion.pathname === route}
                  unread={message?.isRead ?? true}
                  onClick={() => {
                    navigate(route);
                  }}
                >
                  <Styles.Initials checkMode={isCheckModeSelected}>
                    <Avatar sx={{ width: 34, height: 34 }}>
                      {message.enityName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                  </Styles.Initials>
                  <Styles.Select checkMode={isCheckModeSelected}>
                    <Checkbox
                      checked={checked.indexOf(message.id) >= 0}
                      onChange={(event) => {
                        handleCheck(message.id);
                        if (selectAllRef.current) selectAllRef.current.indeterminate = true;
                      }}
                    />
                  </Styles.Select>
                  <Styles.TextWrapper>
                    <Styles.Elipsis>{message.enityName}</Styles.Elipsis>
                    <Styles.DateWrapper>
                      <EventIcon fontSize={"small"} />
                    </Styles.DateWrapper>
                  </Styles.TextWrapper>
                  <Styles.TextWrapper>
                    <Styles.Elipsis>{message.subject}</Styles.Elipsis>
                    <Styles.DateWrapper>2024.24.52</Styles.DateWrapper>
                  </Styles.TextWrapper>
                  <Styles.TextWrapper>
                    <Button size={"small"} variant={"primary"}>
                      Status
                    </Button>
                    <Styles.DateWrapper isActive={false} hover={true}>
                      <EmojiFlagsIcon fontSize={"small"} onClick={() => {}} />
                    </Styles.DateWrapper>
                  </Styles.TextWrapper>
                </Styles.SidebarListItemLink>
              </Styles.SidebarListItem>
            </Styles.SidebarList>
          );
        })}
      </nav>
    </Styles.DashboardSidebar>
  );
};
