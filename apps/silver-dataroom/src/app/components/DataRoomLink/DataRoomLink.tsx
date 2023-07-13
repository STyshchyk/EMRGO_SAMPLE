import { FC } from "react";

import { DataRoomIcon } from "@emrgo-frontend/shared-ui";

import * as Styles from "./DataRoomLink.styles";
import { IDataRoomLinkProps } from "./DataRoomLink.types";

export const DataRoomLink: FC<IDataRoomLinkProps> = (props) => {
  return (
    <Styles.DataRoomLink {...props}>
      <DataRoomIcon />
      <Styles.DataRoomLinkLabel>View</Styles.DataRoomLinkLabel>
    </Styles.DataRoomLink>
  );
};
