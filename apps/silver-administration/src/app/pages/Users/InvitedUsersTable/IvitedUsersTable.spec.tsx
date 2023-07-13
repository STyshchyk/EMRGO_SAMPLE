import { render } from "@testing-library/react";

import { IvitedUsersTable } from "./IvitedUsersTable";

test("IssuanceTable", () => {
  render(<IvitedUsersTable users={[]} />);
});
