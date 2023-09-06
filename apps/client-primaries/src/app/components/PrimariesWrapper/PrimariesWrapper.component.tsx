import { FC } from "react";
import { Link } from "react-router-dom";

import { clientPrimariesRoutes, getAllRoutes } from "@emrgo-frontend/constants";
import { Badge, Tab, Tabs, TermsModal } from "@emrgo-frontend/shared-ui";
import { ensureNotNull, useMatchedPath } from "@emrgo-frontend/utils";

import { usePrimariesWrapperContext } from "./PrimariesWrapper.provider";
import * as Styles from "./PrimariesWrapper.styles";
import { IPrimariesWrapperProps } from "./PrimariesWrapper.types";

export const PrimariesWrapperComponent: FC<IPrimariesWrapperProps> = ({ children }) => {
  const { user, onAcceptClientTerms, onRejectClientTerms, showTermsModal, termsDocumentURL } =
    ensureNotNull(usePrimariesWrapperContext());

  const hasAcceptedClientTerms = user?.hasAcceptedClientTerms;

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

      <TermsModal
        title="Client Terms"
        subtitle={!hasAcceptedClientTerms ? "Please accept our client terms to proceed." : ""}
        documentURL={termsDocumentURL}
        isOpen={showTermsModal === "client_terms"}
        onAccept={onAcceptClientTerms}
        onReject={onRejectClientTerms}
        // hasAccepted={hasAcceptedClientTerms}
        type={showTermsModal}
        hasAccepted={false}
      />
    </Styles.Primaries>
  );
};
