import * as React from "react";
import { FC } from "react";
import { Link, Outlet } from "react-router-dom";

import { Badge, Tab, Tabs } from "@emrgo-frontend/shared-ui";
import { useInternalMatchedPathTabs } from "@emrgo-frontend/utils";

import { silverDataRoomRoutes as routes} from "@emrgo-frontend/constants";
import * as Styles from "./DataRoom.styles";
import { IDataRoomProps } from "./DataRoom.types";

const dataRoomTabs = [
  {
    label: "Platform",
    key: "/data-room/platform",
    paths: [routes.dataRoom.platform],
    path: routes.dataRoom.platform,
    notification: 0
  },
  {
    label: "Opportunities",
    key: "/data-room/opportunities",
    paths:
      [
        routes.dataRoom.opportunities,
        routes.dataRoom.manageDocuments
      ],
    path: routes.dataRoom.opportunities,
    notification: 0
  }
];
export const DataRoomComponent: FC<IDataRoomProps> = ({}: IDataRoomProps) => {
  const value: any = useInternalMatchedPathTabs(dataRoomTabs);
  return (
    <Styles.DataRoom>
      <Tabs value={value}>
        {dataRoomTabs.map((tab) => (
          <Tab value={tab.key} as={Link} to={tab.path} key={tab.key}>
            {tab.label}
            {tab.notification > 0 && <Badge>{tab.notification}</Badge>}
          </Tab>
        ))}
      </Tabs>
      <Outlet />
    </Styles.DataRoom>
  );
};
