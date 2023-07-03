import { render } from "@testing-library/react";
import noop from "lodash/noop";

import { AddCorporateMobileModal } from "./AddCorporateMobileModal";

test("AddCorporateMobileModal", () => {
  render(<AddCorporateMobileModal isOpen onAddNumber={noop} onClose={noop} />);
});
