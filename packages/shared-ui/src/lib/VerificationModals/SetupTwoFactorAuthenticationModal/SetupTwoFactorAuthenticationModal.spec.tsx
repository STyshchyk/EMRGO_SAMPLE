import { render } from "@testing-library/react";
import noop from "lodash/noop";

import { SetupTwoFactorAuthenticationModal } from "./SetupTwoFactorAuthenticationModal";

test("SetupTwoFactorAuthenticationModal", () => {
  render(
    <SetupTwoFactorAuthenticationModal
      isOpen
      onBack={noop}
      onSetup={() => {
        console.log("setup");
      }}
    />
  );
});
