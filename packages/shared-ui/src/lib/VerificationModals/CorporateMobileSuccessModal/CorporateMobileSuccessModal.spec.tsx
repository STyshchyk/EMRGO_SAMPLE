import { render } from "@testing-library/react";
import noop from "lodash/noop";

import { CorporateMobileSuccessModal } from "./CorporateMobileSuccessModal";

test("CorporateMobileSuccessModal", () => {
  render(<CorporateMobileSuccessModal isOpen onClose={noop} />);
});
