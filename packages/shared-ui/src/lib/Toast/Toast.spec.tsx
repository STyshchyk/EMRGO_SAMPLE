import { render } from "@testing-library/react";

import { Toast } from "./Toast";

test("Toast", () => {
  render(<Toast variant="success" />);
});
