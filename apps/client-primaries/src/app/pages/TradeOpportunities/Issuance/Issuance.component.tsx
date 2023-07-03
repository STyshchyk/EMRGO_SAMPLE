import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  BreadcrumbLink,
  Breadcrumbs,
  DashboardChildPageContent,
  DashboardHeader,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull, issuanceBreadcrumbRoutes } from "@emrgo-frontend/utils";

import { useIssuanceContext } from "./Issuance.provider";
import * as Styles from "./Issuance.styles";
import { IIssuanceProps } from "./Issuance.types";
import { IssuanceDataRoomPanel } from "./IssuanceDataRoomPanel";
import { IssuanceLearnMorePanel } from "./IssuanceLearnMorePanel";
import { IssuanceLifecyclePanel } from "./IssuanceLifecyclePanel";
import { IssuanceOverviewPanel } from "./IssuanceOverviewPanel";
import { IssuanceSummary } from "./IssuanceSummary";
import { IssuanceTradeExecutionPanel } from "./IssuanceTradeExecutionPanel";

export const IssuanceComponent: FC<IIssuanceProps> = (props: IIssuanceProps) => {
  const { issuance } = ensureNotNull(useIssuanceContext());
  const sellSide = issuance?.sellSide;

  const location = useLocation();
  const { pathname } = location;

  const breadcrumbsArray = issuanceBreadcrumbRoutes(pathname, issuance);

  return (
    <>
      <DashboardHeader>
        <Breadcrumbs>
          {breadcrumbsArray.map((crumb) => {
            return (
              <BreadcrumbLink as={Link} to={crumb.path} isCurrent={crumb.isCurrent}>
                {crumb.title}
              </BreadcrumbLink>
            );
          })}
        </Breadcrumbs>
      </DashboardHeader>

      <DashboardChildPageContent>
        {issuance && (
          <>
            <IssuanceSummary />

            <Styles.Details>
              <IssuanceOverviewPanel />
              <IssuanceLifecyclePanel />
              <IssuanceLearnMorePanel />
              <IssuanceDataRoomPanel />
              <IssuanceTradeExecutionPanel />
            </Styles.Details>
          </>
        )}
      </DashboardChildPageContent>
    </>
  );
};
