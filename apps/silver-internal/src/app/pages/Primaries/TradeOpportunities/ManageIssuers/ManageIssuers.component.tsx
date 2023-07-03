import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  BreadcrumbLink,
  Breadcrumbs,
  Button,
  DashboardContent,
  Modal,
  Panel,
  PanelContent,
  PanelHeader
} from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../../constants";
import routes from "../../../../constants/routes";
import { useAddIssuerStore, useIssuerStore } from "../../store/store";
import { AddIssuersModal } from "./AddIssuersModal";
import { getIssuers } from "./Issuer.services";
import { IssuerTable } from "./IssuerTable";
import * as Styles from "./ManageIssuers.styles";
import { IManageIssuersProps } from "./ManageIssuers.types";

export const ManageIssuersComponent: FC<IManageIssuersProps> = ({}: IManageIssuersProps) => {
  const navigate = useNavigate();
  const { isModalOpen, modalActions } = useAddIssuerStore();
  const { issuerAction } = useIssuerStore();
  const {
    data: issuerData,
    isError,
    isFetched
  } = useQuery({
    queryFn: getIssuers,
    queryKey: [queryKeys.primaries.tradeOpportunities.issuers.fetch],
    onSuccess: (data) => {
      // Update store data after alertering Issuer so it contrains up-to-date info
      issuerAction.setIsssuer(data);
    }
  });
  return (
    <Styles.ManageIssuers>
      <DashboardContent>
        <Breadcrumbs>
          <BreadcrumbLink as={Link} to={routes.dash.primaries.tradeOpportunityHome}>
            Trade opportunities
          </BreadcrumbLink>
          <BreadcrumbLink isCurrent>{"Manage Issuers"}</BreadcrumbLink>
        </Breadcrumbs>
        <Styles.Button>
          <Button onClick={() => modalActions.setModalOpen(true)}>Add Issuers</Button>
          {/*<Button*/}
          {/*  onClick={() => {*/}
          {/*    navigate(routes.dash.primaries.tradeOpportunity.home);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  Opportunities List*/}
          {/*</Button>*/}
          <Modal
            isOpen={isModalOpen}
            width={768}
            onClose={() => {
              modalActions.setModalOpen(false);
              if (modalActions.deleteModifyData) modalActions.deleteModifyData();
            }}
            title={"Add Issuers"}
            showCloseButton={true}
            shaded={true}
          >
            <AddIssuersModal />
          </Modal>
        </Styles.Button>

        <Panel>
          <PanelHeader>Manage Issuers</PanelHeader>
          <PanelContent>{issuerData && <IssuerTable issuances={issuerData} />}</PanelContent>
        </Panel>
      </DashboardContent>
    </Styles.ManageIssuers>
  );
};
