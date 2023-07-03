import { render } from "@testing-library/react";

import { Input } from "./Input";

test("Input", () => {
  render(<Input value="" onChange={() => {}} label="" />);
});
