import { render } from "@testing-library/react";

import { SellsideTable } from "./SellsideTable";

test("SellsideTable", () => {
  render(<SellsideTable sellSide={[]} />);
});
