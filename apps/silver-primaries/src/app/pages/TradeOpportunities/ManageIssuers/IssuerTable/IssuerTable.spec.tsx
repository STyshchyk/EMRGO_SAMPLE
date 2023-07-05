import { render } from "@testing-library/react";

import { IssuerTable } from "./IssuerTable";

test("IssuerTable", () => {
  render(<IssuerTable issuances={[]} />);
});
