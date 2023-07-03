import { render } from "@testing-library/react";

import { Dropdown } from "./Dropdown";

test("Dropdown", () => {
  render(<Dropdown items={[{ value: "value", label: "label" }]} />);
});
