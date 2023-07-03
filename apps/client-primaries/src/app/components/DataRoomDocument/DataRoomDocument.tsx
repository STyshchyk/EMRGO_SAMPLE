import { FC } from "react";

import { PdfIcon } from "@emrgo-frontend/shared-ui";

import * as Styles from "./DataRoomDocument.styles";
import { IDataRoomDocumentProps } from "./DataRoomDocument.types";

export const DataRoomDocument: FC<IDataRoomDocumentProps> = ({ document }) => {
  return (
    <Styles.Document>
      <Styles.DocumentIcon>
        <PdfIcon />
      </Styles.DocumentIcon>

      {document.name}
    </Styles.Document>
  );
};
