import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  BreadcrumbLink,
  Breadcrumbs,
  DashboardChildPageContent,
  DashboardHeader,
  Dropdown,
  Panel,
  PanelContent,
  PanelHeader,
  PanelHeaderImage,
  SearchInput,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull, issuanceBreadcrumbRoutes } from "@emrgo-frontend/utils";

import { DownloadButton } from "../DownloadButton";
import { IssuanceTable } from "../IssuanceTable";
import { useIssuancesContext } from "./Issuances.provider";
import * as Styles from "./Issuances.styles";
import { IIssuancesProps } from "./Issuances.types";

export const IssuancesComponent: FC<IIssuancesProps> = (props: IIssuancesProps) => {
  const {
    data,
    goToIssuanceDetails,
    toggleIssuanceOnWatchlist,
    downloadData,
    searchQuery,
    setSearchQuery,
    filterType,
    selectProductType,
    filterStatus,
    selectProductStatus,
    productTypes,
    productStatus,
  } = ensureNotNull(useIssuancesContext());

  const location = useLocation();
  const { pathname } = location;

  const issuance = {
    sellSide: {
      id: data?.bankId || "",
      name: data?.name || "",
      logo: data?.logo || "",
    },
  };

  const breadcrumbsArray = issuanceBreadcrumbRoutes(pathname, issuance);

  return (
    <>
      <DashboardHeader>
        <Breadcrumbs>
          <Breadcrumbs>
            {breadcrumbsArray.map((crumb) => {
              return (
                <BreadcrumbLink as={Link} to={crumb.path} isCurrent={crumb.isCurrent}>
                  {crumb.title}
                </BreadcrumbLink>
              );
            })}
          </Breadcrumbs>
        </Breadcrumbs>
      </DashboardHeader>

      <DashboardChildPageContent>
        <Styles.Actions>
          <SearchInput
            value={searchQuery}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(event.target.value)
            }
          />
          <Dropdown items={productTypes || []} value={filterType} onChange={selectProductType} />
          <Dropdown
            items={productStatus || []}
            value={filterStatus}
            onChange={selectProductStatus}
          />
          <DownloadButton onClick={downloadData} />
        </Styles.Actions>
        {data && (
          <Panel>
            <PanelHeader>
              <PanelHeaderImage src={data.logo} />
            </PanelHeader>
            <PanelContent>
              <IssuanceTable
                bankId={data.bankId}
                opportunities={data?.opportunities || []}
                onToggleIssuanceOnWatchlist={toggleIssuanceOnWatchlist}
                onIssuanceClick={goToIssuanceDetails}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                pageSize={100}
              />
            </PanelContent>
          </Panel>
        )}
      </DashboardChildPageContent>
    </>
  );
};
