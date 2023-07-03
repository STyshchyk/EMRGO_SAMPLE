import { FC } from "react";
import { Link } from "react-router-dom";

import {
  Hyperlink,
  Panel,
  PanelContent,
  PanelHeader,
  PanelHeaderRight,
  PanelHeaderTitle,
  PdfIcon,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import pluralize from "pluralize";

import { useIssuanceContext } from "../Issuance.provider";
import * as Styles from "./IssuanceDataRoomPanel.styles";
import { IIssuanceDataRoomPanelProps } from "./IssuanceDataRoomPanel.types";

export const IssuanceDataRoomPanel: FC<IIssuanceDataRoomPanelProps> = (props) => {
  const { documents, totalNumberOfDocuments } = ensureNotNull(useIssuanceContext());

  return (
    <Panel>
      <PanelHeader>
        <PanelHeaderTitle>
          Data room{" "}
          <Styles.DataRoomNumber>
            ({pluralize("doc", totalNumberOfDocuments, true)})
          </Styles.DataRoomNumber>
        </PanelHeaderTitle>

        <PanelHeaderRight>
          <Hyperlink as={Link} to="data-room">
            View all
          </Hyperlink>
        </PanelHeaderRight>
      </PanelHeader>
      <PanelContent>
        <Styles.Documents>
          {documents.map((document) => (
            <Styles.Document key={document.id}>
              <Styles.DocumentIcon>
                <PdfIcon />
              </Styles.DocumentIcon>

              {document.name}
            </Styles.Document>
          ))}
        </Styles.Documents>
      </PanelContent>
    </Panel>
  );
};
