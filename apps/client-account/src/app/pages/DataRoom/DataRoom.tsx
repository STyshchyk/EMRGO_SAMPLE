import { FC } from "react";

import { AccountsWrapper } from "../../components/AccountsWrapper/AccountsWrapper";
import { DataRoomComponent } from "./DataRoom.component";
import { DataRoomProvider } from "./DataRoom.provider";
import { IDataRoomProps } from "./DataRoom.types";

export const DataRoom: FC<IDataRoomProps> = (props: IDataRoomProps) => {
  return (
    <AccountsWrapper>
      <DataRoomProvider>
        <DataRoomComponent />
      </DataRoomProvider>
    </AccountsWrapper>
  );
};
