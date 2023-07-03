import { render } from "@testing-library/react";

import { AccordionPanel } from "./AccordionPanel";

test("AccordionPanel", () => {
  render(<AccordionPanel id="panel" />);
});
