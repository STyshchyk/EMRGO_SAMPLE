import { render } from "@testing-library/react";

import { TwoFAstepper } from "./TwoFAstepper";

test("TwoFAstepper", () => {
  render(<TwoFAstepper mode={1} otpauth_url={""} secret={""} />);
});
