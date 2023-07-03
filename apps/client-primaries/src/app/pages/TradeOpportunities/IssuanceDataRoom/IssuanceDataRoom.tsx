import { FC } from "react";

import { PrimariesWrapper } from "../../../components/PrimariesWrapper/PrimariesWrapper";
import { IssuanceDataRoomComponent } from "./IssuanceDataRoom.component";
import { IssuanceDataRoomProvider } from "./IssuanceDataRoom.provider";
import { IIssuanceDataRoomProps } from "./IssuanceDataRoom.types";

export const IssuanceDataRoom: FC<IIssuanceDataRoomProps> = (props: IIssuanceDataRoomProps) => {
  return (
    <PrimariesWrapper>
      <IssuanceDataRoomProvider>
        <IssuanceDataRoomComponent />
      </IssuanceDataRoomProvider>
    </PrimariesWrapper>
  );
};
