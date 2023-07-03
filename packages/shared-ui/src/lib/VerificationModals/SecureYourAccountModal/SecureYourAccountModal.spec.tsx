import { render } from "@testing-library/react";
import noop from "lodash/noop";

import { SecureYourAccountModal } from "./SecureYourAccountModal";

test("SecureYourAccountModal", () => {
  render(
    <SecureYourAccountModal isOpen onClose={noop} onSecureByApp={noop} onSecureByText={noop} />
  );
});
