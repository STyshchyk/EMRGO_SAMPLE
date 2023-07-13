import { render } from "@testing-library/react";

import { DataRoomLink } from "./DataRoomLink";

test("DataRoomLink", () => {
  render(<DataRoomLink to="/" />);
});
