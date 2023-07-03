import { render } from "@testing-library/react";

import { Tooltip } from "./Tooltip";

test("Tooltip", () => {
  render(
    <Tooltip content="Content">
      <span />
    </Tooltip>
  );
});
