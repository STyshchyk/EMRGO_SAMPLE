import { render } from "@testing-library/react";

import { UserItem } from "./UserItem";

test("UserItem", () => {
  render(<UserItem handleCallback={function (): void {
    throw new Error("Function not implemented.");
  } } />);
});
