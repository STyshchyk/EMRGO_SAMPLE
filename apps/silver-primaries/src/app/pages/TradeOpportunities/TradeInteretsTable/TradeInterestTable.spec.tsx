import { render } from "@testing-library/react";

import { TradeInterestTable } from "./TradeInterestTable";

test("IssuanceTable", () => {
  render(<TradeInterestTable opportunities={[]} onToggleIssuanceOnWatchlist={() => {}} />);
});
