import { FC } from "react";

import pluralize from "pluralize";

import * as Styles from "./DataRoomDocumentCount.styles";
import { IDataRoomDocumentCountProps } from "./DataRoomDocumentCount.types";

export const DataRoomDocumentCount: FC<IDataRoomDocumentCountProps> = ({ numberOfDocuments }) => {
  return (
    <Styles.DataRoomDocumentCount>
      ({pluralize("doc", numberOfDocuments, true)})
    </Styles.DataRoomDocumentCount>
  );
};
