import { render } from "@testing-library/react";

import { InvitedUsersTable } from "./InvitedUsersTable";

test("InvitedUsersTable", () => {
  render(<InvitedUsersTable users={[]} />);
});
