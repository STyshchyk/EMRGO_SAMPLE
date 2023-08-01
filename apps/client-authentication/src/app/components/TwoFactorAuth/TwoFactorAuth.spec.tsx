import { render } from "@testing-library/react";

import { TwoFactorAuth } from "./TwoFactorAuth";

test("TwoFactorAuth", () => {
  render(<TwoFactorAuth position={"absolute"} otpauth_url={""} secret={""} mode={1} />);
});
