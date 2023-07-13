import { FC } from "react";
import { Link } from "react-router-dom";

import { silverDataRoomRoutes as routes} from "@emrgo-frontend/constants";
import { BreadcrumbLink, Breadcrumbs, Button, DashboardContent, Modal } from "@emrgo-frontend/shared-ui";

import { useAddDocumentsModal } from "../../store/store";
import { AddDocument } from "../AddDocumentModal";
import { DocumentTableComponent } from "../DocumentTable";
import * as Styles from "./ManageDocuments.styles";
import { IManageDocumentsProps } from "./ManageDocuments.types";

export const ManageDocumentsComponent: FC<IManageDocumentsProps> = ({}: IManageDocumentsProps) => {
  const { isModalOpen, modalActions } = useAddDocumentsModal();
  return <Styles.ManageDocuments>
    <DashboardContent>
      <Breadcrumbs>
        <BreadcrumbLink as={Link} to={routes.dataRoom.opportunities}>
          Opportunities
        </BreadcrumbLink>
        <BreadcrumbLink isCurrent>{"Manage Documents"}</BreadcrumbLink>
      </Breadcrumbs>
      <Styles.Button>
        <Button onClick={() => {
          modalActions.setModalOpen(true);
        }
        }>Add Document</Button>
      </Styles.Button>

      <DocumentTableComponent />
      <Modal
        isOpen={isModalOpen}
        showCloseButton={true}
        title={"Add Document"}
        width={768}
        onClose={() => {
          modalActions.setModalOpen(false);
        }}>
        <AddDocument />
      </Modal>
    </DashboardContent>
  </Styles.ManageDocuments>;
};
