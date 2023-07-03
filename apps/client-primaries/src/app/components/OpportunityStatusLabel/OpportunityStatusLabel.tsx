import { FC } from "react";

import { getOpportunityStatusLabel } from "../../utils/helpers";
import * as Styles from "./OpportunityStatusLabel.styles";
import { IOpportunityStatusLabelProps } from "./OpportunityStatusLabel.types";

export const OpportunityStatusLabel: FC<IOpportunityStatusLabelProps> = ({ status, className }) => {
  return (
    <Styles.Label $status={status} className={className}>
      {getOpportunityStatusLabel(status)}
    </Styles.Label>
  );
};
