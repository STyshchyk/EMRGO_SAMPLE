import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  BreadcrumbLink,
  Breadcrumbs,
  DashboardChildPageContent,
  DashboardSubheader,
  Panel,
  PanelContent,
  PanelHeader,
  PanelHeaderTitle,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull, issuanceBreadcrumbRoutes } from "@emrgo-frontend/utils";

import { DataRoomDocument } from "../../../components/DataRoomDocument";
import { DataRoomDocumentCount } from "../../../components/DataRoomDocumentCount";
import { useIssuanceDataRoomContext } from "./IssuanceDataRoom.provider";
import * as Styles from "./IssuanceDataRoom.styles";
import { IIssuanceDataRoomProps } from "./IssuanceDataRoom.types";

export const IssuanceDataRoomComponent: FC<IIssuanceDataRoomProps> = (
  props: IIssuanceDataRoomProps
) => {
  const { issuance } = ensureNotNull(useIssuanceDataRoomContext());
  const documents = issuance?.documents;

  const location = useLocation();
  const { pathname } = location;

  const breadcrumbsArray = issuanceBreadcrumbRoutes(pathname, issuance);

  return (
    <>
      <DashboardSubheader>
        <Breadcrumbs>
          {breadcrumbsArray.map((crumb) => {
            return (
              <BreadcrumbLink as={Link} to={crumb.path} isCurrent={crumb.isCurrent}>
                {crumb.title}
              </BreadcrumbLink>
            );
          })}
        </Breadcrumbs>
      </DashboardSubheader>

      <DashboardChildPageContent>
        <Panel>
          <PanelHeader>
            <PanelHeaderTitle>
              {issuance?.name} - Data Room{" "}
              <DataRoomDocumentCount numberOfDocuments={documents?.length || 0} />
            </PanelHeaderTitle>
          </PanelHeader>
          <PanelContent>
            <Styles.Documents>
              {documents?.map((document) => (
                <DataRoomDocument key={document.id} document={document} />
              ))}
            </Styles.Documents>
          </PanelContent>
        </Panel>
      </DashboardChildPageContent>
    </>
  );
};
