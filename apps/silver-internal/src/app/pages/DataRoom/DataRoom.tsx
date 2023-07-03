import { FC } from "react";

import { DataRoomComponent } from "./DataRoom.component";
import { DataRoomProvider } from "./DataRoom.provider";
import { IDataRoomProps } from "./DataRoom.types";

export const DataRoom: FC<IDataRoomProps> = ({}: IDataRoomProps) => {
  return (
    <DataRoomProvider>
      <DataRoomComponent />
    </DataRoomProvider>
  );
};
