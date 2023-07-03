import { render } from "@testing-library/react";
import noop from "lodash/noop";

import { EnterEmailAddressModal } from "./EnterEmailAddressModal";

test("EnterEmailAddressModal", () => {
  render(<EnterEmailAddressModal isOpen onAddNumber={noop} onClose={noop} />);
});
