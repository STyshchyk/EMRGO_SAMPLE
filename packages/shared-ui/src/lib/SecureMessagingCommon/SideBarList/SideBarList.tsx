import React, { FC } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import * as constants from "@emrgo-frontend/constants";
import { customDateFormat, extractId } from "@emrgo-frontend/utils";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import EventIcon from "@mui/icons-material/Event";
import { reverse } from "named-urls";

import { Button } from "../../Button";
import { FilterConsumer, useFilters } from "../../Context/filter-context";
import { Spinner } from "../../Spinner";
import { AvatarIcon } from "../Avatar";
import { useDeleteGroup, useUpdateMessageFlag } from "../Hooks";
import * as Styles from "./SideBarList.styles";
import { ISideBarListProps } from "./SideBarList.types";

export const SideBarList: FC<ISideBarListProps> = ({
  messagesList,
  isMessageEditConsoleActive,
  type,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = useParams();
  const { setNewMsgGroup, isNewMsgGroup } = useFilters();
  const { mutate: deleteGroup } = useDeleteGroup();
  const { mutate: updateGroupFlag } = useUpdateMessageFlag();
  if (!messagesList) return <Spinner />;

  return (
    <Styles.SideBarList>
      <Styles.SidebarList>
        <FilterConsumer>
          {({ messageType }) => {
            const filteredData = messagesList.filter((elem) => {
              const isDraftMsg = messageType === "Draft" && elem.groupStatus === "Draft";
              const isArchivedMsg = messageType === "Archived" && elem.groupStatus === "archived";
              const isMsgSent =
                messageType === "Sent" && elem.groupStatus === "Sent" && elem.entityType === type;
              const isMsgRecieved = messageType === "Received" && elem.entityType !== type;

              return isDraftMsg || isArchivedMsg || isMsgSent || isMsgRecieved;
            });

            return (
              <>
                {filteredData.map((message: any) => {
                  const route = reverse(
                    `${constants.clientAccountRoutes.secureMessaging.inbox.id}`,
                    { id: message.id }
                  );
                  const currentRoute = extractId(id);
                  const creatorInfo = message.creator;
                  const isMessageTypeDraft = message?.groupStatus === "Draft";
                  return (
                    <Styles.SidebarListItem key={message.id}>
                      <Styles.SidebarListItemLink
                        $IsActive={location.pathname === route ? true : false}
                        $IsNew={true}
                        $IsDisabled={false}
                        onClick={(event) => {
                          if (isMessageTypeDraft) {
                            // Change mode to write message and navigate so sidebar matches with drafted message
                            navigate(route);
                            setNewMsgGroup("draft");
                            return;
                          }
                          if (currentRoute !== message.id) navigate(route);
                          if (isMessageEditConsoleActive) isMessageEditConsoleActive();
                        }}
                      >
                        <Styles.Initials $isCheckMode={false}>
                          <AvatarIcon initials={creatorInfo} fontSize={11} width={22} />
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
                          <Styles.Elipsis>
                            {creatorInfo.firstName} {creatorInfo.lastName}
                          </Styles.Elipsis>
                          <Styles.DateWrapper>
                            <EventIcon fontSize={"small"} />
                          </Styles.DateWrapper>
                        </Styles.TextWrapper>
                        <Styles.TextWrapper>
                          <Styles.Elipsis>{message.subject}</Styles.Elipsis>
                          <Styles.DateWrapper>
                            {customDateFormat(message.updatedAt)}
                          </Styles.DateWrapper>
                        </Styles.TextWrapper>
                        <Styles.TextWrapper>
                          <Styles.Elipsis className={"font-black"}>
                            {message.label.label}
                          </Styles.Elipsis>
                        </Styles.TextWrapper>
                        <Styles.TextWrapper>
                          <Button size={"small"} variant={"primary"}>
                            Status
                          </Button>
                          <Styles.DateWrapper
                            $isActive={message?.isFlagged ?? false}
                            $isHover={true}
                            onClick={(event) => {
                              event.stopPropagation();
                              updateGroupFlag({
                                id: message.id,
                                wrapper: type,
                                status: message.isFlagged ? "off" : "on",
                              });
                            }}
                          >
                            <EmojiFlagsIcon fontSize={"small"} onClick={() => {}} />
                          </Styles.DateWrapper>
                        </Styles.TextWrapper>
                        <Styles.Delete
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteGroup({ id: message.id, wrapper: type });
                          }}
                        >
                          <DeleteOutlineIcon />
                        </Styles.Delete>
                      </Styles.SidebarListItemLink>
                    </Styles.SidebarListItem>
                  );
                })}
              </>
            );
          }}
        </FilterConsumer>
      </Styles.SidebarList>
    </Styles.SideBarList>
  );
};
