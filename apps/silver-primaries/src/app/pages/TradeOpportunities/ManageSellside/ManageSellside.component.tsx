import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

import { silverQueryKeys as queryKeys} from "@emrgo-frontend/constants";
import { silverPrimariesRoutes as routes } from "@emrgo-frontend/constants";
import {
  BreadcrumbLink,
  Breadcrumbs,
  Button,
  DashboardContent,
  Modal,
  Panel,
  PanelContent,
  PanelHeader,
  useToast
} from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";

import { useAddSellsideStore, useSellSideStore } from "../../store/store";
import { AddSellsideModal } from "./AddSellsideModal";
import * as Styles from "./ManageSellside.styles";
import { IManageSellsideProps } from "./ManageSellside.types";
import { doGetAllSellside } from "@emrgo-frontend/services";
import { SellsideTable } from "./SellsideTable";


export const ManageSellsideComponent: FC<IManageSellsideProps> = ({}: IManageSellsideProps) => {
  const navigate = useNavigate();
  const { isModalOpen, modalActions } = useAddSellsideStore();
  const { showErrorToast } = useToast();

  const { sellSideActions } = useSellSideStore();
  const {
    data: sellSideData,
    isError,
    isFetched
  } = useQuery({
    queryFn: doGetAllSellside,
    queryKey: [queryKeys.primaries.tradeOpportunities.sellSide.fetch],
    onError: () => {
      showErrorToast("Error fetching ");
    },
    onSuccess: (data) => {
      // Update store data after alertering SellSide so it contrains up-to-date info
      sellSideActions.setSellSite(data);
    }
  });

  return (
    <Styles.ManageSellside>
      <DashboardContent>

        <Breadcrumbs>
          <BreadcrumbLink as={Link} to={routes.primaries.tradeOpportunity.home}>
            Trade opportunities
          </BreadcrumbLink>
          <BreadcrumbLink isCurrent>{"Manage Sellside"}</BreadcrumbLink>
        </Breadcrumbs>

        <Styles.Button>
          <Button onClick={() => modalActions.setModalOpen(true)}>Add Sellside</Button>
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
            }}
            title={"Add Sellside"}
            showCloseButton={true}
          >
            <AddSellsideModal />
          </Modal>
        </Styles.Button>

        <Panel>
          <PanelHeader>Manage Sellside</PanelHeader>
          <PanelContent>{sellSideData && <SellsideTable sellSide={sellSideData} />}</PanelContent>
        </Panel>
      </DashboardContent>
    </Styles.ManageSellside>
  );
};
