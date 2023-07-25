import { FC } from "react";

import { DataRoom } from "../DataRoom";
import { OpportunitiesDocsComponent } from "./OpportunitiesDocs.component";
import { OpportunitiesDocsProvider } from "./OpportunitiesDocs.provider";
import { IOpportunitiesDocsProps } from "./OpportunitiesDocs.types";

export const OpportunitiesDocs: FC<IOpportunitiesDocsProps> = ({}: IOpportunitiesDocsProps) => {
  return (
    <OpportunitiesDocsProvider>
      <OpportunitiesDocsComponent />
    </OpportunitiesDocsProvider>
  );
};
