import { FC } from "react";

import { DataRoomIcon } from "@emrgo-frontend/shared-ui";

import * as Styles from "./DownloadButton.styles";
import { IDownloadButtonProps } from "./DownloadButton.types";

export const DownloadButton: FC<IDownloadButtonProps> = (props) => {
  return (
    <Styles.DownloadButton {...props}>
      <DataRoomIcon />
    </Styles.DownloadButton>
  );
};
