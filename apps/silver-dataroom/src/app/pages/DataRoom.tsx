import { FC } from "react";

import { SilverDashboardWrapper } from "@emrgo-frontend/shared-ui";

import { DataRoomComponent } from "./DataRoom.component";
import { DataRoomProvider } from "./DataRoom.provider";
import { IDataRoomProps } from "./DataRoom.types";

export const DataRoom: FC<IDataRoomProps> = ({}: IDataRoomProps) => {
  return (
    <SilverDashboardWrapper>
      <DataRoomProvider>
        <DataRoomComponent />
      </DataRoomProvider>
    </SilverDashboardWrapper>
  );
};
