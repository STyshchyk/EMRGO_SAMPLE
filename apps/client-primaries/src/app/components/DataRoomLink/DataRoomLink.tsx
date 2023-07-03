import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { DataRoomIcon } from "@emrgo-frontend/shared-ui";

import * as Styles from "./DataRoomLink.styles";
import { IDataRoomLinkProps } from "./DataRoomLink.types";

export const DataRoomLink: FC<IDataRoomLinkProps> = ({ path }) => {
  const navigate = useNavigate();

  const redirectToDataroom = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    navigate(path);
  };

  return (
    <Styles.DataRoomLink onClick={(e: React.MouseEvent<HTMLElement>) => redirectToDataroom(e)}>
      <DataRoomIcon />
      <Styles.DataRoomLinkLabel>View</Styles.DataRoomLinkLabel>
    </Styles.DataRoomLink>
  );
};
