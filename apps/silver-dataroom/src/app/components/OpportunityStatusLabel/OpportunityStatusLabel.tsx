import { FC } from "react";

import { getOpportunityStatusLabel } from "../../helpers";
import * as Styles from "./OpportunityStatusLabel.styles";
import { IOpportunityStatusLabelProps } from "./OpportunityStatusLabel.types";

export const OpportunityStatusLabel: FC<IOpportunityStatusLabelProps> = ({ status }) => {
  return <Styles.Label $status={status}>{getOpportunityStatusLabel(status)}</Styles.Label>;
};
