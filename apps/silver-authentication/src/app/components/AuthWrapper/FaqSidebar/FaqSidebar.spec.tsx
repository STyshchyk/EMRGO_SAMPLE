import { render } from "@testing-library/react";
import noop from "lodash/noop";

import { FaqSidebar } from "./FaqSidebar";

test("FaqSidebar", () => {
  render(<FaqSidebar isOpen={false} onClose={noop} />);
});
