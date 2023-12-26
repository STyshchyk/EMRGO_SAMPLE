import React, { FC, useRef } from "react";

import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import EventIcon from "@mui/icons-material/Event";
import FilterListIcon from "@mui/icons-material/FilterList";
import Tooltip from "@mui/material/Tooltip";

import { Button } from "../../Button/Button";
import { Checkbox } from "../../Checkbox/Checkbox";
import * as Styles from "./SecureSidebar.styles";

const list = [
  {
    id: "1asd131",
    enityName: "Tara Pavls",
    subject: "Password reset",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf14fas",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf14fa3s",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf14f4as",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf14f5as",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf14f6as",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf147fas",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf148fas",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
  {
    id: "2asdasf14f34as",
    enityName: "Elonor Doe",
    subject: "Password 2fa",
    date: new Date(),
    isSelected: false,
  },
];
export const SecureSideBar: FC = () => {
  const [checked, setChecked] = React.useState([]);
  const [isCheckModeSelected, setCheckMode] = React.useState(false);
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

  function selectAll() {
    const newChecked = [...checked];
    list.forEach((elem) => {
      if (newChecked.indexOf(elem.id) === -1) newChecked.push(elem.id);
    });
    setChecked(newChecked);

    setCheckMode(true);
  }

  function diSelectAll() {
    setChecked([]);
    setCheckMode(false);

    selectAllRef.current.checked = false;
    selectAllRef.current.indeterminate = false;
  }

  return (
    <Styles.DashboardSidebar>
      <Button size={"medium"} variant={"secondary"}>
        Create new message
      </Button>
      <Styles.FilterArea>
        <Tooltip title={"Select All"} placement="top" aria-hidden={false}>
          <Checkbox
            style={{
              display: isCheckModeSelected ? "inline-flex" : "none",
            }}
            ref={selectAllRef}
            onChange={(event) => {
              if (event.target.checked) selectAll();
              else diSelectAll();
            }}
          />
        </Tooltip>
        <div>
          <Tooltip title={"Sort"} placement="top">
            <FilterListIcon />
          </Tooltip>
          <Tooltip title={"Select"} placement="top">
            <Checkbox
              onChange={() => {
                setCheckMode((prevState) => !prevState);
                isCheckModeSelected && diSelectAll();
              }}
              checked={isCheckModeSelected}
            />
          </Tooltip>
        </div>
      </Styles.FilterArea>
      <nav style={{ padding: "2rem 0" }}>
        {list.map((message) => {
          return (
            <Styles.SidebarList key={message.id}>
              <Styles.SidebarListItem>
                <Styles.SidebarListItemLink onClick={() => {}}>
                  <Styles.Initials checkMode={isCheckModeSelected}>
                    {message.enityName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Styles.Initials>
                  <Styles.Select checkMode={isCheckModeSelected}>
                    <Checkbox
                      checked={checked.indexOf(message.id) >= 0}
                      onChange={(event) => {
                        handleCheck(message.id);
                        selectAllRef.current.indeterminate = true;
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
