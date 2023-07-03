import { render } from "@testing-library/react";
import noop from "lodash/noop";

import { EnterOTPCodeModal } from "./EnterOTPCodeModal";

test("EnterOTPCodeModal", () => {
  render(<EnterOTPCodeModal isOpen onClose={noop} onSetup={noop} />);
});
