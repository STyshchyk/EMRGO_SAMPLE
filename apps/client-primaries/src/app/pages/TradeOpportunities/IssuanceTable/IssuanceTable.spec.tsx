import { render } from "@testing-library/react";

import { IssuanceTable } from "./IssuanceTable";

test("IssuanceTable", () => {
  render(<IssuanceTable issuances={[]} />);
});
