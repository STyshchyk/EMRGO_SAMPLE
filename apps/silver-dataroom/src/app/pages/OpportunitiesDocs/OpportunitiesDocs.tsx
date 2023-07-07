import { FC } from "react";

import { OpportunitiesDocsComponent } from "./OpportunitiesDocs.component";
import { OpportunitiesDocsProvider } from "./OpportunitiesDocs.provider";
import { IOpportunitiesDocsProps } from "./OpportunitiesDocs.types";
import { DataRoom } from "../DataRoom";

export const OpportunitiesDocs: FC<IOpportunitiesDocsProps> = ({}: IOpportunitiesDocsProps) => {
  return (
    <OpportunitiesDocsProvider>
        <OpportunitiesDocsComponent />
    </OpportunitiesDocsProvider>
  );
};
