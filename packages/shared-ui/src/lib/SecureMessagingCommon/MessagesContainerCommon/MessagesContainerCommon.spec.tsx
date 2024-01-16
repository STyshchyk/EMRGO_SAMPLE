import { render } from "@testing-library/react";

import { MessagesContainerCommon } from "./MessagesContainerCommon";

test("MessagesContainerCommon", () => {
  render(<MessagesContainerCommon sendMode={"internal"} />);
});
