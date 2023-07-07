import React from "react";
import { useParams } from "react-router-dom";

import { Panel, PanelContent, PanelHeader } from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { useOpportunityStore } from "../../store/store";
import { getOpportunityDocuments } from "@emrgo-frontend/services";
import { DocumentTable } from "./DocumentTable";

export const DocumentTableComponent = () => {
  const { id } = useParams();
  const opportunities = useOpportunityStore(state => state.opportunityDocs);

  const { data, isError } = useQuery([queryKeys.primaries.tradeOpportunities.documents, id], {
    queryFn: () => getOpportunityDocuments(id ?? ""),
    onSuccess: (data) => {
    }
  });
  return (
    <Panel>
      <PanelHeader>
        {opportunities && opportunities.name}
      </PanelHeader>
      <PanelContent>
        {data && !isError && <DocumentTable documents={data} />}
      </PanelContent>
    </Panel>
  );
};

export default DocumentTableComponent;
