import { FC } from "react";
import { Link } from "react-router-dom";

import { silverPrimariesRoutes as routes } from "@emrgo-frontend/constants";
import {
  BreadcrumbLink,
  Breadcrumbs,
  Panel,
  PanelContent,
  PanelHeader,
  PanelHeaderImage
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useDarkMode } from "usehooks-ts";

import { IssuanceTable } from "../IssuanceTable";
import { useIssuancesContext } from "./Issuances.provider";
import * as Styles from "./Issuances.styles";
import { IIssuancesProps } from "./Issuances.types";

export const IssuancesComponent: FC<IIssuancesProps> = ({}: IIssuancesProps) => {
  const { isDarkMode } = useDarkMode();
  const { data, toggleIssuanceOnWatchlist } = ensureNotNull(useIssuancesContext());
  return (
    <>
      <Styles.Header>
        <Breadcrumbs>
          <BreadcrumbLink as={Link} to={routes.primaries.tradeOpportunity.home}>
            Trade opportunities
          </BreadcrumbLink>
          {data && <BreadcrumbLink isCurrent>{data.name}</BreadcrumbLink>}
        </Breadcrumbs>
      </Styles.Header>

      <Styles.Content>
        {data && (
          <Panel>
            <PanelHeader>
              <PanelHeaderImage src={isDarkMode ? data.logo : data.logo} />
            </PanelHeader>
            <PanelContent>
              <IssuanceTable
                opportunities={data.opportunities}
              />
            </PanelContent>
          </Panel>
        )}
      </Styles.Content>
    </>
  );
};
