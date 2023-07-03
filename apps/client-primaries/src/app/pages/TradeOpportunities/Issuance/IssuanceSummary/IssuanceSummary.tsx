import { FC } from "react";

import { WatchlistSelectedIcon, WatchlistUnselectedIcon } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useIssuanceContext } from "../Issuance.provider";
import * as Styles from "./IssuanceSummary.styles";
import { IIssuanceSummaryProps } from "./IssuanceSummary.types";

export const IssuanceSummary: FC<IIssuanceSummaryProps> = (props) => {
  const { issuance, toggleIssuanceOnWatchlist } = ensureNotNull(useIssuanceContext());

  if (!issuance) {
    return null;
  }

  return (
    <Styles.Container>
      <Styles.Title>{issuance.name}</Styles.Title>
      <Styles.Status status={issuance.status} />
      <Styles.WatchlistButton onClick={toggleIssuanceOnWatchlist}>
        <Styles.WatchlistButtonIcon>
          {issuance.isWatched && <WatchlistSelectedIcon />}
          {!issuance.isWatched && <WatchlistUnselectedIcon />}
        </Styles.WatchlistButtonIcon>
        Watchlist
      </Styles.WatchlistButton>
    </Styles.Container>
  );
};
