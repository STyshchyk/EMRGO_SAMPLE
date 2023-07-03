import { FC } from "react";
import { Link } from "react-router-dom";

import { clientPrimariesRoutes, getAllRoutes } from "@emrgo-frontend/constants";
import { Badge, ClientTermsModal, Tab, Tabs } from "@emrgo-frontend/shared-ui";
import { ensureNotNull, useMatchedPath } from "@emrgo-frontend/utils";

import { usePrimariesWrapperContext } from "./PrimariesWrapper.provider";
import * as Styles from "./PrimariesWrapper.styles";
import { IPrimariesWrapperProps } from "./PrimariesWrapper.types";

export const PrimariesWrapperComponent: FC<IPrimariesWrapperProps> = ({ children }) => {
  const {
    showClientTermsModal,
    clientTermsDocumentURL,
    onAcceptTerms,
    onDownloadTerms,
    onPrintTerms,
    onShareTerms,
    onRejectTerms,
  } = ensureNotNull(usePrimariesWrapperContext());

  const primariesTabs = [
    {
      label: "Trade Opportunities",
      key: "trade-opportunities",
      paths: getAllRoutes(clientPrimariesRoutes.tradeOpportunities),
      notification: 0,
    },
    {
      label: "Trade Management",
      key: "trade-management",
      paths: getAllRoutes(clientPrimariesRoutes.tradeManagement),
      notification: 1,
    },
    {
      label: "Post Trade",
      key: "post-trade",
      paths: getAllRoutes(clientPrimariesRoutes.postTrade),
      notification: 0,
    },
  ];

  const value = useMatchedPath(primariesTabs);

  return (
    <Styles.Primaries>
      <Tabs value={value}>
        {primariesTabs.map((tab) => (
          <Tab value={tab.key} as={Link} to={tab.paths[0]} key={tab.key}>
            {tab.label}
            {tab.notification > 0 && <Badge>{tab.notification}</Badge>}
          </Tab>
        ))}
      </Tabs>
          
      {children}
      <ClientTermsModal
        isOpen={showClientTermsModal}
        documentURL={clientTermsDocumentURL}
        onAccept={onAcceptTerms}
        onDownload={onDownloadTerms}
        onPrint={onPrintTerms}
        onShare={onShareTerms}
        onReject={onRejectTerms}
      />
    </Styles.Primaries>
  );
};
