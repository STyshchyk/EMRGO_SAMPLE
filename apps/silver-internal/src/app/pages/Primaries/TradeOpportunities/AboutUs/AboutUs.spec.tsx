import { render } from "@testing-library/react";
import noop from "lodash/noop";

import { AboutUs } from "./AboutUs";

test("AboutUs", () => {
  render(<AboutUs onClose={noop} />);
});
