import { FC } from "react";

import * as Styles from "./KYCSectionItem.styles";
import { IKYCSectionItemProps } from "./KYCSectionItem.types";

export const KYCSectionItem: FC<IKYCSectionItemProps> = ({
  label,
  timeRemaining,
  hasCompleted,
}) => {
  return (
    <Styles.KYCSectionItem>
      <Styles.Text>{label}</Styles.Text>
      <Styles.Spacer />
      {!hasCompleted && <Styles.Time>{`${timeRemaining} minutes`}</Styles.Time>}
      {hasCompleted && <Styles.CompletedIcon />}
    </Styles.KYCSectionItem>
  );
};
