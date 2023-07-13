import { render } from "@testing-library/react";

import { DocumentTable } from "./DocumentTable";

test("DocumentTable", () => {
  render(<DocumentTable opportunities={[]} />);
});
