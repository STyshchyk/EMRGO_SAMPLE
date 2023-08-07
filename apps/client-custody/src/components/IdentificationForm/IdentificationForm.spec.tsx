import { render } from "@testing-library/react";
import noop from "lodash/noop";

import { IdentificationForm } from "./IdentificationForm";

test("IdentificationForm", () => {
  render(<IdentificationForm id="" sessionId="" onSubmit={noop} />);
});
