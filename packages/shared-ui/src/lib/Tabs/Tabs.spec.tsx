import { render } from "@testing-library/react";
import noop from "lodash/noop";

import { Tabs } from "./Tabs";

test("Tabs", () => {
  render(<Tabs onChange={noop} value="1" />);
});
