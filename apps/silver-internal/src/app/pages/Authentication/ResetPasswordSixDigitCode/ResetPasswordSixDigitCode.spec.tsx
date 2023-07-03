import { render } from "@testing-library/react";

import { ResetPasswordSixDigitCode } from "./ResetPasswordSixDigitCode";

test("ResetPasswordSixDigitCode", () => {
  render(<ResetPasswordSixDigitCode method="auth" />);
});
