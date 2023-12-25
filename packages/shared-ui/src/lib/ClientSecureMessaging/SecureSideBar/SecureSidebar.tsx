import React, { FC } from "react";

import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import EventIcon from "@mui/icons-material/Event";

import { Button } from "../../Button/Button";
import * as Styles from "./SecureSidebar.styles";

export const SecureSideBar: FC = () => {
  return (
    <Styles.DashboardSidebar>
      <Button size={"small"} variant={"secondary"}>
        Create new message
      </Button>
      <nav style={{ padding: "2rem 0" }}>
        <Styles.SidebarList>
          <Styles.SidebarListItem>
            <Styles.SidebarListItemLink onClick={() => {}}>
              <Styles.TextWrapper>
                <Styles.Elipsis>TarasPavl</Styles.Elipsis>
                <Styles.DateWrapper>
                  <EventIcon fontSize={"small"} />
                </Styles.DateWrapper>
              </Styles.TextWrapper>
              <Styles.TextWrapper>
                <Styles.Elipsis>TpavlsddddddddddddasdddddddLtd</Styles.Elipsis>
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
      </nav>
    </Styles.DashboardSidebar>
  );
};
