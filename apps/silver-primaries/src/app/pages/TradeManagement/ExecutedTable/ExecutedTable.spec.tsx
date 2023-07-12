import { render } from "@testing-library/react";

import { ExecutedTable } from "./ExecutedTable";

test("IssuanceTable", () => {
  render(<ExecutedTable opportunities={[]} onToggleIssuanceOnWatchlist={() => {}} />);
});
