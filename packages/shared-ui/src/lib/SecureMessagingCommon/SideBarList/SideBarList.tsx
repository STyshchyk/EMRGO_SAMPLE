import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import * as constants from "@emrgo-frontend/constants";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import EventIcon from "@mui/icons-material/Event";
import { reverse } from "named-urls";

import { Button } from "../../Button";
import { AvatarIcon } from "../Avatar";
import * as Styles from "./SideBarList.styles";
import { ISideBarListProps } from "./SideBarList.types";

export const SideBarList: FC<ISideBarListProps> = ({
  messagesList,
  isMessageEditConsoleActive,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Styles.SideBarList>
      <Styles.SidebarList>
        {messagesList.map((message: any) => {
          const route = reverse(`${constants.clientAccountRoutes.secureMessaging.inbox.id}`, {
            id: message.id,
          });
          return (
            <Styles.SidebarListItem key={message.id}>
              <Styles.SidebarListItemLink
                active={location.pathname === route}
                unread={message?.isRead ?? true}
                onClick={(event) => {
                  console.log("click list");
                  navigate(route);
                  if (isMessageEditConsoleActive) isMessageEditConsoleActive();
                }}
              >
                <Styles.Initials checkMode={false}>
                  <AvatarIcon initials={message.enityName} fontSize={11} width={22} />
                </Styles.Initials>
                {/*<Styles.Select checkMode={isCheckModeSelected}>*/}
                {/*  <Checkbox*/}
                {/*    checked={checked.indexOf(message.id) >= 0}*/}
                {/*    onClick={(event) => {*/}
                {/*      event.stopPropagation();*/}
                {/*    }}*/}
                {/*    onChange={(event) => {*/}
                {/*      handleCheck(message.id);*/}
                {/*      if (selectAllRef.current) selectAllRef.current.indeterminate = true;*/}
                {/*    }}*/}
                {/*  />*/}
                {/*</Styles.Select>*/}
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
                <Styles.Delete>
                  <DeleteOutlineIcon onClick={() => {}} />
                </Styles.Delete>
              </Styles.SidebarListItemLink>
            </Styles.SidebarListItem>
          );
        })}
      </Styles.SidebarList>
    </Styles.SideBarList>
  );
};
